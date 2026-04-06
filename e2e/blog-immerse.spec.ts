import { test, expect } from '@playwright/test';

test.describe('Blog Immerse Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await page.evaluate(() => localStorage.removeItem('blog-immerse'));
  });

  test.describe('Toggle button rendering', () => {
    test('button renders on blog index', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-toggle"]')).toBeVisible();
    });

    test('wrapper renders on blog index', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toBeAttached();
    });
  });

  test.describe('Activation and deactivation', () => {
    test('toggle activates immerse', async ({ page }) => {
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
    });

    test('toggle deactivates immerse', async ({ page }) => {
      const toggle = page.locator('[data-testid="immerse-toggle"]');
      await toggle.click();
      await toggle.click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).not.toHaveAttribute(
        'data-immerse-active'
      );
    });
  });

  test.describe('Spotlight overlay', () => {
    test('spotlight overlay appears on activate', async ({ page }) => {
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-overlay"]')).toBeVisible();
    });

    test('spotlight overlay disappears on deactivate', async ({ page }) => {
      const toggle = page.locator('[data-testid="immerse-toggle"]');
      await toggle.click();
      await toggle.click();
      await expect(page.locator('[data-testid="immerse-overlay"]')).toHaveCount(0);
    });
  });

  test.describe('YouTube iframe', () => {
    test('YouTube iframe is present in DOM', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-youtube-iframe"]')).toBeAttached();
    });

    test('iframe has required src params', async ({ page }) => {
      const iframe = page.locator('[data-testid="immerse-youtube-iframe"]');
      const src = await iframe.getAttribute('src');
      expect(src).toContain('sWcLccMuCA8');
      expect(src).toContain('enablejsapi=1');
      expect(src).toContain('mute=1');
      expect(src).toContain('autoplay=1');
      expect(src).toContain('loop=1');
      expect(src).toContain('playlist=sWcLccMuCA8');
      expect(src).toContain('controls=0');
      expect(src).toContain('playsinline=1');
    });

    test('iframe is not visible on screen', async ({ page }) => {
      const iframeHandle = page.locator('[data-testid="immerse-youtube-iframe"]');
      const rect = await iframeHandle.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, width: r.width, height: r.height };
      });
      const isOffscreen = rect.left < 0 || rect.width === 0 || rect.height === 0;
      expect(isOffscreen).toBe(true);
    });

    test('no visible layout gap from hidden iframe', async ({ page }) => {
      const wrapper = page.locator('[data-testid="immerse-wrapper"]');
      const rect = await wrapper.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top };
      });
      expect(rect.top).toBeLessThan(100);
    });
  });

  test.describe('localStorage persistence', () => {
    const mockYTScript = `
      window.YT = {
        Player: function(el, config) {
          var self = this;
          setTimeout(function() {
            if (config && config.events && config.events.onReady) {
              config.events.onReady({ target: self });
            }
          }, 50);
        }
      };
      window.YT.Player.prototype.setVolume = function() {};
      window.YT.Player.prototype.unMute = function() {};
      window.YT.Player.prototype.playVideo = function() {};
      window.YT.Player.prototype.mute = function() {};
      window.YT.Player.prototype.destroy = function() {};
      window.YT.Player.prototype.getPlayerState = function() { return 1; };
      window.YT.Player.prototype.isMuted = function() { return false; };
    `;

    test('localStorage persistence — active state survives reload', async ({ page }) => {
      await page.route('**youtube.com/**', (route) => route.abort());
      await page.evaluate(() => localStorage.removeItem('blog-immerse'));

      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );

      await page.addInitScript({ content: mockYTScript });
      await page.reload();

      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true',
        { timeout: 5000 }
      );
    });

    test('localStorage persistence — inactive after exit survives reload', async ({ page }) => {
      await page.route('**youtube.com/**', (route) => route.abort());
      await page.evaluate(() => localStorage.removeItem('blog-immerse'));

      const toggle = page.locator('[data-testid="immerse-toggle"]');
      await toggle.click();
      await toggle.click();

      await page.addInitScript({ content: mockYTScript });
      await page.reload();

      await page.waitForTimeout(500);
      await expect(page.locator('[data-testid="immerse-wrapper"]')).not.toHaveAttribute(
        'data-immerse-active'
      );
    });
  });

  test.describe('Accessibility attributes', () => {
    test('button aria-label when inactive', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-toggle"]')).toHaveAttribute(
        'aria-label',
        'Enter immerse mode'
      );
    });

    test('button aria-pressed when active', async ({ page }) => {
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-toggle"]')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    });
  });

  test.describe('Edge cases', () => {
    test('empty blog state — button still works', async ({ page }) => {
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
    });

    test('rapid toggle clicks — final state is active after 5 clicks', async ({ page }) => {
      const toggle = page.locator('[data-testid="immerse-toggle"]');
      for (let i = 0; i < 5; i++) {
        await toggle.click();
      }
      await page.waitForTimeout(200);
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
    });
  });
});
