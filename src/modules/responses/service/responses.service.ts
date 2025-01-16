import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponsesRepository } from '../repository/responses.repository';
import { CreateResponseDto } from '../dto/create-responses.dto';
import { UpdateResponseDto } from '../dto/update-responses.dto';
import { ResponseEntity } from '../../../common/entities/response.entity';
import { UsersRepository } from '../../users/repository/users.repository';
import { OrdersRepository } from '../../orders/repository/orders.repository';

@Injectable()
export class ResponsesService {
  constructor(
    private readonly responsesRepository: ResponsesRepository,
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => OrdersRepository))
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async create(payload: CreateResponseDto) {
    const user = await this.usersRepository.findUserById(payload.mobilographId);
    if (!user) {
      throw new NotFoundException(
        `User with id ${payload.mobilographId} does not exist`,
      );
    }

    const order = await this.ordersRepository.findOrderById(payload.orderId);
    if (!order) {
      throw new NotFoundException(
        `Order with id ${payload.orderId} does not exist`,
      );
    }

    const alreadyExists =
      await this.responsesRepository.findRequestByOrderIdAndUserId(
        payload.orderId,
        payload.mobilographId,
      );
    if (alreadyExists) {
      throw new NotFoundException(
        `Request with order id ${payload.orderId} already exist`,
      );
    }

    return this.responsesRepository.createResponse(payload);
  }

  async findAll(): Promise<ResponseEntity[]> {
    return this.responsesRepository.findWithRelations();
  }

  async findOne(id: number): Promise<ResponseEntity | null> {
    return this.responsesRepository.findResponseById(id);
  }

  async update(
    id: number,
    updateResponseDto: UpdateResponseDto,
  ): Promise<ResponseEntity> {
    return this.responsesRepository.updateResponse(id, updateResponseDto);
  }

  async remove(id: number): Promise<void> {
    return this.responsesRepository.removeResponse(id);
  }
}
