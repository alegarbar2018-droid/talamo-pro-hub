-- ============================================
-- AUDIT ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker TEXT NOT NULL DEFAULT 'exness',
    login TEXT NOT NULL,
    server TEXT NOT NULL,
    platform TEXT CHECK (platform IN ('mt4', 'mt5')),
    status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'verification_pending', 'verified', 'syncing', 'error')),
    verified_at TIMESTAMPTZ,
    enc_credentials TEXT NOT NULL,
    metaapi_account_id TEXT,
    last_sync_at TIMESTAMPTZ,
    sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, login, server)
);

CREATE INDEX idx_audit_accounts_user ON public.audit_accounts(user_id);
CREATE INDEX idx_audit_accounts_status ON public.audit_accounts(status);

-- ============================================
-- AUDIT TRADES TABLE (Normalized)
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.audit_accounts(id) ON DELETE CASCADE,
    ticket TEXT NOT NULL,
    symbol TEXT NOT NULL,
    type TEXT NOT NULL,
    volume NUMERIC NOT NULL,
    open_time TIMESTAMPTZ NOT NULL,
    close_time TIMESTAMPTZ,
    open_price NUMERIC NOT NULL,
    close_price NUMERIC,
    profit NUMERIC,
    commission NUMERIC DEFAULT 0,
    swap NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(account_id, ticket)
);

CREATE INDEX idx_audit_trades_account ON public.audit_trades(account_id);
CREATE INDEX idx_audit_trades_close_time ON public.audit_trades(account_id, close_time);
CREATE INDEX idx_audit_trades_symbol ON public.audit_trades(account_id, symbol);

-- ============================================
-- AUDIT EQUITY TABLE (Time Series)
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_equity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.audit_accounts(id) ON DELETE CASCADE,
    time TIMESTAMPTZ NOT NULL,
    balance NUMERIC NOT NULL,
    equity NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_equity_account_time ON public.audit_equity(account_id, time DESC);

-- ============================================
-- AUDIT STATS DAILY TABLE (Precomputed)
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_stats_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.audit_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    win_rate NUMERIC,
    max_dd NUMERIC,
    profit_factor NUMERIC,
    gross_profit NUMERIC,
    gross_loss NUMERIC,
    total_trades INTEGER,
    avg_win NUMERIC,
    avg_loss NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(account_id, date)
);

CREATE INDEX idx_audit_stats_account_date ON public.audit_stats_daily(account_id, date DESC);

-- ============================================
-- AUDIT VERIFICATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.audit_accounts(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'found', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    found_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_verification_account ON public.audit_verification(account_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.audit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_equity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_verification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit accounts"
    ON public.audit_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit accounts"
    ON public.audit_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audit accounts"
    ON public.audit_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own audit accounts"
    ON public.audit_accounts FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own audit trades"
    ON public.audit_trades FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_accounts
            WHERE id = audit_trades.account_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own audit equity"
    ON public.audit_equity FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_accounts
            WHERE id = audit_equity.account_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own audit stats"
    ON public.audit_stats_daily FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_accounts
            WHERE id = audit_stats_daily.account_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own audit verification"
    ON public.audit_verification FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_accounts
            WHERE id = audit_verification.account_id
            AND user_id = auth.uid()
        )
    );

CREATE OR REPLACE FUNCTION update_audit_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_accounts_updated_at
    BEFORE UPDATE ON public.audit_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_accounts_updated_at();