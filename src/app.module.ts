import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StaticObjectsModule } from './modules/static-objects/static-objects.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './configs/database.config';
import { ConfigModule } from '@nestjs/config';
import { ResponsesModule } from './modules/responses/responses.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
      type: 'postgres',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    AuthModule,
    CategoriesModule,
    OrdersModule,
    PortfolioModule,
    ReviewsModule,
    StaticObjectsModule,
    UsersModule,
    ResponsesModule,
    FavoritesModule,
  ],
})
export class AppModule {}
