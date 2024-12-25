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

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRefreshTokenEntity]),
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
  ],
})
export class AuthModule {}
