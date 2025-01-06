import * as process from 'process';
import { config } from 'dotenv';

config();

export const getS3Config = () => ({
  s3: {
    endPoint: process.env.S3_END_POINT,
    port: +process.env.S3_PORT,
    useSSL: process.env.S3_USE_SSL === 'true',
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION ?? 'us-east-1',
  },
  staticObject: {
    cloudFrontDomain: process.env.S3_CLOUD_FRONT_DOMAIN,
    bucketName: process.env.S3_BUCKET_NAME,
    prefix: {
      userProfileImages:
        process.env.S3_PREFIX_USER_PROFILES ?? 'users/profile-images/',
    },
  },
});
