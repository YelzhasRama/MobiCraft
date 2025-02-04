import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { getAuthConfig } from '../../../common/constants/auth.config';
import { AuthTokens } from '../models/auth-tokens';
import { UsersRepository } from '../../users/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenType } from '../../../common/constants/auth-token-type';
import { AuthRepository } from '../repository/auth.repository';
import { LoginDto } from '../dto/login.dto';
import { RegisterBody } from '../bodies/register.body';
import { MailingService } from './mailing.service';
import { EmailVerificationCodesRepository } from '../repository/email-verification-codes.repository';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { UpdateProfileBody } from '../bodies/update-profile.body';
// import { getInstagramAuthConfig } from '../../../configs/instagram-auth.config';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(utc);

@Injectable()
export class AuthService {
  authConfig = getAuthConfig();

  constructor(
    private readonly userRefreshTokenRepository: AuthRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
    private readonly emailVerificationCodesRepository: EmailVerificationCodesRepository,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterBody): Promise<AuthTokens> {
    const { email, password: rawPassword } = payload;

    const existingUser = await this.userRepository.getOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        `User with ${existingUser.email} email already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await this.userRepository.createUser({
      ...payload,
      password: hashedPassword,
    });

    const { access, refresh } = await this.generateTokens({
      userId: newUser.id,
    });

    await this.userRefreshTokenRepository.save({
      userId: newUser.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  async updateProfile(userId: number, body: UpdateProfileBody) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    Object.assign(user, body);
    return this.userRepository.save(user);
  }

  async login(payload: LoginDto): Promise<AuthTokens> {
    const { email, password } = payload;

    const user = await this.userRepository.getOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ${email} email does not exists`);
    }

    if (!user.password) {
      throw new BadRequestException('User has not set password yet');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { access, refresh } = await this.generateTokens({ userId: user.id });

    await this.userRefreshTokenRepository.save({
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  logout(userId: number): Promise<void> {
    return this.userRefreshTokenRepository.deleteOneByUserId(userId);
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const userRefreshToken =
      await this.userRefreshTokenRepository.getOneByUserIdAndToken(
        userId,
        refreshToken,
      );
    if (!userRefreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (dayjs.utc().isAfter(dayjs(userRefreshToken.expiresAt))) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} id does not exist`);
    }

    const { access, refresh } = await this.generateTokens({ userId: user.id });

    await this.userRefreshTokenRepository.save({
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...payload,
          type: AuthTokenType.Access,
        },
        {
          secret: this.authConfig.jwt.access.secret,
          expiresIn: this.authConfig.jwt.access.expiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          ...payload,
          type: AuthTokenType.Refresh,
        },
        {
          secret: this.authConfig.jwt.refresh.secret,
          expiresIn: this.authConfig.jwt.refresh.expiresIn,
        },
      ),
    ]);

    return {
      access: {
        token: accessToken,
        expiresAt: dayjs()
          .add(this.authConfig.jwt.access.expiresIn, 'second')
          .utc()
          .toISOString(),
      },
      refresh: {
        token: refreshToken,
        expiresAt: dayjs()
          .add(this.authConfig.jwt.refresh.expiresIn, 'second')
          .utc()
          .toISOString(),
      },
    };
  }

  async generateAndSendEmailVerificationCode(userId: number): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} id does not exist`);
    }

    if (user.emailVerifiedAt) {
      throw new ConflictException('Email already verified');
    }

    const verificationCode = this.generateCode();
    const expiresAt = dayjs().add(1, 'day').utc().toISOString();

    await this.mailingService.sendEmailVerificationMail(
      user.email,
      verificationCode,
    );

    await this.emailVerificationCodesRepository.upsertAndFetchOne({
      userId,
      code: verificationCode,
      expiresAt,
    });
  }

  private generateCode(): string {
    return Math.floor(Math.random() * 8999 + 1000).toString();
  }

  async verifyEmail(payload: VerifyEmailDto): Promise<void> {
    const { userId, code } = payload;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} id does not exist`);
    } else if (user.emailVerifiedAt) {
      throw new ConflictException('Email already verified');
    }

    const emailVerificationCode =
      await this.emailVerificationCodesRepository.findByUserId(user.id);
    if (!emailVerificationCode) {
      throw new BadRequestException('Email verification code not found');
    }

    if (emailVerificationCode.code !== code) {
      throw new BadRequestException('Invalid email verification code');
    }

    if (dayjs().isAfter(dayjs(emailVerificationCode.expiresAt))) {
      throw new BadRequestException('Email verification code has expired');
    }

    if (emailVerificationCode.usedAt) {
      throw new BadRequestException('Email verification code already used');
    }

    await this.emailVerificationCodesRepository.setAsUsedByUserId(user.id);
    await this.userRepository.verifyUserById(user.id);
  }

  // TIKTOK
  private stateStore = new Map<string, { codeVerifier: string }>();

  async loginWithTiktok(): Promise<{
    url: string;
    csrfToken: string;
  }> {
    const csrfState = Math.random().toString(36).substring(2);
    const { codeVerifier, codeChallenge } = await this.generatePKCE();

    // Сохраняем state и code_verifier
    this.stateStore.set(csrfState, { codeVerifier });

    const clientKey = this.configService.get<string>('TIKTOK_CLIENT_ID');
    const redirectUrl = this.configService.get<string>('TIKTOK_REDIRECT_URL');
    const scope = 'user.info.basic';

    const BASE_URL = 'https://www.tiktok.com/v2/auth/authorize/';

    const url = new URL(BASE_URL);

    url.searchParams.append('client_key', clientKey);
    url.searchParams.append('redirect_uri', redirectUrl);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', scope);
    url.searchParams.append('state', csrfState);

    return {
      url: url.toString(),
      csrfToken: csrfState,
    };
  }

  private async generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    return { codeVerifier, codeChallenge };
  }

  async handleTiktokCallback(code: string, state: string) {
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

    const clientId = this.configService.get<string>('TIKTOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');
    const redirectUrl = this.configService.get<string>('TIKTOK_REDIRECT_URL');

    try {
      const params = new URLSearchParams({
        client_key: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code: decodeURI(code),
      });

      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.data) {
        throw new NotFoundException(
          'Invalid response from TikTok API: missing open_id',
        );
      }

      return await this.registerOrLoginTikTok(response.data.open_id);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange code for access token');
    }
  }

  async registerOrLoginTikTok(open_id: string): Promise<AuthTokens> {
    const existingUserByOpenId =
      await this.userRepository.getOneByOpenId(open_id);
    if (existingUserByOpenId) {
      const { access, refresh } = await this.generateTokens({
        userId: existingUserByOpenId.id,
      });

      await this.userRefreshTokenRepository.save({
        userId: existingUserByOpenId.id,
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      });

      return {
        access: {
          token: access.token,
          expiresAt: access.expiresAt,
        },
        refresh: {
          token: refresh.token,
          expiresAt: refresh.expiresAt,
        },
      };
    }

    const email = 'qwerty@gmail.com'; // основной email пользователя
    const uniqueEmail = `${email.split('@')[0]}-${uuidv4()}@${email.split('@')[1]}`;

    const newUser = await this.userRepository.createUserByOpenId(
      uniqueEmail,
      'qwerty',
      open_id,
    );

    const { access, refresh } = await this.generateTokens({
      userId: newUser.id,
    });

    await this.userRefreshTokenRepository.save({
      userId: newUser.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  // GOOGLE
  private stateGoogleStore = new Map<string, { codeVerifier: string }>();

  async loginWithGoogle(): Promise<{
    url: string;
    csrfToken: string;
  }> {
    const csrfState = Math.random().toString(36).substring(2);
    const { codeVerifier, codeChallenge } = await this.generatePKCE();

    // Сохраняем state и code_verifier
    this.stateGoogleStore.set(csrfState, { codeVerifier });

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUrl = this.configService.get<string>('GOOGLE_REDIRECT_URL');
    const scope = 'openid email profile';

    const BASE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    const url = new URL(BASE_URL);

    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUrl);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', scope);
    url.searchParams.append('state', csrfState);

    return {
      url: url.toString(),
      csrfToken: csrfState,
    };
  }

  async handleGoogleCallback(code: string, state: string) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUrl = this.configService.get<string>('GOOGLE_REDIRECT_URL');

    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code: decodeURI(code),
      });

      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.data) {
        throw new NotFoundException(
          'Invalid response from TikTok API: missing open_id',
        );
      }

      const idToken = response.data.id_token;
      if (!idToken) {
        throw new NotFoundException('Id_token not found in the response');
      }

      const decodeToken = jwt.decode(idToken) as { sub: string };
      const openId = decodeToken.sub + '';

      return await this.registerOrLoginGoogle(openId);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange code for access token');
    }
  }

  async registerOrLoginGoogle(open_id: string): Promise<AuthTokens> {
    const existingUserByOpenId =
      await this.userRepository.getOneByOpenId(open_id);
    if (existingUserByOpenId) {
      const { access, refresh } = await this.generateTokens({
        userId: existingUserByOpenId.id,
      });

      await this.userRefreshTokenRepository.save({
        userId: existingUserByOpenId.id,
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      });

      return {
        access: {
          token: access.token,
          expiresAt: access.expiresAt,
        },
        refresh: {
          token: refresh.token,
          expiresAt: refresh.expiresAt,
        },
      };
    }

    const email = 'qwerty@gmail.com'; // основной email пользователя
    const uniqueEmail = `${email.split('@')[0]}-${uuidv4()}@${email.split('@')[1]}`;

    const newUser = await this.userRepository.createUserByOpenId(
      uniqueEmail,
      'qwerty',
      open_id,
    );

    const { access, refresh } = await this.generateTokens({
      userId: newUser.id,
    });

    await this.userRefreshTokenRepository.save({
      userId: newUser.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }
}
