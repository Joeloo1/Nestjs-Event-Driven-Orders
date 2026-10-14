import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsUUID,
  ValidateNested,
  IsPositive,
} from 'class-validator';

export class OrderItemsDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsDto)
  @IsNotEmpty()
  items: OrderItemsDto[];
}
