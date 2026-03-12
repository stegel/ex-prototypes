# Prototype: Counter

## Overview

A dual-mode stopwatch and timer application. Users can count up (stopwatch mode) or count down from a set time (timer mode).

## UI Approach

This project uses **Tailwind CSS v4** and **DaisyUI 5** for styling and components.

- Uses DaisyUI `tabs` for mode switching between stopwatch and timer
- Uses DaisyUI `btn` with various modifiers for controls
- Uses DaisyUI `input` for timer duration input
- Custom monospace display for the time readout

## Component Decisions

- **Navigation:** Tabs for switching between Stopwatch and Timer modes
- **Layout:** Card container with centered content
- **Forms:** Number inputs for setting timer duration
- **Feedback:** Color change and message when timer completes

## Notes

- Time display shows centiseconds for precision
- Timer has quick preset buttons for common durations (30s, 1m, 2m, 5m, 10m)
- Uses refs to track elapsed time for accurate timing even when tab is backgrounded
