import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { NotificationsService } from '../service/notification.service';
import { NotificationsGateway } from '../gateway/notification-gateway.socket';
import { NotificationEntity } from '../../../common/entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Post()
  async createNotification(@Body() data: Partial<NotificationEntity>) {
    const notification =
      await this.notificationsService.createNotification(data);
    this.notificationsGateway.sendNotificationToUser(data.userId, notification);
    return notification;
  }

  @Get()
  async getNotifications(@Query('userId') userId: number) {
    return this.notificationsService.getNotificationsForUser(userId);
  }

  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
