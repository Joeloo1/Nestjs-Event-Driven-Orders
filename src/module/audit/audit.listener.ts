import { Injectable, Logger } from '@nestjs/common';
import { AuditLogEntry } from './audit-log.entry';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { safeListener } from 'src/common/utils/safe-listener.util';

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  private readonly entries: AuditLogEntry[] = [];

  @OnEvent('order.*')
  async handleOrderNamespaceEvent(payload: OrderCreatedEvent): Promise<void> {
    await safeListener(AuditListener.name, 'order.*', () => {
      const entry: AuditLogEntry = {
        orderId: payload.orderId,
        eventNamespace: 'order.*',
        capturedAt: new Date(),
        summary: `Order ${payload.orderId} - total: ${payload.total.toFixed(2)} - ${payload.items.length}`,
      };

      this.entries.push(entry);

      this.logger.log(`Audit entry recorded: ${entry.summary}`);
    });
  }

  findAll(): AuditLogEntry[] {
    return this.entries;
  }
}
