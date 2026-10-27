import { Module } from '@nestjs/common';
import { AuditProcessor } from './audit.processor';
// import { AuditListener } from './audit.listener';

@Module({
  providers: [/*AuditListener*/ AuditProcessor],
})
export class AuditModule {}
