import { Injectable } from '@nestjs/common';
import { TypesenseService } from './typesense.service';
import { GetAllOrdersQuery } from '../../orders/query/get-all-orders.query';

@Injectable()
export class OrdersSearchService {
  constructor(private readonly typesenseService: TypesenseService) {}

  async searchOrders(query: GetAllOrdersQuery) {
    const client = this.typesenseService.getClient();

    // Построение фильтра
    const filters: string[] = [];
    if (query.categoryIds) {
      const categoryFilter = Array.isArray(query.categoryIds)
        ? `categoryIds:=[${query.categoryIds.join(',')}]`
        : `categoryIds:=${query.categoryIds}`;
      filters.push(categoryFilter);
    }
    if (query.city) filters.push(`city:=${query.city}`);
    if (query.typeBudget) filters.push(`typeBudget:=${query.typeBudget}`);

    // Выполнение поиска
    return client
      .collections('orders')
      .documents()
      .search({
        q: query.title || '*',
        query_by: 'title,description',
        filter_by: filters.join(' && '),
        sort_by: query.sort === 'views' ? 'viewsCount:desc' : 'createdAt:desc',
        per_page: query.perPage,
        page: query.page,
      });
  }
}
