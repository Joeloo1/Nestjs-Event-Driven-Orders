import { OrderItemsDto } from '../dto/create-order.dto';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderItemsDto[],
    public readonly total: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
