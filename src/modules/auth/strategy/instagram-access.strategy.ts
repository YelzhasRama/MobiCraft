import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
// import { getInstagramAuthConfig } from '../../../configs/instagram-auth.config';

// const instaConfig = getInstagramAuthConfig();

@Injectable()
export class InstagramAccessStrategy extends PassportStrategy(
  Strategy,
  'instagram',
) {
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken: accessToken,
      profile: profile,
    };
  }
}
