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
    const review = this.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user: { id: createReviewDto.mobilographId },
      reviewer: { id: createReviewDto.reviewerId },
    });
    return this.save(review);
  }

  async findAllReviews(id: number) {
    const reviews = await this.createQueryBuilder('review')
      .select([
        'review.id',
        'review.rating',
        'review.comment',
        'review.createdAt',
      ])
      .addSelect(['mobilograph.id', 'reviewer.id']) // Выбираем только id для user и reviewer
      .leftJoin('review.user', 'mobilograph') // Используем алиас mobilograph
      .leftJoin('review.reviewer', 'reviewer') // Используем алиас reviewer
      .where('mobilograph.id = :id', { id }) // Указываем условие через алиас mobilograph
      .getMany();

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      mobilographId: review.user?.id, // Извлекаем id mobilograph
      reviewerId: review.reviewer?.id, // Извлекаем id reviewer
    }));
  }

  async findReviewById(id: number): Promise<ReviewEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['user', 'reviewer'],
    });
  }

  async findExistingReview(mobilographId: number, reviewerId: number) {
    return await this.findOne({
      where: {
        user: { id: mobilographId },
        reviewer: { id: reviewerId },
      },
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
