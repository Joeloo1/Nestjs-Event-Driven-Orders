import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDER_EVENTS } from './events/order-events.constant';
import { OrderCreatedEvent } from './events/order-created.event';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private readonly orders: Order[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  create(dto: CreateOrderDto): Order {
    const total = dto.items.reduce(
      (sum, item) => sum + item.quantity + item.unitPrice,
      0,
    );

    const order: Order = {
      id: randomUUID(),
      userId: dto.userId,
      items: dto.items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);

    this.logger.log(`Order ${order.id} created for user ${order.userId}`);
    this.eventEmitter.emit(
      ORDER_EVENTS.CREATED,
      new OrderCreatedEvent(order.id, order.userId, order.items, order.total),
    );

    return order;
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  findAll(): Order[] {
    return this.orders;
  }
}
