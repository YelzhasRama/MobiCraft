import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  shootDate?: Date;

  @IsOptional()
  @IsString()
  location?: string;
}
