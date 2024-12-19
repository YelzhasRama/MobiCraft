import { ApiProperty } from '@nestjs/swagger';

class MetaDataResponse {
  @ApiProperty({
    description: 'Total number of items',
    example: 546,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;
}

export class PaginatedMetaDataResponse {
  @ApiProperty({
    description: 'Total number of items',
    type: MetaDataResponse,
  })
  meta: MetaDataResponse;
}
