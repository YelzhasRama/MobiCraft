import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repository/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../../../common/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  // Создание нового заказа
  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.ordersRepository.createOrder(createOrderDto);
  }

  // Получение всех заказов
  async findAll(): Promise<OrderEntity[]> {
    return this.ordersRepository.findWithRelations();
  }

  // Получение заказа по ID
  async findOne(id: number): Promise<OrderEntity | null> {
    return this.ordersRepository.findOrderById(id);
  }

  // Обновление заказа
  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersRepository.updateOrder(id, updateOrderDto);
  }

  // Удаление заказа
  async remove(id: number): Promise<void> {
    return this.ordersRepository.removeOrder(id);
  }
}
