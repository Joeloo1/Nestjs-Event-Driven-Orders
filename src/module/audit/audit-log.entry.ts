export interface AuditLogEntry {
  orderId: string;
  eventNamespace: string;
  capturedAt: Date;
  summary: string;
}
