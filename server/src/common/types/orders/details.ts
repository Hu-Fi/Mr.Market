import { SpotOrder } from "src/common/entities/spot-order.entity";

export class SpotOrderDetails extends SpotOrder {
  amount: string;
  price: string;
  avg: string;
  filled: string;
  pay: string;
  fee: string;
  receive: string;
}
