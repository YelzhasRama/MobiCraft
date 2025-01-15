import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from '../../common/entities/favorite.entity';
import { FavoritesController } from './controller/favorites.controller';
import { FavoritesService } from './service/favorites.service';
import { FavoritesRepository } from './repository/favorites.repository';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteEntity]),
    UsersModule,
    OrdersModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule {}
