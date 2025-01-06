import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../../../common/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { GetAllOrdersQuery } from '../query/get-all-orders.query';

@Injectable()
export class OrdersRepository extends Repository<OrderEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }

  getAll({ perPage, page }: GetAllOrdersQuery) {
    const queryBuilder = this.createQueryBuilder()
      .skip(perPage * (page - 1))
      .take(perPage);

    return queryBuilder.getManyAndCount();
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const order = this.create(createOrderDto);
    return this.save(order);
  }

  async findWithRelations(): Promise<OrderEntity[]> {
    return this.find({
      relations: ['client', 'category', 'responses'],
    });
  }

  async findOrderById(id: number): Promise<OrderEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['client', 'category', 'responses'],
    });
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    Object.assign(order, updateOrderDto);
    return this.save(order);
  }

  async removeOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    if (order) {
      await this.softRemove(order);
    }
  }
}
