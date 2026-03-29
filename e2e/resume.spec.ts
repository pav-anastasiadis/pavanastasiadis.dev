import { test, expect } from '@playwright/test';

test.describe('Resume', () => {
  test.describe('Resume page content', () => {
    test('resume-content section is visible', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('[data-testid="resume-content"]')).toBeVisible();
    });

    test('resume page shows Resume heading', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.getByRole('heading', { name: 'Resume', exact: true })).toBeVisible();
    });

    test('resume page shows Experience section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=Experience')).toBeVisible();
    });

    test('resume page shows Senior Data Engineer job', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=Senior Data Engineer')).toBeVisible();
    });

    test('resume page shows Skills & Technologies section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=Skills')).toBeVisible();
    });

    test('resume page shows Python skill', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.getByText('Python', { exact: true }).first()).toBeVisible();
    });

    test('resume page shows Education section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=Education')).toBeVisible();
    });
  });

  test.describe('Resume download', () => {
    test('resume-download link is visible', async ({ page }) => {
      await page.goto('/resume');
      const downloadLink = page.locator('[data-testid="resume-download"]');
      await expect(downloadLink).toBeVisible();
    });

    test('resume-download link points to /resume.pdf', async ({ page }) => {
      await page.goto('/resume');
      const downloadLink = page.locator('[data-testid="resume-download"]');
      await expect(downloadLink).toHaveAttribute('href', '/resume.pdf');
    });

    test('resume-download link has download attribute', async ({ page }) => {
      await page.goto('/resume');
      const downloadLink = page.locator('[data-testid="resume-download"]');
      await expect(downloadLink).toHaveAttribute('download');
    });

    test('/resume.pdf returns status 200', async ({ page }) => {
      const response = await page.request.get('/resume.pdf');
      expect(response.status()).toBe(200);
    });
  });
});
