'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    SC?: {
      Widget: ((iframe: HTMLIFrameElement | string) => SCWidget) & {
        Events: typeof SCWidgetEvents;
      };
    };
  }
}

interface SCWidget {
  play(): void;
  pause(): void;
  toggle(): void;
  seekTo(ms: number): void;
  setVolume(vol: number): void;
  getVolume(callback: (vol: number) => void): void;
  getPosition(callback: (pos: number) => void): void;
  getDuration(callback: (dur: number) => void): void;
  isPaused(callback: (paused: boolean) => void): void;
  bind(event: string, callback: (...args: unknown[]) => void): void;
  unbind(event: string): void;
}

const SCWidgetEvents = {
  READY: 'ready',
  PLAY: 'play',
  PAUSE: 'pause',
  FINISH: 'finish',
  PLAY_PROGRESS: 'playProgress',
  SEEK: 'seek',
  ERROR: 'error',
} as const;

interface BlogImmersePreference {
  version: 2;
  active: boolean;
  position: number;
}

const STORAGE_KEY = 'blog-immerse';
const SOUNDCLOUD_TRACK_URL = 'https://soundcloud.com/richarddjames/xtal';
const SAVE_INTERVAL_MS = 3000;

function readPref(): BlogImmersePreference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (parsed.version === 2) return parsed as unknown as BlogImmersePreference;
    }
  } catch (error) {
    console.warn('[BlogImmerse] Failed to read preference:', error);
  }
  return null;
}

function writePref(pref: Omit<BlogImmersePreference, 'version'>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, ...pref }));
  } catch (error) {
    console.warn('[BlogImmerse] Failed to write preference:', error);
  }
}

interface BlogImmerseProps {
  children: React.ReactNode;
  mode?: 'spotlight' | 'dark-shift';
}

export default function BlogImmerse({ children, mode = 'spotlight' }: BlogImmerseProps) {
  const [isImmersed, setIsImmersed] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);
  const lastKnownPositionRef = useRef<number>(0);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingResumeRef = useRef<number | false>(false);

  const stopSaveInterval = useCallback(() => {
    if (saveIntervalRef.current !== null) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  const startSaveInterval = useCallback(() => {
    stopSaveInterval();
    saveIntervalRef.current = setInterval(() => {
      writePref({ active: true, position: lastKnownPositionRef.current });
    }, SAVE_INTERVAL_MS);
  }, [stopSaveInterval]);

  useEffect(() => {
    function initWidget() {
      if (!iframeRef.current || widgetRef.current) return;
      const widget = window.SC!.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(SCWidgetEvents.READY, () => {
        widget.setVolume(30);
        setIsPlayerReady(true);

        if (pendingResumeRef.current !== false) {
          const resumeMs = pendingResumeRef.current;
          pendingResumeRef.current = false;
          try {
            widget.play();
            // seekTo after play() — SoundCloud seekTo is unreliable before playback starts;
            // delay 300ms to let buffering begin before seeking
            setTimeout(() => {
              try {
                widget.seekTo(resumeMs);
              } catch (error) {
                console.warn('[BlogImmerse] seekTo failed:', error);
              }
            }, 300);
            startSaveInterval();
          } catch (error) {
            console.warn('[BlogImmerse] Resume play failed (autoplay may be blocked):', error);
          }
        }
      });

      widget.bind(SCWidgetEvents.PLAY_PROGRESS, (...args: unknown[]) => {
        const data = args[0] as { currentPosition: number };
        lastKnownPositionRef.current = data.currentPosition;
      });

      widget.bind(SCWidgetEvents.ERROR, (error: unknown) => {
        console.warn('[BlogImmerse] SoundCloud widget error:', error);
      });
    }

    if (window.SC?.Widget) {
      initWidget();
    } else {
      if (!document.querySelector('script[src*="w.soundcloud.com/player/api.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://w.soundcloud.com/player/api.js';
        script.async = true;
        script.onload = () => initWidget();
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.SC?.Widget) {
            clearInterval(interval);
            initWidget();
          }
        }, 50);
        setTimeout(() => clearInterval(interval), 10000);
      }
    }

    return () => {
      const widget = widgetRef.current;
      if (widget) {
        try {
          const pref = readPref();
          if (pref?.active) {
            writePref({ active: true, position: lastKnownPositionRef.current });
          }
        } catch (error) {
          console.warn('[BlogImmerse] Failed to save position on unmount:', error);
        }
        try {
          widget.pause();
        } catch (error) {
          console.warn('[BlogImmerse] Failed to pause on unmount:', error);
        }
        try {
          widget.unbind(SCWidgetEvents.READY);
          widget.unbind(SCWidgetEvents.PLAY_PROGRESS);
          widget.unbind(SCWidgetEvents.ERROR);
        } catch (error) {
          console.warn('[BlogImmerse] Failed to unbind widget events:', error);
        }
        widgetRef.current = null;
      }
      stopSaveInterval();
    };
  }, [startSaveInterval, stopSaveInterval]);

  useEffect(() => {
    const pref = readPref();
    if (pref?.active) {
      setIsImmersed(true);
      pendingResumeRef.current = pref.position;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopSaveInterval();
    };
  }, [stopSaveInterval]);

  function handleToggle() {
    const next = !isImmersed;
    setIsImmersed(next);

    if (next) {
      if (isPlayerReady && widgetRef.current) {
        try {
          widgetRef.current.play();
          widgetRef.current.seekTo(0);
          lastKnownPositionRef.current = 0;
          startSaveInterval();
        } catch (error) {
          console.warn('[BlogImmerse] Play failed on toggle:', error);
        }
      } else {
        pendingResumeRef.current = 0;
      }
      writePref({ active: true, position: 0 });
    } else {
      stopSaveInterval();
      const savedPosition = lastKnownPositionRef.current;
      if (widgetRef.current) {
        try {
          widgetRef.current.pause();
        } catch (error) {
          console.warn('[BlogImmerse] Pause failed on toggle:', error);
        }
      }
      writePref({ active: false, position: savedPosition });
    }
  }

  const iframeSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_TRACK_URL)}&auto_play=false&show_artwork=false&show_comments=false&show_user=false&show_reposts=false&visual=false`;

  return (
    <div
      data-testid="immerse-wrapper"
      data-immerse-active={isImmersed ? 'true' : undefined}
      className={mode === 'dark-shift' && isImmersed ? 'immerse-dark-shift' : undefined}
    >
      {children}

      <iframe
        ref={iframeRef}
        data-testid="immerse-audio-iframe"
        className="immerse-iframe-hidden"
        src={iframeSrc}
        allow="autoplay"
        title="Background music"
        tabIndex={-1}
        aria-hidden="true"
      />

      {isImmersed && mode === 'spotlight' && (
        <div data-testid="immerse-overlay" className="immerse-spotlight-overlay" />
      )}

      <button
        data-testid="immerse-toggle"
        className={`immerse-button glass ambient-shadow${isImmersed ? ' active' : ''}`}
        onClick={handleToggle}
        aria-label={isImmersed ? 'Exit immerse mode' : 'Enter immerse mode'}
        aria-pressed={isImmersed}
        type="button"
      >
        {isImmersed ? '✕' : '🎧'}
      </button>
    </div>
  );
}
