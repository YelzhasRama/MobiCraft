import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { OrdersRepository } from './repository/orders.repository';
import { OrderEntity } from '../../common/entities/order.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrdersRepository]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
