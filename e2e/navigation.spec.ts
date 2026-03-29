import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Nav links render on homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('nav-home link is visible and points to /', async ({ page }) => {
      const navHome = page.locator('[data-testid="nav-home"]');
      await expect(navHome).toBeVisible();
      await expect(navHome).toHaveAttribute('href', '/');
    });

    test('nav-projects link is visible and points to /projects', async ({ page }) => {
      const navProjects = page.locator('[data-testid="nav-projects"]');
      await expect(navProjects).toBeVisible();
      await expect(navProjects).toHaveAttribute('href', '/projects');
    });

    test('nav-blog link is visible and points to /blog', async ({ page }) => {
      const navBlog = page.locator('[data-testid="nav-blog"]');
      await expect(navBlog).toBeVisible();
      await expect(navBlog).toHaveAttribute('href', '/blog');
    });

    test('nav-resume link is visible and points to /resume', async ({ page }) => {
      const navResume = page.locator('[data-testid="nav-resume"]');
      await expect(navResume).toBeVisible();
      await expect(navResume).toHaveAttribute('href', '/resume');
    });

    test('nav-contact link is visible and points to /contact', async ({ page }) => {
      const navContact = page.locator('[data-testid="nav-contact"]');
      await expect(navContact).toBeVisible();
      await expect(navContact).toHaveAttribute('href', '/contact');
    });
  });

  test.describe('Nav link navigation', () => {
    test('clicking nav-projects navigates to /projects', async ({ page }) => {
      await page.goto('/');
      await page.locator('[data-testid="nav-projects"]').click();
      await expect(page).toHaveURL('/projects');
    });

    test('clicking nav-blog navigates to /blog', async ({ page }) => {
      await page.goto('/');
      await page.locator('[data-testid="nav-blog"]').click();
      await expect(page).toHaveURL('/blog');
    });

    test('clicking nav-resume navigates to /resume', async ({ page }) => {
      await page.goto('/');
      await page.locator('[data-testid="nav-resume"]').click();
      await expect(page).toHaveURL('/resume');
    });

    test('clicking nav-contact navigates to /contact', async ({ page }) => {
      await page.goto('/');
      await page.locator('[data-testid="nav-contact"]').click();
      await expect(page).toHaveURL('/contact');
    });
  });

  test.describe('Layout elements', () => {
    test('footer is visible on homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-testid="footer"]')).toBeVisible();
    });

    test('footer is visible on every page', async ({ page }) => {
      for (const route of ['/projects', '/blog', '/resume', '/contact']) {
        await page.goto(route);
        await expect(page.locator('[data-testid="footer"]')).toBeVisible();
      }
    });
  });
});
