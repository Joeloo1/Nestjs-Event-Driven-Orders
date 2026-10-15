import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { safeListener } from 'src/common/utils/safe-listener.util';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await safeListener(NotificationListener.name, ORDER_EVENTS.CREATED, () => {
      this.logger.log(
        `Sending confirmation Email for order ${event.orderId} to user ${event.userId}`,
      );

      this.logger.log(
        `Confirmation Email queued for order ${event.orderId} - total :${event.total.toFixed(2)}`,
      );
    });
  }
}
