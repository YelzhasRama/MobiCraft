import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { StaticObjectsService } from '../service/static-objects.service';

@Controller()
export class StaticObjectController {
  constructor(private readonly staticObjectsService: StaticObjectsService) {}

  @Get('generate-upload-url')
  async generateUploadURL(
    @Query('bucketName') bucketName: string,
    @Query('key') key: string,
    @Query('contentType') contentType: string,
  ) {
    try {
      if (!bucketName || !key || !contentType) {
        throw new HttpException(
          'Missing required query parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      const url = await this.staticObjectsService.getPreSignedURL(
        bucketName,
        key,
        contentType,
      );
      return { url };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
