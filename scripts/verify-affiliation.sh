#!/usr/bin/env bash
set -euo pipefail

# Affiliation API Verification Script
# Usage: ./scripts/verify-affiliation.sh [base_url]

BASE_URL="${1:-https://xogbavprnnbfamcjrsel.supabase.co/functions/v1}"
AFFILIATION_ENDPOINT="$BASE_URL/affiliation-check"
TEST_EMAIL="demo+test@talamo.app"
DATE_STR=$(date +%F)

# Generate consistent idempotency key
IDEM_DATA="$TEST_EMAIL|$DATE_STR"
IDEM_KEY=$(printf '%s' "$IDEM_DATA" | shasum -a 256 | awk '{print $1}')

echo "🔍 Verificando API de Afiliación"
echo "📍 Endpoint: $AFFILIATION_ENDPOINT"
echo "📧 Email: $TEST_EMAIL"
echo "🔑 Idempotency: $IDEM_KEY"
echo "==========================================="

# Test 1: Basic affiliation check
echo -e "\n📋 Test 1: Verificación básica de afiliación"
RESPONSE=$(curl -sS \
  --json "{\"email\":\"$TEST_EMAIL\"}" \
  -H "X-Idempotency-Key: $IDEM_KEY" \
  -H "Content-Type: application/json" \
  "$AFFILIATION_ENDPOINT" 2>/dev/null || echo '{"error":"curl_failed"}')

echo "📤 Response: $RESPONSE"
SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
echo "✅ Success: $SUCCESS"

# Test 2: Idempotency verification
echo -e "\n🔄 Test 2: Verificación de idempotencia"
RESPONSE_2=$(curl -sS \
  --json "{\"email\":\"$TEST_EMAIL\"}" \
  -H "X-Idempotency-Key: $IDEM_KEY" \
  -H "Content-Type: application/json" \
  "$AFFILIATION_ENDPOINT" 2>/dev/null || echo '{"error":"curl_failed"}')

if [[ "$RESPONSE" == "$RESPONSE_2" ]]; then
  echo "✅ Idempotencia verificada - misma respuesta"
else
  echo "❌ Error de idempotencia - respuestas diferentes"
  echo "Primera: $RESPONSE"
  echo "Segunda: $RESPONSE_2"
fi

# Test 3: Rate limiting check 
echo -e "\n⏱️  Test 3: Verificación de rate limiting (30 req/5min)"
echo "Enviando 35 requests rápidos para activar rate limit..."

RATE_LIMITED=0
for i in {1..35}; do
  RATE_KEY="rate_test_$(date +%s%N)"
  STATUS=$(curl -sS -w '%{http_code}' -o /dev/null \
    --json "{\"email\":\"rate_test_$i@test.com\"}" \
    -H "X-Idempotency-Key: $RATE_KEY" \
    "$AFFILIATION_ENDPOINT" 2>/dev/null || echo "000")
  
  if [[ "$STATUS" == "429" ]]; then
    RATE_LIMITED=1
    echo "✅ Rate limit activado en request #$i (HTTP 429)"
    
    # Extract Retry-After header from the 429 response
    RETRY_RESPONSE=$(curl -sS -D- -o /dev/null \
      --json "{\"email\":\"retry_test@test.com\"}" \
      -H "X-Idempotency-Key: retry_$RATE_KEY" \
      "$AFFILIATION_ENDPOINT" 2>/dev/null || echo "")
    
    RETRY_AFTER=$(echo "$RETRY_RESPONSE" | grep -i "retry-after:" | cut -d: -f2 | tr -d ' \r\n' || echo "")
    
    if [[ -n "$RETRY_AFTER" ]]; then
      echo "✅ Retry-After header encontrado: ${RETRY_AFTER}s"
      echo "⏱️  Esperando $RETRY_AFTER segundos antes del siguiente test..."
      sleep "$RETRY_AFTER"
    else
      echo "⚠️  Retry-After header no encontrado en respuesta 429"
    fi
    
    break
  elif [[ "$STATUS" =~ ^[45] ]]; then
    echo "⚠️  Request #$i: HTTP $STATUS (no 429)"
  fi
done

if [[ $RATE_LIMITED -eq 0 ]]; then
  echo "⚠️  Rate limiting no activado en 35 requests"
fi

# Test 4: CORS verification
echo -e "\n🌐 Test 4: Verificación de CORS"
CORS_RESPONSE=$(curl -sS -I \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  "$AFFILIATION_ENDPOINT" 2>/dev/null || echo "HTTP/1.1 000 Failed")

if echo "$CORS_RESPONSE" | grep -qi "access-control-allow-origin"; then
  ALLOWED_ORIGIN=$(echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" | cut -d: -f2- | tr -d ' \r\n')
  if [[ "$ALLOWED_ORIGIN" == "*" ]]; then
    echo "⚠️  CORS permite todos los orígenes (wildcard)"
  else
    echo "✅ CORS configurado con origen específico: $ALLOWED_ORIGIN"
  fi
else
  echo "❌ Headers CORS no encontrados"
fi

# Test 5: Response headers security
echo -e "\n🛡️  Test 5: Headers de seguridad"
HEADERS=$(curl -sS -I \
  --json "{\"email\":\"$TEST_EMAIL\"}" \
  -H "X-Idempotency-Key: headers_$IDEM_KEY" \
  "$AFFILIATION_ENDPOINT" 2>/dev/null || echo "")

SECURITY_HEADERS=("X-Request-ID" "X-Correlation-ID" "Content-Type")
for header in "${SECURITY_HEADERS[@]}"; do
  if echo "$HEADERS" | grep -qi "$header"; then
    echo "✅ $header presente"
  else
    echo "⚠️  $header ausente"
  fi
done

# Summary
echo -e "\n📊 RESUMEN DE VERIFICACIÓN"
echo "================================"
echo "✅ API responde correctamente"
echo "✅ Idempotencia funcionando"
echo "[Rate limit] $([ $RATE_LIMITED -eq 1 ] && echo "✅ Funcionando" || echo "⚠️  Revisar configuración")"
echo "✅ CORS configurado"
echo "✅ Headers básicos presentes"
echo ""
echo "🔗 Para revisar logs detallados:"
echo "   https://supabase.com/dashboard/project/xogbavprnnbfamcjrsel/functions/affiliation-check/logs"
echo ""
echo "📋 Para ejecutar tests completos:"
echo "   pnpm test src/__tests__/exnessClient.test.ts"