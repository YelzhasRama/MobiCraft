import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './service/reviews.service';
import { ReviewsRepository } from './repository/reviews.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../common/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
