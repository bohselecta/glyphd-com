# Demo Mode - Local Testing Without Database

## ✅ What's Working

You can now test Glyphd locally **without connecting to Supabase or configuring a database**. Demo mode uses simple cookie-based authentication that works offline.

## 🚀 How to Use Demo Mode

### 1. Start the Dev Server

```bash
cd apps/web
npm run dev
```

The app will start at `http://localhost:5173`

### 2. Access the Login Page

Visit: `http://localhost:5173/login`

You'll see two options:
- **Email Login** - Full Supabase authentication (requires setup)
- **👤 Continue as Demo User** - Instant demo login (no setup needed!)

### 3. Click "Continue as Demo User"

This will:
- Create a temporary demo user session
- Store it in a cookie (lasts 7 days)
- Redirect you to the dashboard

### 4. Explore the App

You can now:
- ✅ Browse all pages
- ✅ Test the UI and components
- ✅ Build new marks (though they won't persist to database)
- ✅ Navigate throughout the app
- ✅ Test all features that don't require database

---

## 🎯 What Demo Mode Does

### Creates Demo Session
- Sets a cookie with demo user ID
- Returns demo user data to auth endpoints
- Middleware recognizes demo sessions

### Works Without:
- ❌ Supabase configuration
- ❌ Database setup
- ❌ Environment variables (for auth)
- ❌ Email magic links

### What Still Works:
- ✅ All UI and pages
- ✅ Client-side features
- ✅ File-based mark creation (saves to `public/symbols/`)
- ✅ Image generation (if API keys set)
- ✅ UI/UX testing

---

## 🔄 Switching Between Demo and Real Auth

### Currently Active
Both demo and real auth work side-by-side.

- **Demo login** → Uses cookies, no database needed
- **Email login** → Requires Supabase setup

### To Use Only Real Auth

Edit `apps/web/app/login/page.tsx` and remove the demo button section (lines 78-109).

### To Disable Demo Mode in Production

Edit `apps/web/middleware.ts` line 94:

```typescript
// Change from:
const isAuthenticated = user || demoUser

// To:
const isAuthenticated = user  // Demo disabled
```

---

## 🧪 Testing Checklist

### Demo Mode Testing:
- [ ] Click "Continue as Demo User"
- [ ] Should redirect to dashboard
- [ ] Session persists on page refresh
- [ ] Can navigate to all pages
- [ ] Can create marks (file-based)
- [ ] Sign out works
- [ ] Can log back in as demo user

### What Won't Work:
- ❌ Database-backed features (feed, profiles, etc.)
- ❌ Supabase real-time features
- ❌ Collaborative features that require database
- ❌ Comments, likes that store to database

---

## 🔧 Technical Details

### Demo Authentication Flow

1. **User clicks "Continue as Demo User"**
2. **POST to `/api/auth/demo`**
3. **Server creates cookie with random ID**
4. **Cookie returned to client**
5. **Session endpoint checks for cookie**
6. **Returns demo user data if present**

### Middleware Integration

Middleware checks for:
1. Real Supabase session
2. Demo cookie session
3. Allows access if either exists

### Sign Out

- Clears demo cookie
- Or signs out from Supabase
- Redirects to login

---

## 💡 Use Cases

### Perfect For:
- ✅ UI/UX testing
- ✅ Design reviews
- ✅ Feature demos
- ✅ Local development
- ✅ Testing before database setup
- ✅ Quick prototypes

### Not Suitable For:
- ❌ Testing database features
- ❌ Testing real user flows
- ❌ Performance testing
- ❌ Production deployment

---

## 🚨 Limitations

1. **File-based storage only**
   - Marks saved to `apps/web/public/symbols/`
   - Won't sync with database

2. **No persistence across deployments**
   - Cookies cleared on redeploy
   - Session lost on server restart

3. **No user profiles**
   - Demo user has no persistent data
   - No builder points, reputation, etc.

4. **Limited features**
   - Feed, collab, comments need database
   - Real-time features need Supabase

---

## 🎉 Summary

**Demo mode is now active!** 

You can:
- Test locally without any setup
- Skip Supabase configuration for now
- Focus on UI/UX testing
- Set up database when ready for production

**To launch with database:**
1. Set up Supabase
2. Run schema SQL
3. Configure environment variables
4. Disable demo mode (optional)

**Enjoy testing!** 🚀

