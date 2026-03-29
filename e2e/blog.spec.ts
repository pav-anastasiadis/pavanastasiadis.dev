import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.describe('Blog listing page', () => {
    test('shows empty state with 0 blog post cards', async ({ page }) => {
      await page.goto('/blog');
      const cards = page.locator('[data-testid="blog-post-card"]');
      await expect(cards).toHaveCount(0);
    });

    test('shows empty state message', async ({ page }) => {
      await page.goto('/blog');
      await expect(page.locator('text=/no posts/i')).toBeVisible();
    });

    test('tag filter section is hidden when 0 posts', async ({ page }) => {
      await page.goto('/blog');
      await expect(page.locator('[data-testid="tag-filter"]')).toHaveCount(0);
    });
  });

  test.describe('Blog 404 handling', () => {
    test('navigating to nonexistent blog slug shows not-found page', async ({ page }) => {
      const response = await page.goto('/blog/nonexistent-slug-xyz');
      expect(response?.status()).toBe(404);
    });
  });
});
