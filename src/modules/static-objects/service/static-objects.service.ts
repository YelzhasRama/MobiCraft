import { Inject, Injectable, Logger } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client as MinioClient } from 'minio';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { getS3Config } from '../../../configs/s3.config';
import { StaticObjectsRepository } from '../repository/static-objects.repository';
import { StaticObjectEntity } from '../../../common/entities/static-object.entity';

const config = getS3Config().staticObject;

@Injectable()
export class StaticObjectsService {
  private readonly logger = new Logger(StaticObjectsService.name);

  constructor(
    private readonly staticObjectsRepository: StaticObjectsRepository,
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
  ) {}

  async uploadSaveAndReturnOne(
    data: Readable,
    { prefix, mimeType }: { prefix: string; mimeType: string } = {
      prefix: '',
      mimeType: '',
    },
  ): Promise<StaticObjectEntity> {
    const fileExt = mimeType ? `.${mimeType.split('/')[1]}` : '';
    const objectKey = `${prefix}${uuid()}${fileExt}`;

    await this.minioClient.putObject(config.bucketName, objectKey, data);
    const staticObject =
      await this.staticObjectsRepository.insertAndFetchOne(objectKey);

    return staticObject;
  }

  async getObject(key: string) {
    return this.minioClient.getObject(config.bucketName, key);
  }

  async createStaticObject(objectKey: string): Promise<StaticObjectEntity> {
    const staticObject =
      await this.staticObjectsRepository.insertAndFetchOne(objectKey);
    return staticObject;
  }

  async getOneById(id: number): Promise<StaticObjectEntity> {
    return this.staticObjectsRepository.getOneById(id);
  }

  async getObjectsFromFolder(folderPath: string) {
    return this.staticObjectsRepository.getObjectsFromFolder(folderPath);
  }

  async deleteOneById(id: number) {
    const staticObject = await this.staticObjectsRepository.getOneById(id);

    if (!staticObject) {
      throw new Error(`Static object with id ${id} does not exist`);
    }

    await this.minioClient.removeObject(
      config.bucketName,
      staticObject.objectKey,
    );
    await this.staticObjectsRepository.deteleOneById(id);
  }

  async deleteManyByIds(ids: number[]) {
    await Promise.all(ids.map((id) => this.deleteOneById(id)));
  }
}
