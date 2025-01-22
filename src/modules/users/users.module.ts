import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../common/entities/user.entity';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from './repository/users.repository';
import { UserProfileImageEntity } from '../../common/entities/user-profile-image.entity';
import { StaticObjectsModule } from '../static-objects/static-objects.module';
import { UserProfileImagesRepository } from './repository/user-profile-image.repository';
import { UserProfileImageService } from './service/user-profile-image.service';
import { AccessoryEntity } from '../../common/entities/accessory.entity';
import { AccessoryRepository } from './repository/accessory.repository';
import { UserVideosEntity } from '../../common/entities/user-videos.entity';
import { UserVideosRepository } from './repository/user-videos.repository';
import { UserVideosService } from './service/user-videos.service';
import { CategoriesModule } from '../categories/categories.module';
import { DeviceEntity } from '../../common/entities/device.entity';
import { DeviceRepository } from './repository/device.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileImageEntity,
      AccessoryEntity,
      UserVideosEntity,
      DeviceEntity,
    ]),
    StaticObjectsModule,
    CategoriesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserProfileImagesRepository,
    UserProfileImageService,
    AccessoryRepository,
    UserVideosRepository,
    UserVideosService,
    DeviceRepository,
  ],
  exports: [
    UsersService,
    UsersRepository,
    UserProfileImagesRepository,
    UserProfileImageService,
    UserVideosRepository,
    UserVideosService,
    DeviceRepository,
  ],
})
export class UsersModule {}
