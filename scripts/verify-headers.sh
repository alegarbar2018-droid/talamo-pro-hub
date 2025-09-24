#!/usr/bin/env bash
# Verify security headers implementation
set -euo pipefail

BASE_URL="${1:-http://localhost:5173}"
echo "🔒 Verificando headers de seguridad en: $BASE_URL"

# Test security headers on public route
echo "== Verificando headers principales =="
HEADERS=$(curl -sI "$BASE_URL/" | tr -d '\r')

check_header() {
    local header="$1"
    local expected="$2"
    local description="$3"
    
    if echo "$HEADERS" | grep -qi "^$header:"; then
        local value=$(echo "$HEADERS" | grep -i "^$header:" | cut -d: -f2- | xargs)
        echo "✅ $description: $value"
        
        if [[ -n "$expected" ]] && ! echo "$value" | grep -qi "$expected"; then
            echo "⚠️  Warning: Expected to contain '$expected'"
        fi
    else
        echo "❌ Missing: $description ($header)"
    fi
}

# Check required security headers
check_header "X-Frame-Options" "DENY" "Frame Options"
check_header "X-Content-Type-Options" "nosniff" "Content Type Options"
check_header "Referrer-Policy" "strict-origin-when-cross-origin" "Referrer Policy"
check_header "Content-Security-Policy" "default-src" "Content Security Policy"

# Check optional headers
check_header "Strict-Transport-Security" "" "HSTS (optional for dev)"
check_header "X-XSS-Protection" "" "XSS Protection (legacy)"

echo ""
echo "== Verificando CORS en Edge Functions =="

# Test CORS preflight
if command -v supabase &> /dev/null; then
    EDGE_URL=$(supabase status | grep "API URL" | awk '{print $3}' || echo "")
    if [[ -n "$EDGE_URL" ]]; then
        CORS_TEST_URL="${EDGE_URL}/functions/v1/health"
        echo "Testing CORS on: $CORS_TEST_URL"
        
        OPTIONS_RESPONSE=$(curl -sI -X OPTIONS \
            -H "Origin: https://talamo.app" \
            -H "Access-Control-Request-Method: POST" \
            -H "Access-Control-Request-Headers: Content-Type" \
            "$CORS_TEST_URL" | tr -d '\r')
        
        check_header "Access-Control-Allow-Origin" "https://talamo.app" "CORS Origin"
        check_header "Access-Control-Allow-Methods" "POST" "CORS Methods"
        check_header "Vary" "Origin" "Vary Header"
    else
        echo "ℹ️  Supabase not running locally, skipping Edge Functions CORS test"
    fi
else
    echo "ℹ️  Supabase CLI not available, skipping Edge Functions test"
fi

echo ""
echo "== Verificando CSP específico =="
CSP_HEADER=$(echo "$HEADERS" | grep -i "^content-security-policy:" | cut -d: -f2- | xargs || echo "")

if [[ -n "$CSP_HEADER" ]]; then
    echo "CSP completo: $CSP_HEADER"
    
    # Check for dangerous CSP values
    if echo "$CSP_HEADER" | grep -qi "unsafe-inline"; then
        echo "⚠️  Warning: 'unsafe-inline' found in CSP"
    fi
    
    if echo "$CSP_HEADER" | grep -qi "unsafe-eval"; then
        echo "⚠️  Warning: 'unsafe-eval' found in CSP"
    fi
    
    if echo "$CSP_HEADER" | grep -qi "\*"; then
        echo "⚠️  Warning: Wildcard (*) found in CSP"
    fi
else
    echo "❌ No Content-Security-Policy header found"
fi

echo ""
echo "== Resumen =="
MISSING_COUNT=$(echo "$HEADERS" | grep -c "❌" || echo "0")
WARNING_COUNT=$(echo "$HEADERS" | grep -c "⚠️" || echo "0")

if [[ "$MISSING_COUNT" -eq 0 && "$WARNING_COUNT" -eq 0 ]]; then
    echo "🎉 Todos los headers de seguridad están configurados correctamente"
    exit 0
elif [[ "$MISSING_COUNT" -eq 0 ]]; then
    echo "✅ Headers principales OK, pero hay $WARNING_COUNT advertencias"
    exit 0
else
    echo "❌ Faltan $MISSING_COUNT headers críticos de seguridad"
    exit 1
fi