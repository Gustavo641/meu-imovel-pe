# LUNA CRM - Quality Gates & Release Checklist

## Overview

Quality gates define the minimum standards that code must meet before it can be merged to main or deployed to production.

---

## 🔒 Mandatory Quality Gates

### 1. Linting & Code Quality
- ✅ **ESLint**: All files pass ESLint rules
- ✅ **TypeScript**: No type errors or warnings
- ✅ **Formatting**: Code formatted with Prettier

**Check Command**:
```bash
npm run lint
```

**Fix Command**:
```bash
npm run lint -- --fix
```

---

### 2. Unit Test Coverage

| Metric | Target | Status |
|--------|--------|--------|
| Statements | ≥ 70% | ⏳ |
| Branches | ≥ 65% | ⏳ |
| Functions | ≥ 70% | ⏳ |
| Lines | ≥ 70% | ⏳ |

**Check Command**:
```bash
npm run test:coverage
```

**Coverage Report Location**:
```
packages/web/coverage/index.html
```

---

### 3. Unit Tests Passing

- ✅ All unit tests pass
- ✅ No skipped tests (test.skip)
- ✅ No pending tests (test.todo)

**Check Command**:
```bash
npm run test
```

---

### 4. E2E Tests Passing

**Browsers Required**:
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)

**Check Command**:
```bash
npm run test:e2e
```

**Scope**:
- Authentication flows
- Core business flows (lead creation, status updates)
- Responsive design (mobile/tablet/desktop)
- Dark mode functionality
- Accessibility compliance

---

### 5. Build Success

- ✅ No build errors
- ✅ No build warnings (except vendor warnings)
- ✅ Output bundles generated correctly

**Check Command**:
```bash
npm run build
```

---

### 6. Performance Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | ≥ 80 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 90 | Lighthouse CI |
| Lighthouse Best Practices | ≥ 85 | Lighthouse CI |
| First Contentful Paint | < 2s | Lighthouse |
| Largest Contentful Paint | < 3s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Blocking Time | < 150ms | Lighthouse |

**Run Lighthouse**:
```bash
# Local (requires build first)
npm run build
npx lighthouse https://localhost:5173

# Or via GitHub Actions (automatic on PR)
```

---

### 7. No Console Errors/Warnings

- ✅ No error logs in E2E tests
- ✅ No unhandled promise rejections
- ✅ No deprecation warnings

**Check Method**:
```typescript
// In E2E tests
await page.on('console', msg => {
  if (msg.type() === 'error') {
    throw new Error(`Console error: ${msg.text()}`);
  }
});
```

---

## 📋 Pre-Merge Checklist

Before merging to `main`, verify:

### Code Quality
- [ ] Lint passes (`npm run lint`)
- [ ] TypeScript passes (`tsc --noEmit`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Code formatted correctly

### Testing
- [ ] All unit tests pass (`npm run test`)
- [ ] Coverage meets targets (`npm run test:coverage`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] No flaky tests

### Build & Performance
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle size under 500kB (gzipped)
- [ ] Lighthouse score ≥ 80 on all metrics
- [ ] No console errors in E2E tests

### Documentation
- [ ] Changes documented in PR description
- [ ] README updated if applicable
- [ ] Changelog entries added
- [ ] Code comments where necessary

### Git Practices
- [ ] Commits are meaningful and well-formatted
- [ ] PR title follows convention: `feat/fix/docs/style/refactor: description`
- [ ] Branch is up-to-date with main
- [ ] No merge conflicts

---

## 🚀 Pre-Deploy Checklist

Before deploying to production:

### Verify on Staging
- [ ] All features work as expected
- [ ] Tested on multiple devices (desktop, mobile, tablet)
- [ ] Tested in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Dark mode works correctly
- [ ] Responsive design verified
- [ ] Accessibility tested with screen reader

### Security & Compliance
- [ ] No hardcoded secrets
- [ ] No API keys in code
- [ ] RLS policies verified
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting active on auth endpoints
- [ ] Audit logging enabled

### Database & Infrastructure
- [ ] Database migrations run successfully
- [ ] Backup strategy in place
- [ ] Environment variables configured
- [ ] CDN/caching configured correctly
- [ ] Monitoring/alerting set up

### Performance & Monitoring
- [ ] Core Web Vitals targets met
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Mixpanel/GA)
- [ ] Performance monitoring active
- [ ] Uptime monitoring active

