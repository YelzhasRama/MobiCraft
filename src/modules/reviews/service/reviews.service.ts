import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from '../repository/reviews.repository';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewEntity } from '../../../common/entities/review.entity';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const mobilographId = await this.usersRepository.findUserById(
      createReviewDto.mobilographId,
    );
    if (!mobilographId) {
      throw new NotFoundException(
        `There is no mobilograph with id ${createReviewDto.mobilographId} in data base`,
      );
    }

    const existingReview = await this.reviewsRepository.findExistingReview(
      createReviewDto.mobilographId,
      createReviewDto.reviewerId,
    );
    if (existingReview) {
      throw new NotFoundException(
        `Review from reviewer ${createReviewDto.reviewerId} to mobilograph ${createReviewDto.mobilographId} already exists`,
      );
    }

    return await this.reviewsRepository.createReview(createReviewDto);
  }

  async findAll(id: number) {
    return this.reviewsRepository.findAllReviews(id);
  }

  async findOne(id: number): Promise<ReviewEntity | null> {
    return this.reviewsRepository.findReviewById(id);
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    return this.reviewsRepository.updateReview(id, updateReviewDto);
  }

  async remove(id: number): Promise<void> {
    return this.reviewsRepository.removeReview(id);
  }
}
