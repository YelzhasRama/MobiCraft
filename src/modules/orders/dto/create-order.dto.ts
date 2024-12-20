import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  shootingDate: Date;

  @IsNumber()
  budget: number;

  @IsString()
  location: string;

  clientId: string;

  @IsOptional()
  categoryId?: string;
}
