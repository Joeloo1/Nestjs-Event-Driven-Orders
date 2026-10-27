export const QUEUE_NAMES = {
  INVENTORY: 'inventory_events',
  NOTIFICATIONS: 'notification_events',
  PAYMENTS: 'payment_events',
  AUDIT: 'audit_events',
} as const;

export const ALL_0RDER_QUEUE_NAMES = Object.values(QUEUE_NAMES);
