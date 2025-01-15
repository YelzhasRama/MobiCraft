import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../../../common/entities/favorite.entity';
import { GetAllFavoritesQuery } from '../query/get-all-favorites.query';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoritesRepository: Repository<FavoriteEntity>,
  ) {}

  getOneById(id: number) {
    return this.favoritesRepository.findOneBy({ id });
  }

  async getFavoriteByUserAndOrder(userId: number, orderId: number) {
    return this.favoritesRepository.findOne({
      where: { userId, orderId },
    });
  }

  async insertAndFetchOne(payload: CreateFavoriteDto) {
    const favorite = this.favoritesRepository.create(payload);

    return this.favoritesRepository.save(favorite);
  }

  getAll({ perPage, page }: GetAllFavoritesQuery, userId: number) {
    const queryBuilder = this.favoritesRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.order', 'o')
      .where('favorites.deletedAt IS NULL');

    // Фильтрация по пользователю
    if (userId) {
      queryBuilder.andWhere('favorites.userId = :userId', { userId });
    }

    // Пагинация и сортировка
    queryBuilder
      .orderBy('favorites.createdAt', 'DESC')
      .skip(perPage * (page - 1))
      .take(perPage);

    return queryBuilder.getManyAndCount();
  }
}
