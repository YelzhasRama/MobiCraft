import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StaticObjectEntity } from '../../../common/entities/static-object.entity';

@Injectable()
export class StaticObjectsRepository {
  constructor(
    @InjectRepository(StaticObjectEntity)
    private readonly staticObjectRepository: Repository<StaticObjectEntity>,
  ) {}

  insertAndFetchOne(objectKey: string): Promise<StaticObjectEntity> {
    const staticObject = this.staticObjectRepository.create({ objectKey });
    return this.staticObjectRepository.save(staticObject);
  }

  getObjectsFromFolder(folderPath: string) {
    return this.staticObjectRepository.find({
      where: { objectKey: Like(`%${folderPath}%`) },
    });
  }

  getOneById(id: number): Promise<StaticObjectEntity | null> {
    return this.staticObjectRepository.findOne({ where: { id: id } });
  }

  deteleOneById(id: number) {
    return this.staticObjectRepository.delete(id);
  }
}
