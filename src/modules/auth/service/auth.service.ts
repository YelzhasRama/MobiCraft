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
import { getInstagramAuthConfig } from '../../../configs/instagram-auth.config';
import axios from 'axios';
import * as crypto from 'crypto';

dayjs.extend(utc);

@Injectable()
export class AuthService {
  authConfig = getAuthConfig();
  instaConfig = getInstagramAuthConfig();

  constructor(
    private readonly userRefreshTokenRepository: AuthRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
    private readonly emailVerificationCodesRepository: EmailVerificationCodesRepository,
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

  async logout(userId: number): Promise<void> {
    await this.userRefreshTokenRepository.deleteOneByUserId(userId);
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

  async loginWithInstagram(): Promise<string> {
    // const { clientId, redirectURL } = this.instaConfig;
    const scope = 'user_profile,user_media';

    // Формируем URL для авторизации Instagram
    return (
      `https://api.instagram.com/oauth/authorize?client_id=2907596709415042` +
      `&redirect_uri=http://localhost:3000/auth/instagram/callback&response_type=code&scope=${scope}`
    );
  }

  async handleInstagramCallback(code: string) {
    const { clientId, clientSecret, redirectURL } = this.instaConfig;

    const tokenUrl = 'https://api.instagram.com/oauth/access_token';

    try {
      // Получение access_token
      const response = await axios.post(tokenUrl, null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectURL,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data; // Вернет access_token и user_id
    } catch (error) {
      throw new BadRequestException(
        'Failed to exchange code for access token',
        error,
      );
    }
  }

  async getInstagramUser(accessToken: string) {
    try {
      const response = await axios.get('https://graph.instagram.com/me', {
        params: {
          fields: 'id,username,account_type',
          access_token: accessToken,
        },
      });

      return response.data; // Возвращает профиль пользователя
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch Instagram user data',
        error,
      );
    }
  }

  //// Tiktok
  private stateStore = new Map<string, { codeVerifier: string }>();
  async loginWithTiktok(): Promise<string> {
    const csrfState = Math.random().toString(36).substring(2); // Случайное состояние
    const { codeVerifier, codeChallenge } = await this.generatePKCE();

    // Сохраняем state и code_verifier
    this.stateStore.set(csrfState, { codeVerifier });

    const client_key = 'sbawqpwpgmi0fvv65c';
    const redirectUrl =
      'https://mobicraft-production.up.railway.app/auth/tiktok/callback';
    const scope = 'user.info.basic';

    // Генерация URL с PKCE
    return `https://www.tiktok.com/auth/authorize?client_key=${client_key}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${csrfState}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  }

  async generatePKCE() {
    // Генерация случайного code_verifier
    const codeVerifier = crypto.randomBytes(32).toString('base64url'); // Base64-URL-encoded

    // Генерация code_challenge с использованием SHA-256
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url'); // Base64-URL-encoded

    return { codeVerifier, codeChallenge };
  }

  // Проверка state
  validateState(state: string): boolean {
    if (this.stateStore.has(state)) {
      this.stateStore.delete(state); // Удаляем state после использования
      return true;
    }
    return false;
  }

  // Обработка callback и получение токенов
  async handleTiktokCallback(code: string, state: string) {
    if (!this.stateStore.has(state)) {
      throw new Error('Invalid state parameter');
    }

    const { codeVerifier } = this.stateStore.get(state)!; // Получаем code_verifier для данного состояния
    this.stateStore.delete(state); // Удаляем state после использования

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

    try {
      // Запрос на получение access_token
      const response = await axios.post(tokenUrl, null, {
        params: {
          client_id: 'sbawqpwpgmi0fvv65c',
          client_secret: 'ldAD2y6VgqFkFcmhfDYFsgXt0tggjrcx',
          grant_type: 'authorization_code',
          redirect_uri: 'https://mobicraft-production.up.railway.app/auth/tiktok/callback',
          code,
          code_verifier: codeVerifier, // Передаем code_verifier
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data; // Возвращает access_token и user_id
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange code for access token');
    }
  }

  // Получение информации о пользователе
  async getTiktokUser(accessToken: string): Promise<any> {
    const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/';

    try {
      const response = await axios.get(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data; // Возвращаем данные пользователя
    } catch (error) {
      throw new BadRequestException('Failed to fetch TikTok user data', error);
    }
  }
}
