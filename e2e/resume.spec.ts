import { test, expect } from '@playwright/test';

test.describe('Resume', () => {
  test.describe('Resume page content', () => {
    test('resume-content section is visible', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('[data-testid="resume-content"]')).toBeVisible();
    });

    test('resume page shows RESUME.EXE heading', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=RESUME.EXE')).toBeVisible();
    });

    test('resume page shows work history section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=WORK_HISTORY')).toBeVisible();
    });

    test('resume page shows Senior Frontend Engineer job', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=Senior Frontend Engineer')).toBeVisible();
    });

    test('resume page shows skills section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=SKILLS_&_TECHNOLOGIES')).toBeVisible();
    });

    test('resume page shows TypeScript skill', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=TypeScript')).toBeVisible();
    });

    test('resume page shows education section', async ({ page }) => {
      await page.goto('/resume');
      await expect(page.locator('text=EDUCATION')).toBeVisible();
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
