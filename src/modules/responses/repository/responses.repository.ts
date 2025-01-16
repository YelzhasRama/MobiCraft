import { Injectable } from '@nestjs/common';
import { ResponseEntity } from '../../../common/entities/response.entity';
import { ResponseStatus } from '../../../common/constants/response-status';
import { CreateResponseDto } from '../dto/create-responses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResponsesRepository {
  constructor(
    @InjectRepository(ResponseEntity)
    private readonly responseRepository: Repository<ResponseEntity>,
  ) {}

  async createResponse(payload: CreateResponseDto) {
    const response = this.responseRepository.create({
      message: payload.message,
      status: ResponseStatus.PENDING,
      order: { id: payload.orderId }, // Передаем объект с ID для связи
      mobilograph: payload.mobilographId ? { id: payload.mobilographId } : null, // Учитываем optional поле
    });

    return this.responseRepository.save(response);
  }

  async findWithRelations(): Promise<ResponseEntity[]> {
    return this.responseRepository.find({
      relations: ['order', 'mobilograph'],
    });
  }

  async findResponseById(id: number): Promise<ResponseEntity | null> {
    return this.responseRepository.findOne({
      where: { id },
      relations: ['order', 'mobilograph'],
    });
  }

  async findRequestsByOrderId(orderId: number) {
    return this.responseRepository.find({
      where: {
        order: { id: orderId },
      },
      relations: ['mobilograph'],
    });
  }

  async findRequestByOrderIdAndUserId(orderId: number, userId: number) {
    return this.responseRepository.findOne({
      where: {
        order: { id: orderId }, // Связь "order"
        mobilograph: { id: userId }, // Связь "mobilograph"
      },
    });
  }

  async updateResponse(id: number, updateResponseDto: Partial<ResponseEntity>) {
    const response = await this.findResponseById(id);
    if (!response) {
      throw new Error(`Response with ID ${id} not found`);
    }
    Object.assign(response, updateResponseDto);
    return this.responseRepository.save(response);
  }

  async removeResponse(id: number): Promise<void> {
    const response = await this.findResponseById(id);
    if (response) {
      await this.responseRepository.softRemove(response);
    }
  }
}
