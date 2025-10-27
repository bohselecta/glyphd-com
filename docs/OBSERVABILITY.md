# Observability

## Logging

**API Routes:**
```typescript
console.log(`[api] ${method} ${pathname}`, { userId, result })
```

**Cron Jobs:**
```typescript
console.log('[cron] job-name', timestamp, status)
```

**Errors:**
```typescript
console.error('[error]', { context, stack })
```

---

## Metrics

**Track:**
- API response times
- Rate limit hits
- Error rates
- Active collaborations
- Builder points awarded

**Example:**
```typescript
trackMetric('api.feed.get', duration)
trackMetric('rate_limit.hit', endpoint)
```

---

## Health Checks

**Endpoint:** `GET /api/health`

**Returns:**
```json
{
  "ok": true,
  "timestamp": "...",
  "version": "0.5.0",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "realtime": "ok"
  }
}
```

---

## Error Tracking

**Production:**
- Sentry integration
- Error boundaries
- Stack traces captured

**Development:**
- Console logging
- Local error files

---

## Performance Monitoring

**APM:**
- Query times
- API latency
- Memory usage
- CPU usage

**Alerts:**
- Response time >500ms
- Error rate >1%
- Memory usage >80%

---

## User Analytics

**Track:**
- Marks created
- Feed posts
- Collaborations started
- Votes cast
- Follows

**Privacy:**
- No personal data
- Aggregated stats only
- Opt-out supported

