import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoryEntity } from '../../../common/entities/category.entity';

@Injectable()
export class CategoriesRepository extends Repository<CategoryEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }

  async findByTitle(title: string): Promise<CategoryEntity | null> {
    return this.findOne({ where: { title } });
  }

  async findWithRelations(): Promise<CategoryEntity[]> {
    return this.find({
      relations: ['users', 'orders'],
    });
  }
}
