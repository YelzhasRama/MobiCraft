import { Injectable } from '@nestjs/common';
import { ResponsesRepository } from '../repository/responses.repository';
import { CreateResponseDto } from '../dto/create-responses.dto';
import { UpdateResponseDto } from '../dto/update-responses.dto';
import { ResponseEntity } from '../../../common/entities/response.entity';

@Injectable()
export class ResponsesService {
  constructor(private readonly responsesRepository: ResponsesRepository) {}

  async create(createResponseDto: CreateResponseDto): Promise<ResponseEntity> {
    return this.responsesRepository.createResponse(createResponseDto);
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
