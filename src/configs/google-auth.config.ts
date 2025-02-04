import { config } from 'dotenv';
import * as process from 'node:process';

config();

export const getTiktokAuthCOnfig = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_REDIRECT_URL,
});

// export const getInstgaramAuthConfig = () => ({
//   clientIds: {
//     [AuthClientType.Ios]: process.env.GOOGLE_IOS_CLIENT_ID,
//     [AuthClientType.Android]: process.env.GOOGLE_ANDROID_CLIENT_ID,
//   },
// });
