export type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

export type ActiveTab = 'trade' | 'perps' | 'swap' | 'markets' | 'portfolio' | 'api-docs' | 'users' | 'client-dashboard';

export type OrderSide = 'buy' | 'sell';

export type OrderType = 'limit' | 'market' | 'stop-limit';

export interface MarketPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  fundingRate?: number;
  category: string;
  precision: number;
  minAmount: number;
  sparkline: number[];
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercentage: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: OrderSide;
}

export interface AssetBalance {
  free: number;
  locked: number;
  usdValue: number;
}

export interface UserWallet {
  totalUsd: number;
  unrealizedPnl: number;
  availableUsd: number;
  balances: Record<string, AssetBalance>;
}

export interface Position {
  id: string;
  pair: string;
  side: 'long' | 'short';
  entryPrice: number;
  markPrice: number;
  size: number;
  margin: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  createdAt: string;
}

export interface UserOrder {
  id: string;
  pair: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  amount: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
  leverage?: number;
  tpPrice?: number;
  slPrice?: number;
}

// User Authentication and SQLite Account Models
export interface UserAccount {
  id?: number;
  username: string;
  name: string;
  password?: string;
  gender: string;
  location: string;
}

export interface ApiTestResult {
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  response: any;
  durationMs: number;
  timestamp: string;
}

export interface ClientInvestmentRecord {
  id: string;
  date: string;
  investedAmount: number;
  withdrawalAmount?: number;
  profitAmount?: number;
  feePaid?: number;
  status: 'completed' | 'reinvested';
  notes?: string;
}

export interface ClientProfileData {
  clientName: string;
  email: string;
  availableBalance: number;
  requiredWithdrawalFee: number;
  history: ClientInvestmentRecord[];
}

