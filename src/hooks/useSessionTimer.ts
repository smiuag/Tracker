"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionTimer() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedAt === null) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startedAt]);

  const start = useCallback(() => {
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }, []);

  const reset = useCallback(() => {
    setStartedAt(null);
    setElapsedSeconds(0);
  }, []);

  return { isRunning: startedAt !== null, startedAt, elapsedSeconds, start, reset };
}
