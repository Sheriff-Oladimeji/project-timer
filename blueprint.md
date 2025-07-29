
# Blueprint: Offline-First Time Tracker

## 1. Overview

This document outlines the plan for building an offline-first, local-only project and time-tracking application. The application will allow users to manage projects, track time using preset and custom timers, and view their activity history on a GitHub-style contribution grid. All data will be stored in the browser's `localStorage` to ensure full functionality without an internet connection.

## 2. Style, Design, and Features

### Implemented

*   **Initial Setup**: Basic Next.js project structure.

### Current Plan

*   **Theming and Layout**:
    *   A single, clean, dark theme inspired by modern productivity tools.
    *   A responsive layout that works on different screen sizes.
    *   Use of a sans-serif font for readability.
    *   A clear and intuitive navigation structure.

*   **Component Breakdown**:
    *   `Timer`: The main component for displaying and controlling the timer.
    *   `ProjectSelector`: A dropdown for creating and selecting projects.
    *   `ActivityGrid`: A GitHub-style grid to visualize tracked time.
    *   `Presets`: Buttons for predefined timer durations.

*   **State Management**:
    *   Use Zustand for managing the application state.
    *   The store will handle:
        *   The list of projects.
        *   The currently selected project.
        *   The timer's state (running, stopped, duration).
        *   Activity logs for the contribution grid.

*   **Data Persistence**:
    *   All data will be saved to `localStorage` to ensure it persists between sessions.
    *   The application will read from `localStorage` on startup to restore the previous state.

## 3. Development Plan

1.  **Setup Project Structure**: Create directories for `components`, `lib`, and `store`.
2.  **Install Dependencies**: Install `zustand`, `lucide-react`, and other required packages.
3.  **Clean Boilerplate**: Remove default styles and content from `src/app/page.tsx` and `src/app/globals.css`.
4.  **Implement Base Layout and Styles**: Create the main layout and global styles.
5.  **Develop Components**:
    *   Build the `Timer` component with controls.
    *   Build the `ProjectSelector` component for project management.
    *   Build the `ActivityGrid` component for data visualization.
6.  **Set Up Zustand Store**: Create the store and actions for state management.
7.  **Integrate Components and State**: Connect the components to the Zustand store.
8.  **Implement `localStorage` Persistence**: Add logic to save and load data from `localStorage`.
9.  **Add Sound Notifications**: Implement audio alerts for timer completion.
10. **Final Touches and Testing**: Ensure all features work as expected and the UI is polished.
