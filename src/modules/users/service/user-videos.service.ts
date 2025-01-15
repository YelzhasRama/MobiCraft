import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StaticObjectsService } from '../../static-objects/service/static-objects.service';
import { getS3Config } from '../../../configs/s3.config';
import { UserVideosRepository } from '../repository/user-videos.repository';

const config = getS3Config().staticObject;

@Injectable()
export class UserVideosService {
  constructor(
    private readonly staticObjectService: StaticObjectsService,
    private readonly userVideosRepository: UserVideosRepository,
  ) {}

  async uploadAndSaveOne(
    videoFile: Express.Multer.File,
    userId: number,
    { mimeType }: { mimeType?: string } = {},
  ) {
    let videoBuffer = null;

    try {
      if (!videoFile || !videoFile.buffer) {
        throw new BadRequestException('Invalid file format');
      }
      videoBuffer = videoFile.buffer;
    } catch (err) {
      throw new BadRequestException(
        'File size limit reached or invalid file',
        err,
      );
    }

    try {
      const staticObject =
        await this.staticObjectService.uploadSaveAndReturnOneVideo(
          videoBuffer,
          {
            prefix: config.prefix.userVideos,
            mimeType,
          },
        );

      const userVideo = await this.userVideosRepository.getOneByUserId(userId);

      if (!userVideo) {
        await this.userVideosRepository.insertAndFetchOne(
          userId,
          staticObject.id,
        );
      } else {
        await this.userVideosRepository.updateAndFetchById(userVideo.id, {
          staticObject: { id: staticObject.id },
        });
      }

      return this.getOneByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading files: ${error.message}`,
      );
    }
  }

  async getOneByUserId(userId: number) {
    const userVideo = await this.userVideosRepository.getOneByUserId(userId);
    if (!userVideo) {
      return null;
    }

    return userVideo;
  }
}
