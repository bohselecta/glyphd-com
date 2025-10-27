# Security Model

## Authentication

### Current: Demo Token
Protected routes require `x-demo-auth` header:
```
x-demo-auth: demo-token
```

### Future: Real Auth
Replace with NextAuth/Clerk/Supabase in `middleware.ts`:

```typescript
// NextAuth example
const session = await getToken({ req })
if (!session) return 401
```

---

## CSRF Protection

**Two layers:**
1. **Same-origin check** — Request must come from same domain
2. **CSRF token** — Custom header `x-csrf-token`

```typescript
// Client sends:
headers: {
  'x-csrf-token': 'hash-from-session'
}
```

---

## Rate Limiting

**Memory-based (dev):** In-memory Map
**Production:** Redis/Upstash KV

**Limits:**
- Comments: 10/min/IP
- Follow: 30/min/user
- Feed post: TBD

---

## Data Exposure

**Public APIs expose:**
- Username only (never email)
- Public mark metadata
- Feed posts
- Builder reputation scores

**Never exposed:**
- Email addresses
- Internal user IDs
- Auth tokens
- Private mark content

---

## File System Security

**Collab files:**
- Stored in `public/collabs/`
- Validated ownership before access
- Turn-based permissions enforced

**Builder events:**
- Append-only log
- Immutable after write
- Recomputed periodically

---

## Input Validation

All API endpoints validate:
- Required fields present
- Types correct
- Length limits enforced
- XSS/script injection prevention

---

## Error Handling

Never expose:
- Stack traces in production
- Internal errors to users
- Database connection strings
- File paths

Always return:
- Generic error messages
- HTTP status codes
- Structured JSON responses

---

## Deployment Checklist

- [ ] HTTPS enabled (TLS 1.2+)
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] CSRF tokens required
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS protection (CSP, sanitization)
- [ ] Secrets in environment variables
- [ ] Database credentials rotated
- [ ] Logging configured (no secrets)

