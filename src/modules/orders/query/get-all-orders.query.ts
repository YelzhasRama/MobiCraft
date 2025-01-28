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
    description: 'Поиск по названию и описанию заказа',
    example: 'Сборка мебели',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @Transform(({ value }) => {
    // Если это строка, то пытаемся преобразовать в массив
    if (typeof value === 'string') {
      // Преобразуем строку в массив, если есть запятая
      return value.includes(',')
        ? value.split(',').map((id) => parseInt(id, 10)) // Разбиваем строку на массив чисел
        : [parseInt(value, 10)]; // Если только одно значение, делаем массив с одним элементом
    }
    // Если это уже массив, возвращаем как есть
    return value;
  })
  @IsArray()
  @ArrayUnique() // Убираем дубликаты
  @IsInt({ each: true }) // Проверка, чтобы каждый элемент был целым числом
  categoryIds?: number[];

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
