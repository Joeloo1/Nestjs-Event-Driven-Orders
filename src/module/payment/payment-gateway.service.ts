import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface ChargeRecord {
  transactionId: string;
  orderId: string;
  amount: number;
  createdAt: Date;
}
@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);

  private readonly charges: ChargeRecord[] = [];

  charge(orderId: string, amount: number): ChargeRecord {
    const record: ChargeRecord = {
      transactionId: randomUUID(),
      orderId,
      amount,
      createdAt: new Date(),
    };

    this.charges.push(record);

    this.logger.log(
      `Charged ${amount.toFixed(2)} for order ${orderId} - transaction ${record.transactionId}`,
    );

    return record;
  }

  findChargesForOrder(orderId: string): ChargeRecord[] {
    return this.charges.filter((c) => c.orderId === orderId);
  }

  findAll(): ChargeRecord[] {
    return this.charges;
  }
}
