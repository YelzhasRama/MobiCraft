import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { PortfolioService } from '../service/portfolio.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { GetAllWithPaginationQuery } from '../../../common/queries/get-all-with-pagination.query';

@Controller()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(UserAccessJwtGuard)
  @Post('clip/create')
  async create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Get('user/:id/clips')
  async findAll(
    @Param('id') id: number,
    @Query() query: GetAllWithPaginationQuery,
  ) {
    return this.portfolioService.findAll(id, query);
  }
}
