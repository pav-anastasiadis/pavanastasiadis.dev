import { test, expect } from '@playwright/test';

test.describe('Contact', () => {
  test.describe('Contact social links', () => {
    test('contact-github link is visible', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.locator('[data-testid="contact-github"]')).toBeVisible();
    });

    test('contact-github points to GitHub profile', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-github"]');
      await expect(link).toHaveAttribute('href', 'https://github.com/pav-anastasiadis');
    });

    test('contact-github opens in new tab', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-github"]');
      await expect(link).toHaveAttribute('target', '_blank');
    });

    test('contact-github has correct rel attribute', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-github"]');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('contact-linkedin link is visible', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.locator('[data-testid="contact-linkedin"]')).toBeVisible();
    });

    test('contact-linkedin points to LinkedIn profile', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-linkedin"]');
      await expect(link).toHaveAttribute('href', 'https://linkedin.com/in/pav-anastasiadis');
    });

    test('contact-linkedin opens in new tab', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-linkedin"]');
      await expect(link).toHaveAttribute('target', '_blank');
    });

    test('contact-linkedin has correct rel attribute', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-linkedin"]');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('contact-email link is visible', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.locator('[data-testid="contact-email"]')).toBeVisible();
    });

    test('contact-email has mailto href', async ({ page }) => {
      await page.goto('/contact');
      const link = page.locator('[data-testid="contact-email"]');
      await expect(link).toHaveAttribute('href', 'mailto:pav@example.com');
    });
  });

  test.describe('Contact page content', () => {
    test('contact page shows Contact heading', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible();
    });
  });
});
