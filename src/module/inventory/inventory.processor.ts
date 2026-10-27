import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { QUEUE_NAMES } from 'src/infrastructure/queues/queues.constant';

@Processor(QUEUE_NAMES.INVENTORY)
export class InventoryProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryProcessor.name);

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) {
      return;
    }

    const event = job.data;

    this.logger.log(
      `Reserving stock for order ${event.orderId} (${event.items.length} items(s)) [attempt ${job.attemptsMade + 1}`,
    );

    for (const item of event.items) {
      this.logger.log(
        ` -> Reserved ${item.quantity}X product ${item.productId}`,
      );
    }

    this.logger.log(` Stock Reservation completed for order ${event.orderId}`);

    await Promise.resolve(null);
  }
}
