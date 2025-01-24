// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { TypesenseService } from './typesense.service';
// import { OrdersRepository } from '../../orders/repository/orders.repository';
//
// @Injectable()
// export class OrderIndexService
//   // implements OnModuleInit
// {
//   constructor(
//     private readonly typesenseService: TypesenseService,
//     private readonly ordersRepository: OrdersRepository,
//   ) {}
//
//   async onModuleInit() {
//     const schema = {
//       name: 'orders',
//       fields: [
//         { name: 'id', type: 'string' as const },
//         { name: 'title', type: 'string' as const },
//         { name: 'description', type: 'string' as const },
//         { name: 'shootingDate', type: 'string' as const },
//         { name: 'city', type: 'string' as const },
//         { name: 'chronometry', type: 'string' as const },
//         { name: 'clientName', type: 'string' as const },
//         { name: 'categoryIds', type: 'int32[]' as const },
//         { name: 'viewsCount', type: 'int32' as const },
//         { name: 'totalBudget', type: 'float' as const },
//         { name: 'createdAt', type: 'string' as const },
//       ],
//       default_sorting_field: 'createdAt',
//     };
//
//     const client = this.typesenseService.getClient();
//     try {
//       await client.collections().create(schema);
//     } catch (error) {
//       console.log('Collection creation error or already exists:', error);
//     }
//
//     await this.syncOrdersWithTypesense();
//   }
//
//   private async syncOrdersWithTypesense() {
//     const client = this.typesenseService.getClient();
//
//     // Получение всех заказов из PostgreSQL
//     const orders = await this.ordersRepository.getAllOrdersForSync();
//
//     if (orders.length === 0) {
//       console.log('No orders found for sync.');
//       return;
//     }
//
//     // Преобразование данных в формат Typesense
//     const documents = orders.map((order) => ({
//       id: order.id.toString(),
//       title: order.title,
//       description: order.description,
//       city: order.city,
//       categoryIds: order.categories.map((category) => category.id),
//       typeBudget: order.totalBudget,
//       viewsCount: order.viewsCount,
//       createdAt: new Date(order.createdAt).getTime(),
//     }));
//
//     try {
//       await client
//         .collections('orders')
//         .documents()
//         .import(documents, { action: 'upsert' });
//       console.log('Orders synced with Typesense successfully.');
//     } catch (error) {
//       console.error('Error syncing orders with Typesense:', error);
//     }
//   }
// }
