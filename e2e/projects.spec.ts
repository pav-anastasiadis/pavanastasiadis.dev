import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test.describe('Projects grid page', () => {
    test('projects-grid is visible', async ({ page }) => {
      await page.goto('/projects');
      await expect(page.locator('[data-testid="projects-grid"]')).toBeVisible();
    });

    test('shows 1 project card', async ({ page }) => {
      await page.goto('/projects');
      const cards = page.locator('[data-testid="project-card"]');
      await expect(cards).toHaveCount(1);
    });

    test('project cards are clickable links to detail pages', async ({ page }) => {
      await page.goto('/projects');
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();
      await expect(page).toHaveURL(/\/projects\//);
    });
  });

  test.describe('Project detail pages', () => {
    test('pixel-canvas detail shows title', async ({ page }) => {
      await page.goto('/projects/pixel-canvas');
      const title = page.locator('[data-testid="project-title"]');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Pixel Canvas');
    });

    test('pixel-canvas detail shows description', async ({ page }) => {
      await page.goto('/projects/pixel-canvas');
      const desc = page.locator('[data-testid="project-description"]');
      await expect(desc).toBeVisible();
      await expect(desc).toContainText('pixel art canvas');
    });

    test('pixel-canvas detail shows demo-link (demoAvailable: true)', async ({ page }) => {
      await page.goto('/projects/pixel-canvas');
      const demoLink = page.locator('[data-testid="demo-link"]');
      await expect(demoLink).toBeVisible();
      await expect(demoLink).toHaveAttribute('href', '/projects/pixel-canvas/demo');
    });
  });

  test.describe('Demo page', () => {
    test('pixel-canvas demo page shows demo-container', async ({ page }) => {
      await page.goto('/projects/pixel-canvas/demo');
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
    });

    test('pixel-canvas demo page loads demo-interactive after dynamic import', async ({ page }) => {
      await page.goto('/projects/pixel-canvas/demo');
      await page.waitForSelector('[data-testid="demo-interactive"]', { timeout: 10000 });
      await expect(page.locator('[data-testid="demo-interactive"]')).toBeVisible();
    });
  });
});
