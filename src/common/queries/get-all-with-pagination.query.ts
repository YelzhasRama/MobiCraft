import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetAllWithPaginationQuery {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @IsNumber()
  page = 1;

  @ApiPropertyOptional({ default: 15 })
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @IsNumber()
  perPage = 15;
}
