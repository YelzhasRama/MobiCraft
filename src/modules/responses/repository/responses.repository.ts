import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResponseEntity } from '../../../common/entities/response.entity';

@Injectable()
export class ResponsesRepository extends Repository<ResponseEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ResponseEntity, dataSource.createEntityManager());
  }

  async createResponse(createResponseDto: Partial<ResponseEntity>) {
    const response = this.create(createResponseDto);
    return this.save(response);
  }

  async findWithRelations(): Promise<ResponseEntity[]> {
    return this.find({
      relations: ['order', 'mobilograph'],
    });
  }

  async findResponseById(id: number): Promise<ResponseEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['order', 'mobilograph'],
    });
  }

  async updateResponse(id: number, updateResponseDto: Partial<ResponseEntity>) {
    const response = await this.findResponseById(id);
    if (!response) {
      throw new Error(`Response with ID ${id} not found`);
    }
    Object.assign(response, updateResponseDto);
    return this.save(response);
  }

  async removeResponse(id: number): Promise<void> {
    const response = await this.findResponseById(id);
    if (response) {
      await this.softRemove(response);
    }
  }
}
