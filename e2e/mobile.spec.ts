import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe('Mobile Viewport', () => {
  test.describe('Homepage on mobile', () => {
    test('homepage loads on mobile viewport', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('navigation links are visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');
      await expect(page.locator('[data-testid="nav-home"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-projects"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-blog"]')).toBeVisible();
    });

    test('footer is visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');
      await expect(page.locator('[data-testid="footer"]')).toBeVisible();
    });

    test('hit-counter is visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');
      await expect(page.locator('[data-testid="hit-counter"]')).toBeVisible();
    });

    test('under-construction banner is visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/');
      await expect(page.locator('[data-testid="under-construction"]')).toBeVisible();
    });
  });

  test.describe('Blog on mobile', () => {
    test('blog listing loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/blog');
      await expect(page.locator('[data-testid="blog-post-card"]').first()).toBeVisible();
    });

    test('blog post page loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/blog/hello-world');
      await expect(page.locator('[data-testid="blog-post-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
    });
  });

  test.describe('Projects on mobile', () => {
    test('projects grid loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/projects');
      await expect(page.locator('[data-testid="projects-grid"]')).toBeVisible();
      await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible();
    });

    test('project detail page loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/projects/pixel-canvas');
      await expect(page.locator('[data-testid="project-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="project-description"]')).toBeVisible();
    });
  });

  test.describe('Resume on mobile', () => {
    test('resume page loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/resume');
      await expect(page.locator('[data-testid="resume-content"]')).toBeVisible();
      await expect(page.locator('[data-testid="resume-download"]')).toBeVisible();
    });
  });

  test.describe('Contact on mobile', () => {
    test('contact page loads on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/contact');
      await expect(page.locator('[data-testid="contact-github"]')).toBeVisible();
      await expect(page.locator('[data-testid="contact-linkedin"]')).toBeVisible();
      await expect(page.locator('[data-testid="contact-email"]')).toBeVisible();
    });
  });
});
