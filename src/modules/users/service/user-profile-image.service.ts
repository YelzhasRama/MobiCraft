import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StaticObjectsService } from '../../static-objects/service/static-objects.service';
import { UserProfileImagesRepository } from '../repository/user-profile-image.repository';
import { getS3Config } from '../../../configs/s3.config';

const config = getS3Config().staticObject;

@Injectable()
export class UserProfileImageService {
  constructor(
    private readonly staticObjectService: StaticObjectsService,
    private readonly userProfileImageRepository: UserProfileImagesRepository,
  ) {}

  async uploadAndSaveOne(
    imageFile: Express.Multer.File,
    userId: number,
    { mimeType }: { mimeType?: string } = {},
  ) {
    let imageBuffer = null;

    try {
      if (!imageFile || !imageFile.buffer) {
        throw new BadRequestException('Invalid file format');
      }
      imageBuffer = imageFile.buffer;
      console.log(mimeType);
    } catch (err) {
      throw new BadRequestException(
        'File size limit reached or invalid file',
        err,
      );
    }

    try {
      const staticObject =
        await this.staticObjectService.uploadSaveAndReturnOne(imageBuffer, {
          prefix: config.prefix.userProfileImages,
          mimeType,
        });

      const userProfileImage =
        await this.userProfileImageRepository.getOneByUserId(userId);

      if (!userProfileImage) {
        await this.userProfileImageRepository.insertAndFetchOne(
          userId,
          staticObject.id,
        );
      } else {
        await this.userProfileImageRepository.updateAndFetchById(
          userProfileImage.id,
          {
            staticObject: { id: staticObject.id },
          },
        );
      }

      return this.getOneByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading files: ${error.message}`,
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
