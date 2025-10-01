import { Instrument } from "./instrument.model";

export type TradeDirection = 'B' | 'S';

export interface Order {
  instrumentId: string;
  quantity: number;
  targetPrice: number;
  direction: TradeDirection;
  clientId: string;
  orderId: string;
}

export interface Price {
  instrumentId: string;
  bidPrice: number;
  askPrice: number;
  timestamp: string;
  instrument: Instrument;
}

export interface Trade {
  instrumentId: string;
  quantity: number;
  executionPrice: number;
  direction: TradeDirection;
  clientId: string;
  order: Order;
  tradeId: string;
  cashValue: number;
  date: string;
}