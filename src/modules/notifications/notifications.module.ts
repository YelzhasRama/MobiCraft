import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../../common/entities/notification.entity';
import { NotificationsService } from './service/notification.service';
import { NotificationsGateway } from './gateway/notification-gateway.socket';
import { NotificationsController } from './controller/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
