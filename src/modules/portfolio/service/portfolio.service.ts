import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { PortfolioRepository } from '../repository/portfolio.repository';
import { GetAllWithPaginationQuery } from '../../../common/queries/get-all-with-pagination.query';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async create(createPortfolioDto: CreatePortfolioDto, userId: number) {
    return await this.portfolioRepository.createPortfolio(
      createPortfolioDto,
      userId,
    );
  }

  async findAll(id: number, query: GetAllWithPaginationQuery) {
    return await this.portfolioRepository.getAll(id, query);
  }
}
