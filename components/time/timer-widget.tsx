'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Square, Clock, ChevronDown } from 'lucide-react';
import { useTimer } from './timer-context';
import { formatTimerCompact } from '@/lib/time/format-duration';
import { createTimeEntry } from '@/lib/actions/time-entries';
import { showSuccess, showError } from '@/lib/toast';
import { cn } from '@/lib/utils';
import posthog from 'posthog-js';

interface TimerWidgetProps {
  defaultHourlyRate?: number;
  className?: string;
}

export function TimerWidget({ defaultHourlyRate = 0, className }: TimerWidgetProps) {
  const { timer, startTimer, stopTimer, resetTimer } = useTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current && !timer.isRunning) {
      inputRef.current.focus();
    }
  }, [isExpanded, timer.isRunning]);

  const handleStart = () => {
    if (!projectName.trim()) {
      // Focus the input if project name is empty
      inputRef.current?.focus();
      return;
    }

    startTimer(projectName.trim(), clientName.trim());
    setIsExpanded(false);

    try {
      posthog.capture('timer_started', { project: projectName });
    } catch {}
  };

  const handleStop = async () => {
    setIsSaving(true);

    try {
      const stoppedTimer = await stopTimer();
      if (!stoppedTimer || !stoppedTimer.startTime) return;

      // Create time entry in database
      const result = await createTimeEntry({
        project_name: stoppedTimer.projectName,
        client_name: stoppedTimer.clientName || null,
        start_time: stoppedTimer.startTime,
        end_time: new Date().toISOString(),
        hourly_rate: defaultHourlyRate,
        is_billable: true,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      showSuccess('Time entry saved!');
      setProjectName('');
      setClientName('');

      try {
        posthog.capture('timer_stopped', {
          project: stoppedTimer.projectName,
          duration_seconds: stoppedTimer.elapsedSeconds,
        });
      } catch {}
    } catch {
      showError('Failed to save time entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !timer.isRunning) {
      handleStart();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Compact button - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          timer.isRunning
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
        )}
      >
        {timer.isRunning ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            <span className="font-mono">{formatTimerCompact(timer.elapsedSeconds)}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </>
        ) : (
          <>
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timer</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </>
        )}
      </button>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl z-50">
          <div className="p-4">
            {timer.isRunning ? (
              <>
                {/* Running timer view */}
                <div className="text-center mb-4">
                  <p className="text-xs text-zinc-500 mb-1">Currently tracking</p>
                  <p className="text-lg font-semibold text-white truncate">
                    {timer.projectName}
                  </p>
                  {timer.clientName && (
                    <p className="text-sm text-zinc-400">{timer.clientName}</p>
                  )}
                  <p className="text-3xl font-mono text-teal-400 mt-3">
                    {formatTimerCompact(timer.elapsedSeconds)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStop}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    <Square className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Stop'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    resetTimer();
                    setIsExpanded(false);
                  }}
                  className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-400"
                >
                  Discard without saving
                </button>
              </>
            ) : (
              <>
                {/* Start timer view */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">
                      Project / Task
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="What are you working on?"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">
                      Client (optional)
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Client name"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    onClick={handleStart}
                    disabled={!projectName.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4" />
                    Start Timer
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <Link
                    href="/dashboard/time"
                    onClick={() => setIsExpanded(false)}
                    className="block text-center text-sm text-teal-400 hover:text-teal-300"
                  >
                    View all time entries
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
