/**
 * Copy Trading Module Types - v1
 * 
 * Type definitions for copy trading functionality.
 * All copy trading functionality is gated by the 'copy_v1' feature flag.
 */

export type TraderStatus = 'active' | 'inactive' | 'suspended';
export type TradeStatus = 'open' | 'closed' | 'pending';
export type TradeResult = 'profit' | 'loss' | 'breakeven';

export interface CopyTrader {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  status: TraderStatus;
  verified: boolean;
  
  // Performance metrics
  total_return_percentage: number;
  monthly_return_percentage: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  avg_trade_duration_hours: number;
  max_drawdown_percentage: number;
  
  // Risk metrics
  risk_score: number; // 1-10 scale
  avg_leverage: number;
  preferred_markets: string[];
  
  // Social metrics
  followers_count: number;
  copied_volume_usd: number;
  
  // Subscription info
  minimum_copy_amount: number;
  maximum_copy_amount?: number;
  commission_percentage: number;
  
  created_at: string;
  last_trade_at?: string;
}

export interface CopyTrade {
  id: string;
  trader_id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  open_price: number;
  current_price?: number;
  close_price?: number;
  stop_loss?: number;
  take_profit?: number;
  status: TradeStatus;
  result?: TradeResult;
  pnl_usd?: number;
  pnl_percentage?: number;
  opened_at: string;
  closed_at?: string;
  duration_minutes?: number;
  comment?: string;
}

export interface CopyPosition {
  id: string;
  user_id: string; // Follower's user ID
  trader_id: string; // Trader being copied
  trade_id: string; // Original trade ID
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  copy_ratio: number; // 0.1 = 10% of original position
  open_price: number;
  current_price?: number;
  close_price?: number;
  stop_loss?: number;
  take_profit?: number;
  status: TradeStatus;
  result?: TradeResult;
  pnl_usd?: number;
  pnl_percentage?: number;
  commission_usd?: number;
  opened_at: string;
  closed_at?: string;
}

export interface CopySettings {
  user_id: string;
  trader_id: string;
  enabled: boolean;
  copy_ratio: number; // Multiplier for position sizes
  max_risk_percentage: number; // Max % of account to risk
  max_positions: number;
  stop_copying_on_drawdown_percentage: number;
  copy_stop_losses: boolean;
  copy_take_profits: boolean;
  allowed_symbols?: string[];
  excluded_symbols?: string[];
  max_position_size_usd?: number;
  created_at: string;
  updated_at: string;
}

export interface CopyTraderPerformance {
  trader_id: string;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  starting_balance: number;
  ending_balance: number;
  total_return_percentage: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  best_trade_percentage: number;
  worst_trade_percentage: number;
  avg_trade_return_percentage: number;
  max_drawdown_percentage: number;
  profit_factor: number; // Gross profit / Gross loss
  sharpe_ratio?: number;
  calmar_ratio?: number;
}

export interface FollowerStats {
  user_id: string;
  trader_id: string;
  total_copied_trades: number;
  active_positions: number;
  total_pnl_usd: number;
  total_commission_paid_usd: number;
  best_trade_percentage: number;
  worst_trade_percentage: number;
  following_since: string;
}

export interface CopyTradingStats {
  total_active_traders: number;
  total_followers: number;
  total_volume_copied_usd: number;
  avg_trader_return_percentage: number;
  top_performers: CopyTrader[];
  recent_trades: CopyTrade[];
}

// Mock data interface for development
export interface CopyTradingMockData {
  traders: CopyTrader[];
  trades: CopyTrade[];
  positions: CopyPosition[];
  settings: CopySettings[];
  stats: CopyTradingStats;
}