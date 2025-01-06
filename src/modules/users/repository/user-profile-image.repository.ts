import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileImageEntity } from '../../../common/entities/user-profile-image.entity';

@Injectable()
export class UserProfileImagesRepository {
  constructor(
    @InjectRepository(UserProfileImageEntity)
    private readonly userProfileImageRepository: Repository<UserProfileImageEntity>,
  ) {}

  getOneByUserId(userId: number): Promise<UserProfileImageEntity | null> {
    return this.userProfileImageRepository.findOne({
      where: { user: { id: userId } },
      relations: ['staticObject'],
    });
  }

  getOneById(id: number): Promise<UserProfileImageEntity | null> {
    return this.userProfileImageRepository.findOne({
      where: { id: id },
      relations: ['staticObject'],
    });
  }

  insertAndFetchOne(
    userId: number,
    staticObjectId: number,
  ): Promise<UserProfileImageEntity> {
    const userProfileImage = this.userProfileImageRepository.create({
      userId,
      staticObjectId,
    });

    return this.userProfileImageRepository.save(userProfileImage);
  }

  async updateAndFetchById(
    id: number,
    partialEntity: {
      staticObject?: { id: number };
      thumbnailStaticObject?: { id: number };
    },
  ): Promise<UserProfileImageEntity> {
    await this.userProfileImageRepository.update(id, partialEntity);

    return this.getOneById(id);
  }
}
