import { Module } from '@nestjs/common';
import { NotificationsProcessor } from './notification.processor';
// import { NotificationListener } from './notifications.listener';

@Module({
  providers: [/*NotificationListener*/ NotificationsProcessor],
})
export class NotificationModule {}
