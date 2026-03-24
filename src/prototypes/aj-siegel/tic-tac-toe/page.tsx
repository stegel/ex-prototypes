"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

function Square({
  value,
  onClick,
  isWinning,
  disabled,
}: {
  value: Cell;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}) {
  return (
    <button
      className={cn(
        "w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl font-bold rounded-lg border-2 transition-all",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        isWinning
          ? "bg-green-100 border-green-500 text-green-700"
          : "bg-bg border-border hover:border-border-hover hover:bg-bg-secondary",
        value === "X" && !isWinning && "text-blue-600",
        value === "O" && !isWinning && "text-red-500",
        disabled && !value && "cursor-not-allowed opacity-50"
      )}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const result = calculateWinner(board);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? [];
  const isDraw = !winner && board.every((cell) => cell !== null);
  const gameOver = !!winner || isDraw;

  function handleClick(index: number) {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newResult = calculateWinner(newBoard);
    if (newResult) {
      setScores((prev) => ({
        ...prev,
        [newResult.winner]: prev[newResult.winner] + 1,
      }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  }

  function resetScores() {
    setScores({ X: 0, O: 0 });
    resetGame();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-4">
      <div className="card bg-bg shadow-card border border-border rounded-xl max-w-md w-full">
        <div className="card-body p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-6">
            Tic Tac Toe
          </h2>

          {/* Scoreboard */}
          <div className="flex justify-center gap-8 mb-6">
            <div
              className={cn(
                "text-center px-4 py-2 rounded-lg transition-colors",
                currentPlayer === "X" && !gameOver
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "bg-bg-secondary"
              )}
            >
              <div className="text-2xl font-bold text-blue-600">X</div>
              <div className="text-lg font-semibold text-text-primary">
                {scores.X}
              </div>
            </div>
            <div
              className={cn(
                "text-center px-4 py-2 rounded-lg transition-colors",
                currentPlayer === "O" && !gameOver
                  ? "bg-red-100 ring-2 ring-red-500"
                  : "bg-bg-secondary"
              )}
            >
              <div className="text-2xl font-bold text-red-500">O</div>
              <div className="text-lg font-semibold text-text-primary">
                {scores.O}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-4 h-8">
            {winner ? (
              <span
                className={cn(
                  "text-lg font-semibold",
                  winner === "X" ? "text-blue-600" : "text-red-500"
                )}
              >
                {winner} wins! 🎉
              </span>
            ) : isDraw ? (
              <span className="text-lg font-semibold text-text-secondary">
                It&apos;s a draw! 🤝
              </span>
            ) : (
              <span className="text-text-secondary">
                <span
                  className={cn(
                    "font-semibold",
                    currentPlayer === "X" ? "text-blue-600" : "text-red-500"
                  )}
                >
                  {currentPlayer}
                </span>
                &apos;s turn
              </span>
            )}
          </div>

          {/* Board */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => (
                <Square
                  key={index}
                  value={cell}
                  onClick={() => handleClick(index)}
                  isWinning={winningLine.includes(index)}
                  disabled={gameOver}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button className="btn btn-primary" onClick={resetGame}>
              New Game
            </button>
            <button className="btn btn-ghost" onClick={resetScores}>
              Reset Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
