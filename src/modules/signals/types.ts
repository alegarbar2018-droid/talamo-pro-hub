/**
 * Signals Module Types - v1
 * 
 * Type definitions for trading signals functionality.
 * All signals functionality is gated by the 'signals_v1' feature flag.
 */

export type SignalStatus = 'active' | 'closed' | 'expired' | 'cancelled';
export type SignalType = 'buy' | 'sell';
export type SignalMarket = 'forex' | 'crypto' | 'commodities' | 'indices' | 'stocks';
export type SignalAccuracy = 'high' | 'medium' | 'low';

export interface TradingSignal {
  id: string;
  symbol: string;
  type: SignalType;
  market: SignalMarket;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  current_price?: number;
  accuracy: SignalAccuracy;
  confidence_percentage: number;
  status: SignalStatus;
  description?: string;
  analysis?: string;
  timeframe: string; // e.g., '1H', '4H', '1D'
  created_at: string;
  expires_at?: string;
  closed_at?: string;
  pnl_pips?: number;
  pnl_percentage?: number;
  provider_id: string;
  provider_name: string;
  tags: string[];
}

export interface SignalProvider {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  win_rate: number; // Percentage
  total_signals: number;
  active_signals: number;
  avg_pips_per_signal: number;
  followers_count: number;
  verified: boolean;
  premium: boolean;
  subscription_price_monthly?: number;
  markets: SignalMarket[];
  created_at: string;
}

export interface SignalSubscription {
  user_id: string;
  provider_id: string;
  subscribed_at: string;
  expires_at?: string;
  active: boolean;
  notifications_enabled: boolean;
}

export interface SignalPerformance {
  provider_id: string;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  total_signals: number;
  winning_signals: number;
  losing_signals: number;
  win_rate: number;
  avg_pips: number;
  best_signal_pips: number;
  worst_signal_pips: number;
  total_pips: number;
  avg_hold_time_hours: number;
}

export interface SignalNotification {
  id: string;
  user_id: string;
  signal_id: string;
  type: 'new_signal' | 'signal_update' | 'signal_closed' | 'take_profit_hit' | 'stop_loss_hit';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SignalsStats {
  total_signals_today: number;
  active_signals: number;
  avg_accuracy: number;
  top_performers: SignalProvider[];
  recent_signals: TradingSignal[];
}

// Mock data interface for development
export interface SignalsMockData {
  signals: TradingSignal[];
  providers: SignalProvider[];
  subscriptions: SignalSubscription[];
  notifications: SignalNotification[];
  stats: SignalsStats;
}