import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './service/reviews.service';
import { ReviewsRepository } from './repository/reviews.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../common/entities/review.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
