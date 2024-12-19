import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StaticObjectsModule } from './modules/static-objects/static-objects.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    OrdersModule,
    PortfolioModule,
    ReviewsModule,
    StaticObjectsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
