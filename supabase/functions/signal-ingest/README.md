# Signal Ingest Function

Edge function to securely receive trading signals from MetaTrader 5 Expert Advisors (EA).

## Public URL

```
https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/signal-ingest
```

## Authentication

Requires `Authorization: Bearer <MT5_SECRET_TOKEN>` header.

The token must match the `MT5_SECRET_TOKEN` environment variable set in Supabase secrets.

## Idempotency

Requires `Idempotency-Key: <UUID>` header to prevent duplicate signal insertion.

Use a unique UUID v4 for each signal. If the same key is sent twice, the second request will return `{ "ok": true, "duplicated": true }` without creating a duplicate record.

## Request Format

**Method:** `POST`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <YOUR_MT5_SECRET_TOKEN>`
- `Idempotency-Key: <UUID_V4>`

**Body:** (max 2KB)

```json
{
  "pattern": "EMA_Crossover",
  "action": "BUY",
  "symbol": "EURUSD",
  "entry": 1.0850,
  "tp_pips": 70,
  "sl_pips": 30,
  "timeframe": "H1",
  "bar_time": "2025-10-14T10:00:00Z",
  "win_prob": "80%",
  "explanation": "Cruce alcista con EMA200 y volumen alto."
}
```

### Field Validation

- `pattern`: String, 1-64 chars. Name of the detected pattern.
- `action`: Enum `BUY` or `SELL`.
- `symbol`: String, 1-20 chars, alphanumeric + `_/-`. Example: `EURUSD`, `BTCUSDT`.
- `entry`: Number, finite. Entry price.
- `tp_pips`: Number, finite. Take profit in pips.
- `sl_pips`: Number, finite. Stop loss in pips.
- `timeframe`: String, 1-8 chars. Example: `M15`, `H1`, `D1`.
- `bar_time`: ISO 8601 datetime string. Bar timestamp.
- `win_prob`: String, max 20 chars. Win probability (e.g., "80%").
- `explanation`: String, max 500 chars. Signal rationale.

## Response Format

### Success - New Signal

```json
{
  "ok": true,
  "inserted": true
}
```

**Status:** `200 OK`

### Success - Duplicate (Idempotency)

```json
{
  "ok": true,
  "duplicated": true
}
```

**Status:** `200 OK`

### Error Responses

#### 400 Bad Request

Missing idempotency key:
```json
{
  "ok": false,
  "error": "missing_idempotency_key"
}
```

Invalid idempotency key format:
```json
{
  "ok": false,
  "error": "invalid_idempotency_key_format"
}
```

#### 401 Unauthorized

Invalid or missing token:
```json
{
  "ok": false,
  "error": "unauthorized"
}
```

#### 405 Method Not Allowed

Non-POST request:
```json
{
  "ok": false,
  "error": "method_not_allowed"
}
```

#### 413 Payload Too Large

Body exceeds 2KB:
```json
{
  "ok": false,
  "error": "payload_too_large"
}
```

#### 422 Unprocessable Entity

Validation failed:
```json
{
  "ok": false,
  "error": "validation_error",
  "details": [...]
}
```

#### 500 Internal Server Error

Server error:
```json
{
  "ok": false,
  "error": "internal_error"
}
```

## Example cURL

```bash
curl -X POST https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/signal-ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_MT5_SECRET_TOKEN_HERE" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "pattern": "EMA_Crossover",
    "action": "BUY",
    "symbol": "EURUSD",
    "entry": 1.0850,
    "tp_pips": 70,
    "sl_pips": 30,
    "timeframe": "H1",
    "bar_time": "2025-10-14T10:00:00Z",
    "win_prob": "80%",
    "explanation": "Cruce alcista con EMA200 y volumen alto."
  }'
```

## Deployment

Deploy the function:

```bash
supabase functions deploy signal-ingest
```

Set required secrets:

```bash
supabase secrets set MT5_SECRET_TOKEN=your_secure_random_token_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** Generate a strong random token for `MT5_SECRET_TOKEN`. Share it securely with your EA.

## Security Considerations

- Never expose `MT5_SECRET_TOKEN` in logs or client code.
- Generate a unique `Idempotency-Key` (UUID v4) for each signal in your EA.
- The function uses the Supabase Service Role Key to bypass RLS policies.
- All signals are stored with `source: 'mt5_ea'` and `author_id: '00000000-0000-0000-0000-000000000000'` (system user).
- Signals are automatically set to `status: 'published'` and `result: 'pending'`.
- TP/SL prices are calculated from pips using standard forex conventions (0.0001 for most pairs, 0.01 for JPY pairs).

## Database Schema

Signals are inserted into `public.signals` with these fields:

- `author_id`: UUID (system: `00000000-0000-0000-0000-000000000000`)
- `symbol`: Text (from payload)
- `timeframe`: Text (from payload)
- `direction`: Text (`'long'` for BUY, `'short'` for SELL)
- `entry_price`: Numeric (from payload)
- `stop_loss`: Numeric (calculated from `sl_pips`)
- `take_profit`: Numeric (calculated from `tp_pips`)
- `logic`: Text (constructed from pattern, explanation, win_prob, bar_time, pips)
- `confidence`: Text (from `win_prob`)
- `status`: Text (`'published'`)
- `result`: Text (`'pending'`)
- `source`: Enum (`'mt5_ea'`)
- `dedup_key`: Text (from `Idempotency-Key` header)
- `created_at`: Timestamptz (auto)
- `updated_at`: Timestamptz (auto)

## QA Test Cases

1. **Valid insertion**: Returns `{ ok: true, inserted: true }`
2. **Duplicate key**: Second request with same `Idempotency-Key` returns `{ ok: true, duplicated: true }`
3. **Invalid token**: Returns `401 Unauthorized`
4. **Missing idempotency key**: Returns `400 Bad Request`
5. **Invalid action** (not BUY/SELL): Returns `422 Unprocessable Entity`
6. **Invalid entry** (NaN): Returns `422 Unprocessable Entity`
7. **Invalid bar_time**: Returns `422 Unprocessable Entity`
8. **Payload too large** (>2KB): Returns `413 Payload Too Large`
9. **Non-POST method**: Returns `405 Method Not Allowed`
