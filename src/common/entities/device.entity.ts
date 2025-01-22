import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('devices')
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  model: string;

  @ManyToMany(() => UserEntity, (user) => user.devices)
  @JoinTable({
    name: 'user_devices',
    joinColumns: [{ name: 'device_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
  })
  users: UserEntity[];
}
