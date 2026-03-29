import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.describe('Blog listing page', () => {
    test('shows all blog post cards', async ({ page }) => {
      await page.goto('/blog');
      const cards = page.locator('[data-testid="blog-post-card"]');
      await expect(cards).toHaveCount(3);
    });

    test('shows tag filter pills', async ({ page }) => {
      await page.goto('/blog');
      const tagFilters = page.locator('[data-testid="tag-filter"]');
      await expect(tagFilters.first()).toBeVisible();
    });

    test('ALL tag is active by default', async ({ page }) => {
      await page.goto('/blog');
      const activeTag = page.locator('[data-testid="active-tag"]').first();
      await expect(activeTag).toBeVisible();
      await expect(activeTag).toHaveText('ALL');
    });

    test('clicking a tag filter updates the URL', async ({ page }) => {
      await page.goto('/blog');
      const cssTag = page.locator('[data-testid="tag-filter"]', { hasText: '#css' }).first();
      await expect(cssTag).toBeVisible();
      await cssTag.click();
      await expect(page).toHaveURL(/\?tag=css/);
    });

    test('filtering by css tag shows only matching posts', async ({ page }) => {
      await page.goto('/blog?tag=css');
      const cards = page.locator('[data-testid="blog-post-card"]');
      await expect(cards).toHaveCount(1);
    });

    test('active tag is highlighted when filtering by tag', async ({ page }) => {
      await page.goto('/blog?tag=css');
      const activeTag = page.locator('[data-testid="active-tag"]', { hasText: '#css' }).first();
      await expect(activeTag).toBeVisible();
    });

    test('filtering by non-existent tag shows empty state message', async ({ page }) => {
      await page.goto('/blog?tag=nonexistenttag99');
      await expect(page.locator('text=No posts found for tag')).toBeVisible();
    });

    test('post cards link to correct post pages', async ({ page }) => {
      await page.goto('/blog');
      const firstCard = page.locator('[data-testid="blog-post-card"]').first();
      await firstCard.locator('a').first().click();
      await expect(page).toHaveURL(/\/blog\//);
    });
  });

  test.describe('Blog post pages', () => {
    test('hello-world post renders title', async ({ page }) => {
      await page.goto('/blog/hello-world');
      const title = page.locator('[data-testid="blog-post-title"]');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Hello World');
    });

    test('hello-world post shows tags', async ({ page }) => {
      await page.goto('/blog/hello-world');
      const tags = page.locator('[data-testid="blog-post-tags"]');
      await expect(tags).toBeVisible();
      await expect(tags).toContainText('meta');
      await expect(tags).toContainText('personal');
    });

    test('hello-world post renders content', async ({ page }) => {
      await page.goto('/blog/hello-world');
      const content = page.locator('[data-testid="blog-content"]');
      await expect(content).toBeVisible();
    });

    test('building-retro-web post renders title', async ({ page }) => {
      await page.goto('/blog/building-retro-web');
      const title = page.locator('[data-testid="blog-post-title"]');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Building Retro Web Aesthetics');
    });

    test('typescript-tips post renders title', async ({ page }) => {
      await page.goto('/blog/typescript-tips');
      const title = page.locator('[data-testid="blog-post-title"]');
      await expect(title).toBeVisible();
      await expect(title).toContainText('TypeScript Tips That Actually Matter');
    });

    test('typescript-tips post shows typescript tag', async ({ page }) => {
      await page.goto('/blog/typescript-tips');
      const tags = page.locator('[data-testid="blog-post-tags"]');
      await expect(tags).toContainText('typescript');
    });
  });

  test.describe('Blog 404 handling', () => {
    test('navigating to nonexistent blog slug shows not-found page', async ({ page }) => {
      const response = await page.goto('/blog/nonexistent-slug-xyz');
      expect(response?.status()).toBe(404);
    });
  });
});
