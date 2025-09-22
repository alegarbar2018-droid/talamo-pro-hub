## [Unreleased]

### Added
- **Hardened Authentication System**: Centralized affiliation validation with `secure-affiliation-check`
- **Server-side Password Policy**: ≥8 chars, ≥1 uppercase, ≥1 number enforcement
- **Enhanced Exness Client**: Token caching with safety window, timeouts, exponential backoff
- **Unified API Contracts**: Standardized JSON responses with error codes (Unauthorized, Throttled, BadRequest, UpstreamError, etc.)
- **Security Hardening**: Rate limiting (10 req/5min), audit logging without PII, CORS restrictions
- **Health & Metrics Endpoints**: `/health` and `/metrics` for observability
- **Comprehensive Test Suite**: Smoke, unit, contract, and integration tests
- **Backward Compatibility**: Wrapper functions maintain existing API contracts

### Changed
- **Unified Error Handling**: Structured response codes replace text parsing
- **Enhanced UX**: Real-time password validation feedback, cooldown UI for rate limits
- **Robust Client Logic**: No retries on 401, controlled retries on 429/5xx with jitter
- **Email Normalization**: Trim + lowercase before upstream calls
- **Environment Security**: Moved sensitive credentials to server-side only

### Security
- **Fixed Critical Vulnerability**: Admin access to customer personal information
- **Data Segregation**: Separate functions for basic vs sensitive profile data
- **Audit Trail**: All sensitive access requires justification and logging
- **PII Protection**: Hash-based logging, no credentials in client bundle
- **Access Control**: Principle of least privilege for admin operations

### Tests
- **Contract Tests**: Ensure API backward compatibility
- **Load Tests**: 20 RPS resilience with rate limiting
- **E2E Scenarios**: Registration, login, validation flows
- **Security Tests**: Rate limiting, password policies, error handling

### Infrastructure
- **Observability**: Request logging with timing, status codes, retry counts
- **Health Monitoring**: Database and auth service health checks
- **Metrics Collection**: User counts, failed logins, affiliation checks (24h windows)
- **Feature Flags**: All new functionality reversible via flags (default OFF)