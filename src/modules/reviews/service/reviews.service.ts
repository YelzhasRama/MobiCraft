import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from '../repository/reviews.repository';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewEntity } from '../../../common/entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    return this.reviewsRepository.createReview(createReviewDto);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return this.reviewsRepository.findAllReviews();
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
