import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesRepository } from '../repository/favorites.repository';
import { OrdersRepository } from '../../orders/repository/orders.repository';
import { GetAllFavoritesQuery } from '../query/get-all-favorites.query';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createFavorite(orderId: number, userId: number) {
    const order = await this.ordersRepository.findOrderById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} does not exist`);
    }

    const favorite = await this.favoritesRepository.getFavoriteByUserAndOrder(
      userId,
      orderId,
    );
    if (favorite) {
      throw new BadRequestException(`This order already in favorites`);
    }

    return this.favoritesRepository.insertAndFetchOne({ userId, orderId });
  }

  async getAllFavorites(query: GetAllFavoritesQuery, userId: number) {
    return await this.favoritesRepository.getAll(query, userId);
  }
}
