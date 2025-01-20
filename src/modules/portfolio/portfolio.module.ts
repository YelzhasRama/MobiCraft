import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './controller/portfolio.controller';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioRepository } from './repository/portfolio.repository';
import { PortfolioEntity } from '../../common/entities/portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntity])],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioRepository],
})
export class PortfolioModule {}
