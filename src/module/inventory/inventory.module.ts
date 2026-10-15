import { Module } from '@nestjs/common';
import { InventoryListener } from './inventory.listener';

@Module({
  providers: [InventoryListener],
})
export class InventoryModule {}
