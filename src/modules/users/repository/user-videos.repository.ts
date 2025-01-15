import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileImageEntity } from '../../../common/entities/user-profile-image.entity';
import { UserVideosEntity } from "../../../common/entities/user-videos.entity";

@Injectable()
export class UserVideosRepository {
  constructor(
    @InjectRepository(UserVideosEntity)
    private readonly userVideosRepository: Repository<UserVideosEntity>,
  ) {}

  getOneByUserId(userId: number): Promise<UserVideosEntity | null> {
    return this.userVideosRepository.findOne({
      where: { user: { id: userId } },
      relations: ['staticObject'],
    });
  }

  getOneById(id: number): Promise<UserVideosEntity | null> {
    return this.userVideosRepository.findOne({
      where: { id: id },
      relations: ['staticObject'],
    });
  }

  insertAndFetchOne(
    userId: number,
    staticObjectId: number,
  ): Promise<UserVideosEntity> {
    const userProfileImage = this.userVideosRepository.create({
      userId,
      staticObjectId,
    });

    return this.userVideosRepository.save(userProfileImage);
  }

  async updateAndFetchById(
    id: number,
    partialEntity: {
      staticObject?: { id: number };
    },
  ): Promise<UserVideosEntity> {
    await this.userVideosRepository.update(id, partialEntity);

    return this.getOneById(id);
  }
}
