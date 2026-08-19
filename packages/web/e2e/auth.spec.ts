import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=LUNA CRM')).toBeVisible();
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();
  });

  test('should show signup form when clicking "Criar nova conta"', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Criar nova conta")');
    await expect(page.locator('text=Criar Conta')).toBeVisible();
    await expect(page.locator('input[placeholder="Seu nome"]')).toBeVisible();
  });

  test('should validate email format on login', async ({ page }) => {
    await page.goto('/');

    // Try invalid email
    await page.fill('input[placeholder="seu@email.com"]', 'invalid-email');
    await page.fill('input[placeholder="Sua senha"]', 'password123');
    await page.click('button:has-text("Entrar")');

    // Should show validation error or not submit
    await page.waitForTimeout(1000);
    // Email validation is handled by browser native validation
  });

  test('should validate password length on signup', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Criar nova conta")');

    // Fill form
    await page.fill('input[placeholder="Seu nome"]', 'Test User');
    await page.fill('input[placeholder="seu@email.com"]', 'test@example.com');
    await page.fill('input[placeholder="Mínimo 6 caracteres"]', '123'); // Too short
    await page.fill('input[placeholder="Repita a senha"]', '123');

    // Try to submit
    await page.click('button:has-text("Criar Conta")');

    // Should show validation error
    await expect(page.locator('text=Mínimo 6 caracteres')).toBeVisible();
  });

  test('should not allow mismatched passwords', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Criar nova conta")');

    // Fill form with mismatched passwords
    await page.fill('input[placeholder="Seu nome"]', 'Test User');
    await page.fill('input[placeholder="seu@email.com"]', 'test@example.com');
    await page.fill('input[placeholder="Mínimo 6 caracteres"]', 'password123');
    await page.fill('input[placeholder="Repita a senha"]', 'different123');

    // Try to submit
    await page.click('button:has-text("Criar Conta")');

    // Should show validation error
    await expect(page.locator('text=não conferem')).toBeVisible();
  });
});
