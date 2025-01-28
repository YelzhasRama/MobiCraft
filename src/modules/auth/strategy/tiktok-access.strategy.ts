import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { getTiktokAuthCOnfig } from '../../../configs/tiktok-auth.config';

const tiktik = getTiktokAuthCOnfig();

@Injectable()
export class TiktokAccessStrategy extends PassportStrategy(Strategy, 'tiktok') {
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken: accessToken,
      profile: profile,
    };
  }
}
