# CRM DO CORRETOR - Deployment Guide

## Overview

This guide covers deploying the CRM DO CORRETOR application to Vercel with proper environment configuration, testing, and monitoring.

---

## 🚀 Deployment Architecture

```
GitHub (Main Branch)
    ↓
GitHub Actions (Tests & Build)
    ↓
Vercel (Automatic Deploy)
    ├── Production (main branch)
    ├── Preview (pull requests)
    └── Staging (develop branch)
    ↓
CDN (Vercel Edge Network)
    ├── Static Files (HTML, CSS, JS)
    ├── Images (Optimized)
    └── API Redirects (to Supabase)
    ↓
Supabase (Backend)
    ├── PostgreSQL (Database)
    ├── Auth Service
    ├── Storage (Files)
    └── Realtime (WebSockets)
```

---

## 📋 Pre-Deployment Checklist

### 1. Quality Gates
```bash
# Ensure all quality gates pass
npm run test:all

# Check coverage
npm run test:coverage

# Build verification
npm run build

# Lighthouse check
npm run build
npx lighthouse http://localhost:3000
```

### 2. Environment Configuration

**Production Environment Variables** (Vercel Dashboard):
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[public-anon-key]
NODE_ENV=production
```

**Verify in Vercel Dashboard**:
1. Go to https://vercel.com/dashboard
2. Select the CRM DO CORRETOR project
3. Settings → Environment Variables
4. Confirm all variables are set

### 3. Database Readiness

```bash
# Verify migrations are applied
# In Supabase Console → SQL Editor:
SELECT * FROM roles;
SELECT * FROM leads LIMIT 1;

# Verify RLS policies are active
SELECT * FROM pg_policies;
```

### 4. Dependencies Updated

```bash
# Check for security vulnerabilities
npm audit

# Update dependencies if needed
npm update

# Commit changes
git add package*.json
git commit -m "chore: update dependencies"
git push
```

---

## 🌐 Deployment Process

### Automatic Deployment (Recommended)

**Trigger**: Push to main branch
```bash
git checkout main
git pull origin main

# Make your changes
git add .
git commit -m "feat: your feature"
git push origin main
```

**Process**:
1. GitHub Actions runs tests
2. If all pass → Vercel builds & deploys
3. Preview URL available immediately
4. Production live after ~2-3 minutes

### Manual Deployment (If Needed)

**Via Vercel CLI**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy staging
vercel --env production
```

**Via Vercel Dashboard**:
1. Go to https://vercel.com/dashboard
2. Select CRM DO CORRETOR project
3. Deployments tab
4. Click "Redeploy" next to desired commit

---

## ✅ Post-Deployment Verification

### 1. Check Deployment Status

```bash
# View deployment logs
vercel logs [project-name]

# Check recent deployments
vercel ls

# Verify production URL is working
curl https://luna-crm.vercel.app
```

### 2. Test Core Functionality

- [ ] Navigate to https://[your-domain]
- [ ] Login page loads
- [ ] Can create account
- [ ] Can create lead
- [ ] Can navigate to Funnel
- [ ] Can view Calendar
- [ ] Dark mode works
- [ ] Mobile responsive

### 3. Monitor Performance

```bash
# Check Core Web Vitals
# In Vercel Dashboard → Analytics

# Monitor errors
# In Vercel Dashboard → Functions (if using)

# Check database connection
# In Supabase Dashboard → Logs
```

### 4. Check for Errors

```bash
# View application errors
# Browser console (F12)
# Or in Vercel Analytics

# View server errors
# Supabase Dashboard → Logs → RLS policies
# Or → Logs → Edge Function logs
```

---

## 🔄 Rollback Procedure

### If Deployment Has Issues

**Option 1: Quick Rollback (via Vercel)**
```bash
# See previous deployments
vercel ls

# Redeploy previous version
vercel --prod --target=production [deployment-url]
```

**Option 2: Git Rollback**
```bash
# Find the previous commit
git log --oneline -10

# Revert to previous version
git revert [commit-hash]
git push origin main

# Vercel will automatically redeploy
```

**Option 3: Emergency Manual Revert**
```bash
# If you need to quickly fix a critical bug:
git checkout main
# Fix the bug
git add .
git commit -m "fix: critical bug"
git push origin main

# Vercel will build and deploy immediately
```

---

## 📊 Monitoring & Analytics

### Real-time Monitoring

**Vercel Analytics Dashboard**:
1. Go to Vercel Dashboard → CRM DO CORRETOR project
2. Analytics tab shows:
   - Page views
   - Top pages
   - Top referrers
   - Response time

**Supabase Dashboard**:
1. Go to Supabase Project
2. Check:
   - Database connections
   - Query performance
   - Storage usage
   - API requests

