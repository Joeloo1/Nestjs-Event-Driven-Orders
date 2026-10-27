import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { QUEUE_NAMES } from 'src/infrastructure/queues/queues.constant';

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) {
      return;
    }

    const event = job.data;

    this.logger.log(
      `Sending confirmation Email for order ${event.orderId} to user ${event.userId} [attemp ${job.attemptsMade + 1}`,
    );

    this.logger.log(
      `Confirmation Email queued for order ${event.orderId} - total :${event.total.toFixed(2)}`,
    );

    await Promise.resolve(null);
  }
}