### Documentation & Communication
- [ ] Release notes prepared
- [ ] Stakeholders informed
- [ ] Rollback plan documented
- [ ] Support team briefed on changes

---

## 🔄 Automated Quality Gates (CI/CD)

GitHub Actions automatically runs:

### On Every Push
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Vitest)
- ✅ Coverage check (v8)
- ✅ E2E tests (Playwright - 3 browsers)
- ✅ Build check

### On Pull Request
- ✅ All of above
- ✅ Lighthouse CI
- ✅ Code coverage report
- ✅ Test artifacts upload

### Required Checks to Pass
- ✅ Lint (can be auto-fixed)
- ✅ Unit tests
- ✅ E2E tests
- ✅ Build
- ✅ Code coverage

---

## 🎯 Target Metrics by Phase

### Phase 1-3 (Infrastructure & CRUD)
- Tests: Basic coverage
- Coverage: > 60%
- Lighthouse: N/A (not deployed)

### Phase 4-5 (UI Polish)
- Tests: > 60% coverage
- Coverage: > 70%
- Lighthouse: > 75

### Phase 6+ (Production Ready)
- Tests: > 80% coverage (critical paths)
- Coverage: > 80%
- Lighthouse: > 85 on all metrics
- E2E: All flows tested
- Performance: Core Web Vitals green

---

## 📊 Monitoring Quality Over Time

Track metrics in GitHub using:
- Workflow badges in README
- Coverage badges (Codecov)
- Automated PR comments
- GitHub project tracking

---

## 🔧 Enforcing Quality Gates

### Locally (Pre-Commit Hook)

Create `.husky/pre-commit`:
```bash
#!/bin/bash

# Run linter
npm run lint || exit 1

# Run unit tests
npm run test -- --run || exit 1

# Run type check
npx tsc --noEmit || exit 1

echo "✅ Pre-commit checks passed!"
```

### In CI (GitHub Actions)

All checks run automatically. PRs cannot be merged if:
- Linting fails
- Tests fail
- Build fails
- Coverage drops below thresholds

---

## 📝 Quality Gate Violations

### If Tests Fail

1. **Identify the failure**
   ```bash
   npm run test -- --grep "test name"
   ```

2. **Debug locally**
   ```bash
   npm run test:ui
   npm run test:e2e -- --debug
   ```

3. **Fix the issue**
   - Update test if requirements changed
   - Update code if test is correct

4. **Verify fix**
   ```bash
   npm run test:all
   ```

### If Coverage Drops

1. **Check what's missing**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

2. **Add tests for uncovered code**
   - Focus on critical paths
   - Aim for > 70% coverage

3. **Re-run coverage**
   ```bash
   npm run test:coverage
   ```

### If Lighthouse Fails

1. **Check the report**
   ```bash
   npm run build
   npx lighthouse http://localhost:3000
   ```

2. **Address the issues**
   - Performance: Code splitting, lazy loading
   - Accessibility: ARIA labels, contrast
   - SEO: Meta tags, structured data
   - Best Practices: Deprecations, security

3. **Re-run Lighthouse**
   ```bash
   npm run build
   ```

---

## 🎓 Best Practices

### Writing Testable Code
1. Keep functions pure
2. Inject dependencies
3. Avoid side effects in functions
4. Use meaningful test descriptions

### Maintaining Coverage
1. Write tests alongside features
2. Test behavior, not implementation
3. Keep test files alongside source
4. Review coverage reports regularly

### Managing Technical Debt
1. Create issues for long-term improvements
2. Don't bypass quality gates
3. Refactor with tests in place
4. Document design decisions

---

## 📞 Getting Help

- **Linting issues**: See `.eslintrc.json`
- **Test failures**: Check `TEST_GUIDE.md`
- **Coverage targets**: See `PERFORMANCE.md`
- **Build issues**: Check `packages/web/vite.config.ts`

---

**Last Updated**: 2026-08-18
**Version**: 1.0
