import { forwardRef, Module } from '@nestjs/common';
import { ResponsesController } from './controller/responses.controller';
import { ResponsesService } from './service/responses.service';
import { ResponsesRepository } from './repository/responses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseEntity } from '../../common/entities/response.entity';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResponseEntity]),
    UsersModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, ResponsesRepository],
  exports: [ResponsesService, ResponsesRepository],
})
export class ResponsesModule {}
