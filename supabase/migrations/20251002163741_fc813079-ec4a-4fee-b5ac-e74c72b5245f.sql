-- Paso 1: Migrar tabla market_data para usar PK compuesta (symbol, timestamp)

-- Eliminar constraint de PK actual
ALTER TABLE market_data DROP CONSTRAINT IF EXISTS market_data_pkey;

-- Eliminar columna id (ya no necesaria)
ALTER TABLE market_data DROP COLUMN IF EXISTS id;

-- Agregar nueva PRIMARY KEY compuesta
ALTER TABLE market_data ADD PRIMARY KEY (symbol, timestamp);

-- El índice ya existe pero lo verificamos
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_ts ON market_data(symbol, timestamp DESC);