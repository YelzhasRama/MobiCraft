import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StaticObjectsService } from '../../static-objects/service/static-objects.service';
import { UserProfileImagesRepository } from '../repository/user-profile-image.repository';
import { MultipartFile } from '@fastify/multipart';
import { getS3Config } from '../../../configs/s3.config';

const config = getS3Config().staticObject;

@Injectable()
export class UserProfileImageService {
  constructor(
    private readonly staticObjectService: StaticObjectsService,
    private readonly userProfileImageRepository: UserProfileImagesRepository,
  ) {}

  async uploadAndSaveOne(
    imageFile: MultipartFile,
    userId: number,
    { mimeType }: { mimeType?: string } = {},
  ) {
    let imageBuffer = null;

    try {
      imageBuffer = imageBuffer.toBuffer();
    } catch (err) {
      throw new BadRequestException('File size limit reached');
    }

    try {
      const staticObject =
        await this.staticObjectService.uploadSaveAndReturnOne(imageBuffer, {
          prefix: config.prefix.userProfileImages,
          mimeType,
        });

      let userProfileImage =
        await this.userProfileImageRepository.getOneByUserId(userId);

      if (!userProfileImage) {
        userProfileImage =
          await this.userProfileImageRepository.insertAndFetchOne(
            userId,
            staticObject.id,
          );
      } else {
        userProfileImage =
          await this.userProfileImageRepository.updateAndFetchById(
            userProfileImage.id,
            {
              staticObject: { id: staticObject.id },
              thumbnailStaticObject: null,
            },
          );
      }

      return this.getOneByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading files ${error.message}`,
      );
    }
  }

  async getOneByUserId(userId: number) {
    const userProfileImage =
      await this.userProfileImageRepository.getOneByUserId(userId);
    if (!userProfileImage) {
      return null;
    }

    return userProfileImage;
  }
}
