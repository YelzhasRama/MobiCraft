import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FavoritesService } from '../service/favorites.service';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';
import { GetAllFavoritesQuery } from '../query/get-all-favorites.query';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(UserAccessJwtGuard)
  @Get('/list')
  async findAll(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @Query() query: GetAllFavoritesQuery,
  ) {
    const [favorites, total] = await this.favoritesService.getAllFavorites(
      query,
      user.userId,
    );
    return {
      favorites,
      meta: {
        total,
        page: query.page,
        perPage: query.perPage,
      },
    };
  }

  @UseGuards(UserAccessJwtGuard)
  @Post()
  async createFavorites(
    @Query('orderId') orderId: number,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return await this.favoritesService.createFavorite(orderId, user.userId);
  }
}
