import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReviewEntity } from '../../../common/entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewsRepository extends Repository<ReviewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ReviewEntity, dataSource.createEntityManager());
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const review = this.create(createReviewDto);
    return this.save(review);
  }

  async findAllReviews(): Promise<ReviewEntity[]> {
    return this.find({
      relations: ['user', 'reviewer'],
    });
  }

  async findReviewById(id: number): Promise<ReviewEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['user', 'reviewer'],
    });
  }

  async updateReview(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const review = await this.findReviewById(id);
    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }
    Object.assign(review, updateReviewDto);
    return this.save(review);
  }

  async removeReview(id: number): Promise<void> {
    const review = await this.findReviewById(id);
    if (review) {
      await this.softRemove(review);
    }
  }
}
