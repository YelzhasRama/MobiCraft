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
      // userProfileImages: process.env.S3_PREFIX_USER_PROFILES ?? 'users/profile-images/',
      // companyProfileImages: process.env.S3_PREFIX_COMPANY_PROFILES ?? 'companies/profile-images/',
      // placeImages: process.env.S3_PREFIX_PLACE_IMAGES ?? 'places/images/',
      // placeProfileImages: process.env.S3_PREFIX_PLACE_IMAGES ?? 'places/profile-images/',
      // eventImages: process.env.S3_PREFIX_EVENT_IMAGES ?? 'events/images/',
      // reactions: process.env.S3_PREFIX_EVENT_REACTIONS ?? 'reactions/',
      // reactionCovers: process.env.S3_PREFIX_EVENT_REACTION_COVERS ?? 'reaction-covers/',
      // mindsetProfileImage: process.env.S3_PREFIX_MINDSET_PROFILES ?? 'mindsets/icons/',
      // nicheProfileImage: process.env.S3_PREFIX_NICHE_PROFILES ?? 'niches/icons/',
      // religionIcons: process.env.S3_PREFIX_RELIGION_ICONS ?? 'religions/icons/',
      // genderIcons: process.env.S3_PREFIX_GENDER_ICONS ?? 'genders/icons/',
      // compilationImages: process.env.S3_PREFIX_COMPILATION_IMAGES ?? 'compilations/images/',
      // categoryIcons: process.env.S3_PREFIX_CATEGORY_ICONS ?? 'category/icons/',
      // categoryPropertyIcons: process.env.S3_PREFIX_CATEGORY_PROPERTY_ICONS ?? '/category-properties/icons/',
      // nicheIcons: process.env.S3_PREFIX_NICHE_ICONS ?? 'niche/icons/',
      // generalIcons: process.env.S3_PREFIX_GENERAL_ICONS ?? 'general/icons/',
      // offerIcons: process.env.S3_PREFIX_OFFER_ICONS ?? 'offer/icons/',
      // offerTickets: process.env.S3_PREFIX_OFFER_TICKETS_ICONS ?? 'offer/tickets/',
      // staticFiles: process.env.S3_PREFIX_STATIC_FILES_ICONS ?? 'static-files/svg-icons/',
      // newStaticFiles: process.env.S3_PREFIX_STATIC_FILES_ICONS ?? 'new-static-files/svg-icons/',
    },
  },
});
