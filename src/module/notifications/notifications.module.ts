import { Module } from '@nestjs/common';
import { NotificationListener } from './notifications.listener';

@Module({
  providers: [NotificationListener],
})
export class NotificationModule {}
