import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PortfolioEntity } from '../../../common/entities/portfolio.entity';

@Injectable()
export class PortfolioRepository extends Repository<PortfolioEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PortfolioEntity, dataSource.createEntityManager());
  }
}
