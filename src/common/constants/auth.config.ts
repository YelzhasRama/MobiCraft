import { config } from 'dotenv';

config();

export const getAuthConfig = () => ({
  authCodeLength: 4,
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: +process.env.JWT_ACCESS_EXPIRES_IN || 60 * 60, // 1h
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: +process.env.JWT_REFRESH_EXPIRES_IN || 30 * 24 * 60 * 60, // 30d
    },
  },
});
