-- Desactivar automatización de BTCUSDT
UPDATE signal_automation_config
SET enabled = false
WHERE symbol = 'BTCUSDT';

-- Eliminar todas las señales automáticas de BTCUSDT
DELETE FROM signals
WHERE instrument = 'BTCUSDT'
AND source = 'automated';