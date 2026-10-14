import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { OrdersService } from './module/orders/orders.service';
import { OrdersModule } from './module/orders/orders.module';
import { InventoryModule } from './module/inventory/inventory.module';
import { NotificationModule } from './module/notifications/notifications.module';
import { AuditModule } from './module/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    OrdersModule,
    InventoryModule,
    NotificationModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
