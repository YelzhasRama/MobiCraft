import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { CategoryEntity } from '../../common/entities/category.entity';
import { CategoriesRepository } from './repository/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
