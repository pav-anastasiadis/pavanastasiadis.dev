'use client';

import { useEffect, useRef, useState } from 'react';

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
}

interface BlogImmersePreference {
  active: boolean;
}

const STORAGE_KEY = 'blog-immerse';
const VIDEO_ID = 'sWcLccMuCA8';

interface BlogImmerseProps {
  children: React.ReactNode;
  mode?: 'spotlight' | 'dark-shift';
}

export default function BlogImmerse({ children, mode = 'spotlight' }: BlogImmerseProps) {
  const [isImmersed, setIsImmersed] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pendingUnmuteRef = useRef(false);

  useEffect(() => {
    function initPlayer() {
      if (!iframeRef.current || playerRef.current) return;
      playerRef.current = new window.YT!.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            event.target.setVolume(30);
            setIsPlayerReady(true);
            if (pendingUnmuteRef.current) {
              try {
                event.target.unMute();
                event.target.playVideo();
              } catch {
                // silent degradation
              }
              pendingUnmuteRef.current = false;
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
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlayerReady) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const pref: BlogImmersePreference = JSON.parse(stored);
        if (pref.active) {
          setIsImmersed(true);
          try {
            playerRef.current?.unMute();
            playerRef.current?.playVideo();
          } catch {
            // silent degradation
          }
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, [isPlayerReady]);

  function handleToggle() {
    const next = !isImmersed;
    setIsImmersed(next);

    if (next) {
      if (isPlayerReady && playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.playVideo();
        } catch {
          // visual-only fallback
        }
      } else {
        pendingUnmuteRef.current = true;
      }
    } else {
      try {
        playerRef.current?.mute();
      } catch {
        // ignore
      }
      pendingUnmuteRef.current = false;
    }

    try {
      const pref: BlogImmersePreference = { active: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
    } catch {
      // ignore localStorage errors
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const iframeSrc = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&enablejsapi=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1&origin=${origin}`;

  return (
    <div
      data-testid="immerse-wrapper"
      data-immerse-active={isImmersed ? 'true' : undefined}
      className={mode === 'dark-shift' && isImmersed ? 'immerse-dark-shift' : undefined}
    >
      {children}

      {/* Hidden YouTube iframe — off-screen positioning preserves playback */}
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
