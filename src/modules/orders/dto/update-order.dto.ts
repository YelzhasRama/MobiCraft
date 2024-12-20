import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  shootingDate?: Date;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  clientId?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: string;
}
