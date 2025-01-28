import { config } from 'dotenv';
import * as process from 'node:process';
import { NotFoundException } from '@nestjs/common';

config();

export const getInstagramAuthConfig = () => {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectURL =
    process.env.INSTAGRAM_REDIRECT_URI ||
    'http://localhost:3000/auth/instagram/callback';

  if (!clientId || !clientSecret || !redirectURL) {
    throw new NotFoundException(
      'Instagram OAuth configuration is incomplete. Check environment variables.',
    );
  }

  return {
    clientId,
    clientSecret,
    redirectURL,
  };
};
