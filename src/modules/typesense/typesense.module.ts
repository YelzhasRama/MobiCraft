import { Module } from '@nestjs/common';
import { TypesenseService } from './service/typesense.service';
import { OrdersSearchService } from './service/order-search.service';
import { OrderIndexService } from './service/order-index.service';

@Module({
  providers: [TypesenseService, OrdersSearchService, OrderIndexService],
  exports: [TypesenseService, OrdersSearchService, OrderIndexService],
})
export class TypesenseModule {}
