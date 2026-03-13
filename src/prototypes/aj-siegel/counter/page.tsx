"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

type Mode = "stopwatch" | "timer";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((Math.abs(ms) % 1000) / 10);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}

export default function Counter() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60000); // 1 minute default
  const [timerInput, setTimerInput] = useState({ minutes: 1, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (mode === "stopwatch") {
        setTime(elapsedRef.current + elapsed);
      } else {
        const remaining = elapsedRef.current - elapsed;
        if (remaining <= 0) {
          setTime(0);
          setIsRunning(false);
          clearTimer();
        } else {
          setTime(remaining);
        }
      }
    }, 10);
  }, [mode, clearTimer]);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, startTimer, clearTimer]);

  const handleStart = () => {
    if (mode === "timer" && time === 0) {
      const duration = timerInput.minutes * 60000 + timerInput.seconds * 1000;
      setTimerDuration(duration);
      setTime(duration);
      elapsedRef.current = duration;
    } else {
      elapsedRef.current = time;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    elapsedRef.current = time;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearTimer();
    if (mode === "stopwatch") {
      setTime(0);
      elapsedRef.current = 0;
    } else {
      setTime(timerDuration);
      elapsedRef.current = timerDuration;
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false);
    clearTimer();
    setMode(newMode);
    if (newMode === "stopwatch") {
      setTime(0);
      elapsedRef.current = 0;
    } else {
      const duration = timerInput.minutes * 60000 + timerInput.seconds * 1000;
      setTimerDuration(duration);
      setTime(duration);
      elapsedRef.current = duration;
    }
  };

  const handleTimerInputChange = (
    field: "minutes" | "seconds",
    value: string
  ) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const clampedValue = field === "seconds" ? Math.min(59, numValue) : Math.min(99, numValue);
    setTimerInput((prev) => ({ ...prev, [field]: clampedValue }));
    if (!isRunning) {
      const newMinutes = field === "minutes" ? clampedValue : timerInput.minutes;
      const newSeconds = field === "seconds" ? clampedValue : timerInput.seconds;
      const duration = newMinutes * 60000 + newSeconds * 1000;
      setTimerDuration(duration);
      setTime(duration);
      elapsedRef.current = duration;
    }
  };

  const isTimerComplete = mode === "timer" && time === 0 && !isRunning && timerDuration > 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-8">
      <div className="card bg-bg shadow-card max-w-md w-full border border-border rounded-xl">
        <div className="card-body p-8">
          {/* Mode Toggle */}
          <div className="tabs tabs-boxed bg-bg-tertiary p-1 mb-8">
            <button
              className={cn(
                "tab flex-1 transition-all",
                mode === "stopwatch" && "tab-active bg-bg shadow-sm"
              )}
              onClick={() => handleModeChange("stopwatch")}
            >
              Stopwatch
            </button>
            <button
              className={cn(
                "tab flex-1 transition-all",
                mode === "timer" && "tab-active bg-bg shadow-sm"
              )}
              onClick={() => handleModeChange("timer")}
            >
              Timer
            </button>
          </div>

          {/* Timer Input (only shown when timer mode and not running) */}
          {mode === "timer" && !isRunning && time === timerDuration && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={timerInput.minutes}
                  onChange={(e) => handleTimerInputChange("minutes", e.target.value)}
                  className="input input-bordered w-20 text-center text-2xl font-mono"
                />
                <span className="text-xs text-text-tertiary mt-1">min</span>
              </div>
              <span className="text-2xl font-bold text-text-secondary">:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerInput.seconds}
                  onChange={(e) => handleTimerInputChange("seconds", e.target.value)}
                  className="input input-bordered w-20 text-center text-2xl font-mono"
                />
                <span className="text-xs text-text-tertiary mt-1">sec</span>
              </div>
            </div>
          )}

          {/* Time Display */}
          <div
            className={cn(
              "text-center mb-8",
              mode === "timer" && !isRunning && time === timerDuration && "hidden"
            )}
          >
            <span
              className={cn(
                "text-6xl font-mono font-bold tabular-nums text-green-500"
              )}
            >
              {formatTime(time)}
            </span>
            {isTimerComplete && (
              <p className="text-green-500 mt-2 font-medium">Time&apos;s up!</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <button
                className="btn btn-soft bg-blue-100 hover:bg-blue-200 text-blue-700 border-0 btn-lg px-8 gap-2"
                onClick={handleStart}
                disabled={mode === "timer" && timerDuration === 0}
              >
                <Icon name="clock" size={18} />
                {time === 0 || (mode === "timer" && time === timerDuration)
                  ? "Start"
                  : "Resume"}
              </button>
            ) : (
              <button
                className="btn btn-soft bg-amber-100 hover:bg-amber-200 text-amber-700 border-0 btn-lg px-8 gap-2"
                onClick={handlePause}
              >
                <Icon name="clock" size={18} />
                Pause
              </button>
            )}
            <button
              className="btn btn-soft bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 btn-lg gap-2"
              onClick={handleReset}
              disabled={time === 0 && mode === "stopwatch"}
            >
              <Icon name="x" size={18} />
              Reset
            </button>
          </div>

          {/* Quick Timer Presets */}
          {mode === "timer" && !isRunning && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-text-tertiary text-center mb-3">
                Quick presets
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[30, 60, 120, 300, 600].map((secs) => (
                  <button
                    key={secs}
                    className="btn btn-sm btn-soft bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 gap-1"
                    onClick={() => {
                      const mins = Math.floor(secs / 60);
                      const s = secs % 60;
                      setTimerInput({ minutes: mins, seconds: s });
                      const duration = secs * 1000;
                      setTimerDuration(duration);
                      setTime(duration);
                      elapsedRef.current = duration;
                    }}
                  >
                    <Icon name="clock" size={12} />
                    {secs < 60
                      ? `${secs}s`
                      : secs < 3600
                      ? `${secs / 60}m`
                      : `${secs / 3600}h`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
