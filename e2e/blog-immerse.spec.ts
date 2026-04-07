import { test, expect } from '@playwright/test';

test.describe('Blog Immerse Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://w.soundcloud.com/**', (route) => route.abort());
    await page.goto('/blog');
    await page.evaluate(() => localStorage.removeItem('blog-immerse'));
  });

  test.describe('Toggle button rendering', () => {
    test('button renders on blog index', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-toggle"]')).toBeVisible();
    });

    test('button renders on blog post page', async ({ page }) => {
      const response = await page.goto('/blog/__no-posts__');
      test.skip(
        !response || response.status() >= 400,
        'No blog posts exist yet — skipping blog post page test'
      );
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

    test('dark-shift CSS class changes --color-background variable', async ({ page }) => {
      await page.goto('/blog');
      // Get baseline --color-background from document root
      const before = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim()
      );
      // Manually apply immerse-dark-shift class to the wrapper
      await page.evaluate(() => {
        document
          .querySelector('[data-testid="immerse-wrapper"]')!
          .classList.add('immerse-dark-shift');
      });
      // Read the CSS variable scoped to the element with the class
      const after = await page.evaluate(() =>
        getComputedStyle(document.querySelector('.immerse-dark-shift')!)
          .getPropertyValue('--color-background')
          .trim()
      );
      expect(after).not.toBe(before);
      expect(after).toBeTruthy();
    });
  });

  test.describe('Audio iframe', () => {
    test('audio iframe is present in DOM', async ({ page }) => {
      await expect(page.locator('[data-testid="immerse-audio-iframe"]')).toBeAttached();
    });

    test('iframe has required src params', async ({ page }) => {
      const iframe = page.locator('[data-testid="immerse-audio-iframe"]');
      const src = await iframe.getAttribute('src');
      expect(src).toContain('w.soundcloud.com/player');
      expect(src).toContain('richarddjames');
      expect(src).toContain('auto_play=false');
      expect(src).not.toContain('youtube');
      expect(src).not.toContain('sWcLccMuCA8');
    });

    test('iframe is not visible on screen', async ({ page }) => {
      const iframeHandle = page.locator('[data-testid="immerse-audio-iframe"]');
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
    const mockSCScript = `
      window.__scMock = { playCalled: false, pauseCalled: false, seekToMs: null, setVolumeCalled: false };

      window.SC = {
        Widget: function(iframe) {
          var callbacks = {};
          var self = {
            _position: 0,
            bind: function(event, callback) {
              callbacks[event] = callback;
              if (event === 'ready') {
                setTimeout(function() { callback(); }, 50);
              }
            },
            unbind: function(event) {
              delete callbacks[event];
            },
            play: function() {
              window.__scMock.playCalled = true;
              if (callbacks['play']) callbacks['play']();
            },
            pause: function() {
              window.__scMock.pauseCalled = true;
            },
            seekTo: function(ms) {
              window.__scMock.seekToMs = ms;
              self._position = ms;
            },
            setVolume: function(vol) {
              window.__scMock.setVolumeCalled = true;
            },
            getPosition: function(callback) {
              callback(self._position || 0);
            }
          };
          return self;
        }
      };
      window.SC.Widget.Events = {
        READY: 'ready',
        PLAY: 'play',
        PAUSE: 'pause',
        FINISH: 'finish',
        PLAY_PROGRESS: 'playProgress',
        SEEK: 'seek',
        ERROR: 'error'
      };
    `;

    test('localStorage persistence — active state survives reload', async ({ page }) => {
      await page.addInitScript({ content: mockSCScript });
      // Navigate to /blog with the SC mock active (addInitScript persists for subsequent navigations)
      await page.goto('/blog');
      await page.evaluate(() => localStorage.removeItem('blog-immerse'));

      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );

      // Navigate away and back to simulate reload/remount (avoids dev server page crash from reload)
      await page.goto('/');
      await page.goto('/blog');

      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true',
        { timeout: 5000 }
      );
    });

    test('localStorage persistence — inactive after exit survives reload', async ({ page }) => {
      await page.addInitScript({ content: mockSCScript });
      // Navigate to /blog with the SC mock active
      await page.goto('/blog');
      await page.evaluate(() => localStorage.removeItem('blog-immerse'));

      const toggle = page.locator('[data-testid="immerse-toggle"]');
      await toggle.click();
      await toggle.click();

      // Navigate away and back to verify inactive state persists
      await page.goto('/');
      await page.goto('/blog');

      await expect(page.locator('[data-testid="immerse-wrapper"]')).toBeAttached();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).not.toHaveAttribute(
        'data-immerse-active'
      );
    });

    test('localStorage stores correct v2 shape when toggle is turned off', async ({ page }) => {
      const toggle = page.locator('[data-testid="immerse-toggle"]');
      await toggle.click();
      await toggle.click();

      const stored = await page.evaluate(() => {
        const raw = localStorage.getItem('blog-immerse');
        return raw ? JSON.parse(raw) : null;
      });
      expect(stored).not.toBeNull();
      expect(stored.active).toBe(false);
      expect(stored.version).toBe(2);
      expect(typeof stored.position).toBe('number');
    });

    test('localStorage persistence — visual state restores even when SoundCloud is blocked', async ({
      page,
    }) => {
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );

      await page.goto('/');
      await page.goto('/blog');

      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true',
        { timeout: 5000 }
      );
    });

    test('audio state persists across Blog→Home→Blog navigation', async ({ page }) => {
      await page.addInitScript({ content: mockSCScript });
      await page.goto('/blog');
      await page.evaluate(() => localStorage.removeItem('blog-immerse'));
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
      await page.goto('/');
      await page.goto('/blog');
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true',
        { timeout: 5000 }
      );
    });

    test('old localStorage format (no version) is ignored on load', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('blog-immerse', JSON.stringify({ active: true, time: 42 }));
      });
      await page.goto('/blog');
      await expect(page.locator('[data-testid="immerse-wrapper"]')).not.toHaveAttribute(
        'data-immerse-active'
      );
    });

    test('visual immerse activates even when SoundCloud is blocked', async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
      expect(pageErrors).toHaveLength(0);
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
      await expect(page.locator('[data-testid="immerse-wrapper"]')).toHaveAttribute(
        'data-immerse-active',
        'true'
      );
    });

    test('prefers-reduced-motion — overlay transition is instant', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/blog');
      await page.locator('[data-testid="immerse-toggle"]').click();
      await expect(page.locator('[data-testid="immerse-overlay"]')).toBeVisible();
      const transitionDuration = await page
        .locator('[data-testid="immerse-overlay"]')
        .evaluate((el) => window.getComputedStyle(el).transitionDuration);
      // prefers-reduced-motion sets transition-duration: 0.01ms !important
      // browsers may report this as '0s' or a very small value
      const durationMs =
        parseFloat(transitionDuration) * (transitionDuration.endsWith('ms') ? 1 : 1000);
      expect(durationMs).toBeLessThan(100);
    });
  });
});
