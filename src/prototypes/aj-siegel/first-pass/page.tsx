"use client";

import { useState } from "react";

export default function FirstPass() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-8">
      <div className="card bg-bg shadow-card max-w-sm w-full">
        <div className="card-body items-center text-center gap-6">
          <h2 className="card-title text-text-primary">Counter</h2>
          <span className="text-7xl font-mono font-bold tabular-nums" style={{ color: '#228B22' }}>
            {count}
          </span>
          <div className="flex gap-4">
            <button
              className="btn btn-ghost btn-lg text-2xl"
              onClick={() => setCount((c) => c - 1)}
            >
              −
            </button>
            <button
              className="btn btn-ghost btn-lg text-2xl"
              onClick={() => setCount((c) => c + 1)}
            >
              +
            </button>
          </div>
          <button
            className="btn btn-sm btn-ghost text-text-tertiary"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
