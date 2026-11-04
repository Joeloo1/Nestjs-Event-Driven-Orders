import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { QUEUE_NAMES } from 'src/infrastructure/queues/queues.constant';
import { PaymentGatewayService } from './payment-gateway.service';
import { IdempotencyService } from './idempotency.service';

const PAYMENTS_IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24; //24 hours

@Processor(QUEUE_NAMES.PAYMENTS)
export class PaymentsProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentsProcessor.name);

  constructor(
    private readonly paymentGateway: PaymentGatewayService,
    private readonly idempotencyService: IdempotencyService,
  ) {
    super();
  }

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) {
      return;
    }

    const event = job.data;
    const idempotencyKey = `payment:${event.orderId}`;

    this.logger.log(
      `Processing payment for order ${event.orderId} [attempt ${job.attemptsMade + 1}]`,
    );

    const isNewReserve = await this.idempotencyService.reserve(
      idempotencyKey,
      PAYMENTS_IDEMPOTENCY_TTL_SECONDS,
    );

    if (!isNewReserve) {
      this.logger.warn(
        `Order ${event.orderId} already has a reserved/completed payment --skipping duplicate payment charge [attempt ${job.attemptsMade + 1}]`,
      );
      return;
    }

    this.logger.log(
      `Idempotency key Reserved for order ${event.orderId} --Processingto charge`,
    );

    try {
      this.paymentGateway.charge(event.orderId, event.total);
    } catch {
      await this.idempotencyService.release(idempotencyKey);
    }

    // TEMP CODE
    if (job.attemptsMade === 0) {
      throw new Error(
        'Failed to persist payment confirmation after successful charge',
      );
    }

    this.logger.log(`Payment confirmed for order ${event.orderId}`);

    await Promise.resolve(null);
  }
}
