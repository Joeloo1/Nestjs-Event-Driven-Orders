import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentsProcessor } from './payment.processor';
import { IdempotencyService } from './idempotency.service';

@Module({
  providers: [PaymentGatewayService, PaymentsProcessor, IdempotencyService],
  exports: [PaymentGatewayService],
})
export class PaymentModule {}
