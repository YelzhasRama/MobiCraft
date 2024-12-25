import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from '../service/portfolio.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(UserAccessJwtGuard)
  @Post()
  async create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Get()
  async findAll() {
    return this.portfolioService.findAll();
  }

  @UseGuards(UserAccessJwtGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const portfolio = await this.portfolioService.findOne(id);
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    return portfolio;
  }

  @UseGuards(UserAccessJwtGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    const updated = await this.portfolioService.update(id, updatePortfolioDto);
    if (!updated) {
      throw new NotFoundException('Portfolio not found');
    }
    return updated;
  }

  @UseGuards(UserAccessJwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.portfolioService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Portfolio not found');
    }
    return { message: 'Portfolio deleted successfully' };
  }
}
