import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constant';
import { QUEUE_NAMES } from 'src/infrastructure/queues/queues.constant';
import { AuditLogEntry } from './audit-log.entry';

@Processor(QUEUE_NAMES.AUDIT)
export class AuditProcessor extends WorkerHost {
  private readonly logger = new Logger(AuditProcessor.name);

  private readonly entries: AuditLogEntry[] = [];

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) {
      return;
    }

    const event = job.data;

    const entry: AuditLogEntry = {
      orderId: event.orderId,
      eventNamespace: ORDER_EVENTS.CREATED,
      capturedAt: new Date(),
      summary: `Order ${event.orderId} - total: ${event.total.toFixed(2)} - ${event.items.length} item(s)`,
    };

    this.entries.push(entry);

    this.logger.log(
      `[Attempt ${job.attemptsMade + 1}] Audit entry recorded: ${entry.summary}`,
    );

    await Promise.resolve(null);
  }

  findAll(): AuditLogEntry[] {
    return this.entries;
  }
}
