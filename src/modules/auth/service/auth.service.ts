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
import { RegisterDto } from '../dto/register.dto';
import { AuthTokens } from '../models/auth-tokens';
import { UsersRepository } from '../../users/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../../common/constants/user-role';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenType } from '../../../common/constants/auth-token-type';
import { AuthRepository } from '../repository/auth.repository';
import { LoginDto } from '../dto/login.dto';

dayjs.extend(utc);

@Injectable()
export class AuthService {
  authConfig = getAuthConfig();

  constructor(
    private readonly userRefreshTokenRepository: AuthRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<AuthTokens> {
    const { email, password: rawPassword } = payload;

    const existingUser = await this.userRepository.getOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        `User with ${existingUser.email} email already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      role: UserRole.CLIENT,
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
}