### Error Tracking

**Setup Sentry (Recommended)**:
```bash
# Install Sentry
npm i @sentry/react @sentry/tracing

# Initialize in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://[key]@[org].ingest.sentry.io/[project]",
  environment: process.env.NODE_ENV,
});
```

**Or check browser console for errors**:
- Browser DevTools → Console tab
- Filter by Error level

### Performance Monitoring

**Check Lighthouse Score**:
```bash
# After deployment
npx lighthouse https://luna-crm.vercel.app

# Target scores:
# Performance: > 80
# Accessibility: > 90
# Best Practices: > 85
# SEO: > 85
```

---

## 🔐 Production Best Practices

### 1. Environment Variables

**Sensitive values** (never commit):
- Database credentials
- API keys
- JWT secrets
- Third-party tokens

**Store in Vercel**:
```bash
# Via CLI
vercel env add VITE_SUPABASE_ANON_KEY

# Via Dashboard:
Settings → Environment Variables → Add New
```

### 2. Database Backups

**Supabase Automatic Backups**:
- Daily backups (free tier)
- Weekly backups (pro tier)
- Configure in Supabase Dashboard → Backups

**Manual Backup**:
```bash
# Export from Supabase
# Supabase Dashboard → SQL Editor
# SELECT * FROM leads;
# Export as CSV
```

### 3. Rate Limiting

**Auth Endpoint Rate Limits**:
- Supabase default: 5 requests per minute
- Configured in RLS policies

**API Rate Limiting**:
- Vercel provides DDoS protection
- Configure in Vercel Dashboard → Settings

### 4. CORS & Security Headers

**CORS Configuration** (Already set in Vite):
```typescript
// vite.config.ts
server: {
  cors: true,
}
```

**Security Headers** (Vercel automatically adds):
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Content-Security-Policy (configurable)

### 5. SSL/TLS Certificate

**Automatic with Vercel**:
- Free SSL certificate for all projects
- Auto-renewal handled by Vercel
- HTTPS enforced

**Verify**:
```bash
# Check certificate
curl -I https://luna-crm.vercel.app
# Should show: strict-transport-security
```

---

## 🚨 Incident Response

### If Production is Down

1. **Check Status**
   ```bash
   # Is Vercel having issues?
   # https://www.vercel.com/status
   
   # Is Supabase having issues?
   # https://status.supabase.com
   ```

2. **Check Recent Deployments**
   ```bash
   vercel ls
   # If last deployment is bad, rollback
   ```

3. **Check Database**
   ```bash
   # Supabase Dashboard → Health
   # Should show: All systems operational
   ```

4. **Check Application Logs**
   ```bash
   # Vercel Dashboard → Functions
   # Check error messages
   ```

5. **Execute Rollback if Needed**
   ```bash
   # See Rollback Procedure above
   ```

### Incident Communication

1. Update status page
2. Notify stakeholders on Slack
3. Post incident on GitHub
4. Document root cause and fix

---

## 📈 Scaling Considerations

### Database Scaling

**Current Setup** (Supabase Free):
- 500MB storage
- 2 GB egress/month
- No backups

**When to Upgrade**:
- > 100K leads
- Daily active users > 50
- Need backups for compliance

**Upgrade Path**:
```bash
# In Supabase Dashboard
1. Upgrade plan
2. No code changes needed
3. Automatic data migration
```

### Frontend Scaling

**Current Setup** (Vercel):
- 1K builds/month (free)
- Unlimited deployments
- CDN included

**When to Upgrade**:
- > 10K requests/day
- Need team collaboration
- Need priority support

---

## 📝 Deployment Checklist

### Before Deploying

- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Environment variables configured in Vercel
- [ ] Database migrations verified
- [ ] No breaking changes documented
- [ ] Stakeholders notified

### After Deploying

- [ ] Verify deployment succeeded
- [ ] Test core functionality
- [ ] Check for console errors
- [ ] Monitor error tracking
- [ ] Check Lighthouse score
- [ ] Monitor database performance
- [ ] Update change log

### Post-Deployment (Next 24h)

- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor user reports
- [ ] Document any issues
- [ ] Create follow-up tasks if needed

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Logs](https://github.com/[user]/[repo]/actions)

---

## 📞 Deployment Support

**Issues**:
- Vercel builds failing → Check GitHub Actions logs
- Database errors → Check Supabase logs
- Performance issues → Check Lighthouse report
- Environment variable issues → Check Vercel Settings

**Rollback**:
- Quick: Use Vercel dashboard
- Safe: Use git revert
- Emergency: Manual deployment

---

**Last Updated**: 2026-08-18
**Status**: Ready for production deployment
