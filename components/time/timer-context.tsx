'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { TimerState } from '@/lib/types/time';

const STORAGE_KEY = 'cashcast_timer_state';

interface TimerContextValue {
  timer: TimerState;
  startTimer: (projectName: string, clientName?: string) => void;
  stopTimer: () => Promise<TimerState | null>;
  resetTimer: () => void;
  updateProject: (projectName: string, clientName?: string) => void;
}

const defaultTimer: TimerState = {
  isRunning: false,
  projectName: '',
  clientName: '',
  startTime: null,
  elapsedSeconds: 0,
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timer, setTimer] = useState<TimerState>(defaultTimer);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TimerState;
        // Recalculate elapsed time if timer was running
        if (parsed.isRunning && parsed.startTime) {
          const start = new Date(parsed.startTime).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - start) / 1000);
          setTimer({ ...parsed, elapsedSeconds: elapsed });
        } else {
          setTimer(parsed);
        }
      } catch {
        // Invalid stored state, use default
      }
    }
    setIsInitialized(true);
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
    }
  }, [timer, isInitialized]);

  // Update elapsed time every second when running
  useEffect(() => {
    if (!timer.isRunning || !timer.startTime) return;

    const interval = setInterval(() => {
      const start = new Date(timer.startTime!).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setTimer((prev) => ({ ...prev, elapsedSeconds: elapsed }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  const startTimer = useCallback((projectName: string, clientName?: string) => {
    setTimer({
      isRunning: true,
      projectName,
      clientName: clientName || '',
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
    });
  }, []);

  const stopTimer = useCallback(async (): Promise<TimerState | null> => {
    if (!timer.isRunning || !timer.startTime) return null;

    const stoppedTimer = { ...timer };
    setTimer(defaultTimer);
    localStorage.removeItem(STORAGE_KEY);

    return stoppedTimer;
  }, [timer]);

  const resetTimer = useCallback(() => {
    setTimer(defaultTimer);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProject = useCallback((projectName: string, clientName?: string) => {
    setTimer((prev) => ({
      ...prev,
      projectName,
      clientName: clientName || prev.clientName,
    }));
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timer,
        startTimer,
        stopTimer,
        resetTimer,
        updateProject,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
