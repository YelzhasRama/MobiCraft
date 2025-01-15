import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { UserRefreshTokenEntity } from '../../common/entities/user-refresh-token.entity';
import { UserAccessJwtStrategy } from './strategy/user-access-jwt.strategy';
import { UserRefreshJwtStragety } from './strategy/user-refresh-jwt.stragety';
import { PassportModule } from '@nestjs/passport';
import { MailingService } from './service/mailing.service';
import { EmailVerificationCodesRepository } from './repository/email-verification-codes.repository';
import { EmailVerificationCodeEntity } from '../../common/entities/email-verification-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRefreshTokenEntity,
      EmailVerificationCodeEntity,
    ]),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtService,
    UserAccessJwtStrategy,
    UserRefreshJwtStragety,
    MailingService,
    EmailVerificationCodesRepository,
  ],
  exports: [MailingService],
})
export class AuthModule {}
