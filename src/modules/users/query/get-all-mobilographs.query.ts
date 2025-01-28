import { GetAllWithPaginationQuery } from '../../../common/queries/get-all-with-pagination.query';
import { IsOptional, IsString } from 'class-validator';

export class GetAllMobilographsQuery extends GetAllWithPaginationQuery {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
