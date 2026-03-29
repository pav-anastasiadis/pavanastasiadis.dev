import { test, expect } from '@playwright/test';

test.describe('RSS Feed', () => {
  test('GET /rss.xml returns status 200', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);
  });

  test('GET /rss.xml returns XML content-type', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
  });

  test('RSS feed contains XML declaration', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('<?xml version="1.0"');
  });

  test('RSS feed has valid RSS 2.0 structure', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('<rss version="2.0">');
    expect(text).toContain('<channel>');
    expect(text).toContain('</channel>');
    expect(text).toContain('</rss>');
  });

  test('RSS feed contains blog post items', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('<item>');
    expect(text).toContain('</item>');
  });

  test('RSS feed contains hello-world post', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('Hello World');
    expect(text).toContain('/blog/hello-world');
  });

  test('RSS feed contains building-retro-web post', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('Building Retro Web Aesthetics');
    expect(text).toContain('/blog/building-retro-web');
  });

  test('RSS feed contains typescript-tips post', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('TypeScript Tips That Actually Matter');
    expect(text).toContain('/blog/typescript-tips');
  });

  test('RSS feed channel has title', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    const text = await response.text();
    expect(text).toContain('<title>Pav Anastasiadis Blog</title>');
  });
});
