import { Module } from '@nestjs/common';
import { ResponsesController } from './controller/responses.controller';
import { ResponsesService } from './service/responses.service';
import { ResponsesRepository } from './repository/responses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseEntity } from '../../common/entities/response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseEntity])],
  controllers: [ResponsesController],
  providers: [ResponsesService, ResponsesRepository],
})
export class ResponsesModule {}
