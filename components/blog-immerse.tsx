'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement | string,
        config: {
          events: {
            onReady?: (event: { target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(vol: number): void;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
}

interface BlogImmersePreference {
  active: boolean;
  time?: number;
}

const STORAGE_KEY = 'blog-immerse';
const VIDEO_ID = 'sWcLccMuCA8';
const SAVE_INTERVAL_MS = 3000;

function readPref(): BlogImmersePreference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BlogImmersePreference;
  } catch {
    /* noop */
  }
  return null;
}

function writePref(pref: BlogImmersePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  } catch {
    /* noop */
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
  const playerRef = useRef<YTPlayer | null>(null);
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
      if (playerRef.current) {
        try {
          const t = playerRef.current.getCurrentTime();
          writePref({ active: true, time: t });
        } catch {
          /* noop */
        }
      }
    }, SAVE_INTERVAL_MS);
  }, [stopSaveInterval]);

  useEffect(() => {
    function initPlayer() {
      if (!iframeRef.current || playerRef.current) return;
      playerRef.current = new window.YT!.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            event.target.setVolume(30);
            setIsPlayerReady(true);

            if (pendingResumeRef.current !== false) {
              try {
                const resumeTime = pendingResumeRef.current;
                event.target.seekTo(resumeTime, true);
                event.target.unMute();
                event.target.playVideo();
              } catch {
                /* noop */
              }
              pendingResumeRef.current = false;
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
        prevCallback?.();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          const t = playerRef.current.getCurrentTime();
          const pref = readPref();
          if (pref?.active) {
            writePref({ active: true, time: t });
          }
        } catch {
          /* noop */
        }
        try {
          playerRef.current.destroy();
        } catch {
          /* noop */
        }
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const pref = readPref();
    if (pref?.active) {
      setIsImmersed(true);
      pendingResumeRef.current = pref.time ?? 0;
    }
  }, []);

  useEffect(() => {
    if (!isPlayerReady || pendingResumeRef.current === false) return;
    try {
      const resumeTime = pendingResumeRef.current;
      playerRef.current?.seekTo(resumeTime, true);
      playerRef.current?.unMute();
      playerRef.current?.playVideo();
      startSaveInterval();
    } catch {
      /* noop */
    }
    pendingResumeRef.current = false;
  }, [isPlayerReady, startSaveInterval]);

  useEffect(() => {
    return () => {
      stopSaveInterval();
    };
  }, [stopSaveInterval]);

  function handleToggle() {
    const next = !isImmersed;
    setIsImmersed(next);

    if (next) {
      if (isPlayerReady && playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.playVideo();
          startSaveInterval();
        } catch {
          /* noop */
        }
      } else {
        pendingResumeRef.current = 0;
      }
      writePref({ active: true, time: 0 });
    } else {
      stopSaveInterval();
      let currentTime = 0;
      if (playerRef.current) {
        try {
          currentTime = playerRef.current.getCurrentTime();
          playerRef.current.pauseVideo();
          playerRef.current.mute();
        } catch {
          /* noop */
        }
      }
      writePref({ active: false, time: currentTime });
    }
  }

  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const iframeSrc = `https://www.youtube.com/embed/${VIDEO_ID}?mute=1&enablejsapi=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1${origin ? `&origin=${origin}` : ''}`;

  return (
    <div
      data-testid="immerse-wrapper"
      data-immerse-active={isImmersed ? 'true' : undefined}
      className={mode === 'dark-shift' && isImmersed ? 'immerse-dark-shift' : undefined}
    >
      {children}

      <iframe
        ref={iframeRef}
        data-testid="immerse-youtube-iframe"
        className="immerse-iframe-hidden"
        src={iframeSrc}
        allow="autoplay"
        title="Background music"
        tabIndex={-1}
        aria-hidden="true"
        frameBorder="0"
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
