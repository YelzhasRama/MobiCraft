import { GetAllWithPaginationQuery } from 'src/common/queries/get-all-with-pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsEnum,
  IsInt,
  IsString,
  ValidateIf,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllOrdersQuery extends GetAllWithPaginationQuery {
  @ApiPropertyOptional({
    description: 'Название заказа',
    example: 'Сборка мебели',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description:
      'Идентификаторы категорий (может быть одним числом или массивом чисел)',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Преобразуем строку в массив, если есть запятая
      return value.includes(',')
        ? value.split(',').map((id) => parseInt(id, 10))
        : parseInt(value, 10);
    }
    return value;
  })
  @ValidateIf((obj) => Array.isArray(obj.categoryIds))
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @ValidateIf((obj) => !Array.isArray(obj.categoryIds))
  @IsInt()
  categoryIds?: number | number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['highBudget', 'lowBudget', 'project', 'hour', 'shift'])
  typeBudget?: 'highBudget' | 'lowBudget' | 'project' | 'hour' | 'shift';

  @ApiPropertyOptional({
    description: 'Город',
    example: 'Астана',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['views', 'popularity', 'match'])
  sort?: 'views' | 'popularity' | 'match';
}
