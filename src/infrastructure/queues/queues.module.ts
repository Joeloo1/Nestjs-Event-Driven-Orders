import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUE_NAMES } from './queues.constant';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.INVENTORY },
      { name: QUEUE_NAMES.NOTIFICATIONS },
      { name: QUEUE_NAMES.PAYMENTS },
    ),
    BullBoardModule.forFeature(
      {
        name: QUEUE_NAMES.INVENTORY,
        adapter: BullMQAdapter,
      },
      {
        name: QUEUE_NAMES.NOTIFICATIONS,
        adapter: BullMQAdapter,
      },
      {
        name: QUEUE_NAMES.PAYMENTS,
        adapter: BullMQAdapter,
      },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
