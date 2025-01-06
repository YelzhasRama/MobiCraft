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

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfileImageEntity]),
    StaticObjectsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserProfileImagesRepository,
    UserProfileImageService,
  ],
  exports: [
    UsersService,
    UsersRepository,
    UserProfileImagesRepository,
    UserProfileImageService,
  ],
})
export class UsersModule {}
