'use client';

import { useEffect, useState } from 'react';

export const TIMEZONE = 'Europe/Amsterdam';

export default function TimezoneClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: TIMEZONE,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
      setDate(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: TIMEZONE,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(now)
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center">
        <p className="text-4xl font-light tracking-tight text-on-surface tabular-nums">--:--:--</p>
        <p className="text-sm text-on-surface-variant mt-1">{TIMEZONE}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-4xl font-light tracking-tight text-on-surface tabular-nums">{time}</p>
      <p className="text-sm text-on-surface-variant mt-1">{date}</p>
      <p className="text-xs text-on-surface-variant mt-0.5 opacity-60">{TIMEZONE}</p>
    </div>
  );
}
