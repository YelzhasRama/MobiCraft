import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticObjectEntity } from '../../common/entities/static-object.entity';
import { StaticObjectsService } from './service/static-objects.service';
import { StaticObjectsRepository } from './repository/static-objects.repository';
import { NestMinioModule } from 'nestjs-minio';
import { getS3Config } from '../../configs/s3.config';
import { StaticObjectController } from './controller/static-object.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaticObjectEntity]),
    NestMinioModule.registerAsync({
      isGlobal: false,
      useFactory: () => {
        const config = getS3Config();

        return config.s3;
      },
    }),
  ],
  controllers: [StaticObjectController],
  providers: [StaticObjectsService, StaticObjectsRepository],
  exports: [StaticObjectsRepository, StaticObjectsService],
})
export class StaticObjectsModule {}
