import { Injectable } from '@nestjs/common';
import { PortfolioEntity } from '../../../common/entities/portfolio.entity';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { PortfolioRepository } from '../repository/portfolio.repository';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async create(createPortfolioDto: CreatePortfolioDto) {
    const portfolio = this.portfolioRepository.create(createPortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async findAll(): Promise<PortfolioEntity[]> {
    return this.portfolioRepository.find();
  }

  async findOne(id: number): Promise<PortfolioEntity | null> {
    return this.portfolioRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<PortfolioEntity | null> {
    const portfolio = await this.findOne(id);
    if (!portfolio) return null;
    Object.assign(portfolio, updatePortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.portfolioRepository.softDelete(id);
    return result.affected > 0;
  }
}
