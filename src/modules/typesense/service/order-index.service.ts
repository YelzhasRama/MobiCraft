import { Injectable, OnModuleInit } from '@nestjs/common';
import { TypesenseService } from './typesense.service';

@Injectable()
export class OrderIndexService implements OnModuleInit {
  constructor(private readonly typesenseService: TypesenseService) {}

  async onModuleInit() {
    const schema = {
      name: 'orders',
      fields: [
        { name: 'id', type: 'string' as const },
        { name: 'title', type: 'string' as const },
        { name: 'description', type: 'string' as const },
        { name: 'city', type: 'string' as const },
        { name: 'categoryIds', type: 'int32[]' as const },
        { name: 'typeBudget', type: 'string' as const },
        { name: 'viewsCount', type: 'int32' as const },
        { name: 'totalBudget', type: 'float' as const },
        { name: 'createdAt', type: 'int64' as const },
      ],
      default_sorting_field: 'createdAt',
    };

    const client = this.typesenseService.getClient();
    try {
      await client.collections().create(schema);
    } catch (error) {
      console.log('Collection creation error or already exists:', error);
    }
  }
}
