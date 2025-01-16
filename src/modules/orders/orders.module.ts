import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { OrdersRepository } from './repository/orders.repository';
import { OrderEntity } from '../../common/entities/order.entity';
import { UsersModule } from '../users/users.module';
import { ResponsesModule } from '../responses/responses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    UsersModule,
    forwardRef(() => ResponsesModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersRepository, OrdersService],
})
export class OrdersModule {}
