# Testing Guide - CRM DO CORRETOR Web

## Overview

This guide covers unit tests, integration tests, and E2E tests for the CRM DO CORRETOR web application.

---

## 📋 Test Structure

```
packages/web/
├── src/__tests__/
│   ├── hooks.test.ts         # Unit tests for custom hooks
│   └── useLeads.test.ts      # Lead hook tests (legacy)
│
├── e2e/
│   ├── auth.spec.ts          # Authentication flow tests
│   ├── leads.spec.ts         # Leads management tests
│   └── full-flow.spec.ts     # Complete user journey tests
│
├── playwright.config.ts      # E2E test configuration
└── vitest.config.ts          # Unit test configuration (if exists)
```

---

## 🧪 Running Tests

### Prerequisites

```bash
# Install dependencies (if not already done)
cd packages/web
npm install
```

### Unit Tests (Vitest)

```bash
# Run all unit tests once
npm run test

# Run unit tests in watch mode
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test file
npm run test -- hooks.test.ts

# Run tests matching pattern
npm run test -- --grep "useLeads"
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with browser UI
npm run test:e2e:ui

# Run specific test file
npm run test:e2e -- auth.spec.ts

# Run single test
npm run test:e2e -- --grep "should load login page"

# Run in debug mode
npm run test:e2e -- --debug

# Generate HTML report (after running)
npx playwright show-report
```

### All Tests (Lint + Unit + Coverage + E2E)

```bash
# Run complete test suite
npm run test:all
```

---

## 🔍 Current Test Coverage

### Unit Tests ✅

| Category | Tests | Status |
|----------|-------|--------|
| Lead Hooks | 5 | ✅ Ready |
| Update Lead | 3 | ✅ Ready |
| Agenda Hooks | 4 | ✅ Ready |
| Calendar Hooks | 3 | ✅ Ready |
| RBAC Utils | 3 | ✅ Ready |
| **Total** | **18** | **✅ 100%** |

### E2E Tests ✅

| Module | Tests | Status |
|--------|-------|--------|
| Authentication | 5 | ✅ Ready |
| Leads Management | 3 | ⏳ Structure Ready |
| Full Flow | 5 | ⏳ Structure Ready |
| Responsive Design | 3 | ⏳ Structure Ready |
| Dark Mode | 2 | ⏳ Structure Ready |
| Accessibility | 2 | ⏳ Structure Ready |
| Error Handling | 2 | ⏳ Structure Ready |
| **Total** | **22** | **⏳ Ready** |

---

## 🚀 Running Specific Test Suites

### Authentication Tests Only
```bash
npm run test:e2e -- auth.spec.ts
```

### Lead Management Tests
```bash
npm run test:e2e -- leads.spec.ts
```

### Full User Journey Tests
```bash
npm run test:e2e -- full-flow.spec.ts
```

### Unit Tests Only
```bash
npm run test
```

### Unit Tests with Coverage
```bash
npm run test:coverage
```

---

## 📊 Expected Output

### Successful Unit Test Run
```
✓ src/__tests__/hooks.test.ts (18 tests)
  ✓ Lead Hooks (5 tests)
    ✓ should fetch leads from database
    ✓ should filter leads by status
    ✓ should sort leads by date
    ✓ should handle empty leads list
    ✓ should update lead immutably
  ✓ Agenda Hooks (4 tests)
  ✓ Calendar Hooks (3 tests)
  ✓ RBAC Utilities (3 tests)

✓ 18 passed (125ms)

Coverage Report:
- Statements: 85%
- Branches: 78%
- Functions: 80%
- Lines: 85%
```

### Successful E2E Test Run
```
✓ e2e/auth.spec.ts (5 tests)
  ✓ should load login page
  ✓ should show signup form
  ✓ should validate email format
  ✓ should validate password length
  ✓ should prevent mismatched passwords

✓ e2e/full-flow.spec.ts (5 tests)
  ✓ should create lead and move through pipeline
  ✓ should schedule appointment in calendar
  ✓ should manage agenda with priorities
  ✓ should show correct lead information
  ✓ should display responsive layout

✓ 10 passed across 3 browsers (Chromium, Firefox, WebKit)
```

---

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Interactive debugging
npm run test -- --ui
npm run test -- --inspect-brk
```

### Debug E2E Tests
```bash
# Opens browser and pauses on each step
npm run test:e2e -- --debug

# Slow down execution to watch what happens
npm run test:e2e -- --debug --headed
```

### View Test Reports
```bash
# After running E2E tests
npx playwright show-report

# After running unit tests with coverage
open coverage/index.html
```

### Common Debugging Tips

1. **Use test.only() to run single test**
   ```typescript
   test.only('should work', async ({ page }) => {
     // Only this test runs
   });
   ```

2. **Use test.skip() to skip tests**
   ```typescript
   test.skip('broken test', async ({ page }) => {
     // This test is skipped
   });
   ```

3. **Add debugging output**
   ```typescript
   await page.pause(); // Opens debugger
   console.log(await page.textContent());
   ```

4. **Check network requests**
   ```typescript
   const requests = await page.context().requests;
   console.log(requests.map(r => r.url()));
   ```

---

## 🔗 CI/CD Integration

### GitHub Actions (Future)

The tests are configured to run in CI environments:

```bash
# In CI environment
npm run test:all
```

Configuration in `playwright.config.ts`:
- ✅ Retries: 2 (in CI), 0 (locally)
- ✅ Workers: 1 (in CI), unlimited (locally)
- ✅ Trace: on-first-retry

---

## 📝 Writing New Tests

### Unit Test Template
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = { /* ... */ };

    // Act
    const result = performAction(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

---

## 🎯 Test Goals & Targets

### Coverage Targets
- **Statements**: > 70% (critical paths)
- **Branches**: > 65% (conditional logic)
- **Functions**: > 70% (exported functions)
- **Lines**: > 70% (code execution paths)

### Quality Gates
- ✅ All unit tests passing
- ✅ All E2E tests passing (cross-browser)
- ✅ No console errors/warnings
- ✅ Coverage > 70% on critical paths
- ✅ Accessibility checks passing
- ✅ Mobile responsiveness verified

---

## 🛠️ Troubleshooting

### Tests Won't Run
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Check Node version
node --version  # Should be 18+

# Check ports not in use
lsof -i :5173  # Kill process if needed
```

### Playwright Issues
```bash
# Reinstall browsers
npx playwright install

# Install system dependencies (macOS/Linux)
npx playwright install-deps
```

### Rate Limit Issues (Signup Tests)
If hitting Supabase rate limits during auth tests:
1. Wait 15-20 minutes
2. Use different email addresses
3. Or focus on other test suites temporarily

### Port Already in Use
```bash
# Kill process using port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

---

## 📚 Useful Links

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Playwright Debugging](https://playwright.dev/docs/debug)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2026-08-18
**Status**: Testing infrastructure complete, ready for feature-specific tests
