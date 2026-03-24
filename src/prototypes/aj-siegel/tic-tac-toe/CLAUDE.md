# Prototype: Tic Tac Toe

## Overview

A classic two-player tic tac toe game where players take turns placing X and O on a 3x3 grid. The game detects wins, draws, and tracks scores across multiple rounds.

## UI Approach

This project uses **Tailwind CSS v4** and **DaisyUI 5** for styling and components.

- Uses DaisyUI `btn` for game controls
- Uses DaisyUI `card` for the main game container
- Custom grid layout for the game board
- Visual indicators for current player, winning line, and game status

## Component Decisions

- **Layout:** Card container with centered content, responsive sizing
- **Board:** 3x3 CSS grid with square buttons
- **Scoreboard:** Side-by-side score display with visual indicator for current player
- **Feedback:** Color-coded winning cells, status messages for win/draw states

## Notes

- X is blue, O is red for easy visual distinction
- Winning line highlights in green
- Score persists across games until explicitly reset
- Game starts with X always going first
