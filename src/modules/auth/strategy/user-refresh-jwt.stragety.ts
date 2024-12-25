import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getAuthConfig } from '../../../common/constants/auth.config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenType } from '../../../common/constants/auth-token-type';

@Injectable()
export class UserRefreshJwtStragety extends PassportStrategy(
  Strategy,
  'user-refresh-jwt',
) {
  constructor(private readonly jwtService: JwtService) {
    const authConfig = getAuthConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.refresh.secret,
      passReqToCallback: true,
    });
  }

  validate(
    request: Request,
  ): { userId: number; refreshToken: string } | boolean {
    const token = request.headers['authorization'].replace('Bearer', '').trim();

    if (
      !token ||
      !this.jwtService.verify(token, {
        secret: getAuthConfig().jwt.refresh.secret,
      })
    ) {
      return false;
    }

    const userId = this.jwtService.decode(token)['userId'];
    const type = this.jwtService.decode(token)['type'];
    if (!userId || !type) {
      return false;
    }

    if (type !== AuthTokenType.Refresh) {
      return false;
    }

    return { refreshToken: token, userId: +userId };
  }
}
