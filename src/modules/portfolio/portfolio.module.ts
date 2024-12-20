import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './controller/portfolio.controller';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioRepository } from './repository/portfolio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioRepository])],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioRepository],
})
export class PortfolioModule {}
