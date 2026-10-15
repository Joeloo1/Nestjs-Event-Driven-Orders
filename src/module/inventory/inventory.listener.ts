import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { safeListener } from 'src/common/utils/safe-listener.util';

@Injectable()
export class InventoryListener {
  private readonly logger = new Logger(InventoryListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await safeListener(InventoryListener.name, ORDER_EVENTS.CREATED, () => {
      this.logger.log(
        `Reserving stock for order ${event.orderId} (${event.items.length} items(s))`,
      );

      for (const item of event.items) {
        this.logger.log(
          ` -> Reserved ${item.quantity}X product ${item.productId}`,
        );
      }

      this.logger.log(
        ` Stock Reservation completed for order ${event.orderId}`,
      );
    });
  }
}
