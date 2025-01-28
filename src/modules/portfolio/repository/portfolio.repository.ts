import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PortfolioEntity } from '../../../common/entities/portfolio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { GetAllWithPaginationQuery } from '../../../common/queries/get-all-with-pagination.query';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly portfolioRepository: Repository<PortfolioEntity>,
  ) {}

  async createPortfolio(payload: CreatePortfolioDto, userId: number) {
    const portfolio = this.portfolioRepository.create({
      title: 'myPortfolio',
      userId: userId,
      ...payload,
    });

    return await this.portfolioRepository.save(portfolio);
  }

  async getAll(id: number, { page, perPage }: GetAllWithPaginationQuery) {
    const queryBuilder = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where('portfolio.userId = :id', { id })
      .andWhere('portfolio.deletedAt IS NULL');

    queryBuilder
      .orderBy('portfolio.createdAt', 'DESC')
      .skip(perPage * (page - 1))
      .take(perPage);

    return queryBuilder.getManyAndCount();
  }
}
