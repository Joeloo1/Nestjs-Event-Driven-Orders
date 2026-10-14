import { OrderItemsDto } from '../dto/create-order.dto';

export type OrderStatus = 'pending' | 'confirmed' | 'failed';

export class Order {
  id: string;
  userId: string;
  items: OrderItemsDto[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
