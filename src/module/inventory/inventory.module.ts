import { Module } from '@nestjs/common';
import { InventoryProcessor } from './inventory.processor';
// import { InventoryListener } from './inventory.listener';

@Module({
  providers: [/*InventoryListener*/ InventoryProcessor],
})
export class InventoryModule {}
