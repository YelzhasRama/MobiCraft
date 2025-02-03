import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from '../repository/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../../../common/entities/order.entity';
import { GetAllOrdersQuery } from '../query/get-all-orders.query';
import { ResponsesRepository } from '../../responses/repository/responses.repository';
import { UsersRepository } from '../../users/repository/users.repository';
// import { TypesenseService } from '../../typesense/service/typesense.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(forwardRef(() => ResponsesRepository))
    private readonly responseRepository: ResponsesRepository,
    private readonly usersRepository: UsersRepository,
    // private readonly typesenseService: TypesenseService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    // await this.syncOrderWithTypesense(createOrderDto);
    return this.ordersRepository.createOrder(createOrderDto, userId);
  }

  async findAll(query: GetAllOrdersQuery) {
    return await this.ordersRepository.getAll(query);
  }

  // Получение заказа по ID
  async findOne(id: number): Promise<OrderEntity | null> {
    return await this.ordersRepository.findOrderById(id);
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersRepository.updateOrder(id, updateOrderDto);
  }

  async remove(id: number): Promise<void> {
    return this.ordersRepository.removeOrder(id);
  }

  // private async syncOrderWithTypesense(order: CreateOrderDto) {
  //   const client = this.typesenseService.getClient();
  //
  //   const document = {
  //     title: order.title,
  //     description: order.description,
  //     city: order.city,
  //     categoryIds: order.categoryIds,
  //     typeBudget: order.totalBudget,
  //     viewsCount: order.viewsCount,
  //   };
  //
  //   try {
  //     await client.collections('orders').documents().upsert(document);
  //     console.log('Order synced with Typesense:', order.title);
  //   } catch (error) {
  //     console.error('Error syncing order with Typesense:', error);
  //   }
  // }

  async findAllRequestsByOrderAndClientId(orderId: number, userId: number) {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    const order = await this.ordersRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} does not exist`);
    }

    const requests =
      await this.responseRepository.findRequestsByOrderId(orderId);

    // Возвращаем только необходимые данные
    return requests.map((request) => ({
      id: request.id,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      phone: request.mobilograph?.phone || null, // Если mobilograph отсутствует
    }));
  }
}
