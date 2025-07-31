# Project Time Tracker - Product Requirements Document

## 1. Product Overview

### 1.1 Product Vision
An offline-first, local-only time tracking application that enables users to track time spent on multiple projects with visual activity representation and customizable timer functionality.

### 1.2 Product Goals
- Enable efficient time tracking across multiple projects
- Provide visual feedback through GitHub-style activity grids
- Offer flexible timing options (pre-defined and custom durations)
- Maintain complete offline functionality with browser-based data persistence
- Deliver a clean, intuitive user experience inspired by modern design patterns

### 1.3 Target Audience
- **Primary**: Freelancers, consultants, and independent workers managing multiple projects
- **Secondary**: Students tracking study sessions, developers tracking coding sessions
- **Tertiary**: Anyone seeking simple, visual time tracking without cloud dependencies

### 1.4 MVP Scope
Phase 1 focuses on core time tracking functionality with local data storage. No user authentication, cloud sync, or advanced reporting features.

## 2. Feature Overview

### 2.1 Core Features
- **Project Management**: Create, edit, and delete projects with custom names and colors
- **Timer Functionality**: Start, pause, stop, and reset timers for active projects
- **Duration Presets**: Quick-start timers with common durations (15min, 30min, 1hr, 2hr)
- **Custom Timers**: Set specific durations or use open-ended timing
- **Activity Visualization**: GitHub-style calendar grid showing daily time tracking activity
- **Audio Notifications**: Sound alerts when timers complete
- **Session History**: View past tracking sessions with timestamps and durations
- **Data Persistence**: All data stored locally in browser localStorage

### 2.2 Secondary Features
- **Dark/Light Theme**: Toggle between appearance modes
- **Timer Notifications**: Browser notifications when timer completes (if permissions granted)
- **Session Notes**: Optional text notes for tracking sessions
- **Export Data**: Download tracking data as JSON/CSV for backup
- **Statistics**: Basic time tracking statistics (daily, weekly, monthly totals)

## 3. Functional Requirements

### 3.1 Project Management

#### 3.1.1 Create Project
- **Input**: Project name (required, max 50 chars), project color (optional, default provided)
- **Validation**: Name must be unique, non-empty
- **Output**: New project added to project list
- **Storage**: Project saved to localStorage with generated UUID

#### 3.1.2 Edit Project
- **Input**: Updated project name and/or color
- **Validation**: Name uniqueness, character limits
- **Output**: Project details updated in UI
- **Storage**: localStorage updated with changes

#### 3.1.3 Delete Project
- **Input**: Project selection for deletion
- **Validation**: Confirmation dialog required
- **Output**: Project removed from UI
- **Storage**: Project and associated sessions removed from localStorage

### 3.2 Timer Functionality

#### 3.2.1 Start Timer
- **Input**: Project selection, duration (preset or custom)
- **Process**: Timer begins countdown/countup, UI shows active state
- **Output**: Running timer display with project name and remaining time
- **Storage**: Active session stored with start timestamp

#### 3.2.2 Pause/Resume Timer
- **Input**: Pause/resume action on active timer
- **Process**: Timer state changes, accumulated time preserved
- **Output**: UI reflects paused/active state
- **Storage**: Session updated with pause timestamps

#### 3.2.3 Stop Timer
- **Input**: Stop action on active timer
- **Process**: Timer stops, session saved to history
- **Output**: Completed session added to history, timer reset
- **Storage**: Final session data saved to localStorage

#### 3.2.4 Timer Completion
- **Process**: When preset timer reaches zero
- **Output**: Audio notification plays, visual alert shown
- **Storage**: Session marked as completed

### 3.3 Activity Grid Visualization

#### 3.3.1 Calendar Grid Display
- **Input**: Historical session data from localStorage
- **Process**: Aggregate daily time totals, map to grid intensity
- **Output**: GitHub-style grid with color intensity based on time tracked
- **Interaction**: Hover shows daily total, click shows daily sessions

#### 3.3.2 Grid Time Periods
- **Default View**: Last 365 days
- **Alternative Views**: Last 30 days, last 90 days
- **Navigation**: Scroll/navigate to different time periods

### 3.4 Session History

#### 3.4.1 Session List
- **Display**: Chronological list of completed sessions
- **Information**: Project name, duration, start/end times, notes
- **Interaction**: Edit notes, delete sessions
- **Filtering**: Filter by project, date range

#### 3.4.2 Session Management
- **Edit**: Modify session notes, adjust duration
- **Delete**: Remove session with confirmation
- **Export**: Download session data

## 4. User Flow

### 4.1 First-Time User Flow
1. **Landing**: Welcome screen with empty project list
2. **Project Creation**: User creates first project via "Add Project" button
3. **Timer Setup**: Select project, choose duration preset or set custom time
4. **Time Tracking**: Start timer, see countdown/progress
5. **Session Completion**: Timer ends, audio plays, session saved
6. **Activity Review**: View completed session in history and activity grid

### 4.2 Returning User Flow
1. **Dashboard**: View existing projects and recent activity
2. **Quick Start**: Select project and start timer with last-used duration
3. **Activity Review**: Check activity grid for tracking patterns
4. **Project Management**: Create new projects or edit existing ones

### 4.3 Typical Session Flow
```
Project Selection → Duration Setting → Timer Start → [Work Period] → Timer End → Session Save
                                           ↓
                                    Pause/Resume (optional)
```

## 5. Data Storage Plan

### 5.1 Data Models

#### 5.1.1 Project Model
```typescript
interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

#### 5.1.2 Session Model
```typescript
interface Session {
  id: string;
  projectId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}
```

#### 5.1.3 Timer State Model
```typescript
interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  currentProjectId?: string;
  sessionId?: string;
  startTime?: string;
  duration?: number;
  elapsedTime: number;
}
```

#### 5.1.4 App Settings Model
```typescript
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  defaultDuration: number;
  gridView: '30' | '90' | '365';
}
```

### 5.2 localStorage Keys
- `timetracker_projects`: Array of Project objects
- `timetracker_sessions`: Array of Session objects
- `timetracker_settings`: AppSettings object
- `timetracker_active_timer`: Current timer state

### 5.3 Data Synchronization
- **Auto-save**: Timer state saved every 5 seconds during active sessions
- **Session Storage**: Completed sessions immediately saved to localStorage
- **Settings Sync**: Settings changes immediately persisted
- **Data Validation**: Validate localStorage data on app initialization

## 6. MVP Limitations

### 6.1 Phase 1 Exclusions
- **No Cloud Sync**: All data remains local to browser
- **No User Authentication**: Single-user experience
- **No Team Features**: No collaboration or sharing capabilities
- **No Advanced Reporting**: Basic statistics only
- **No Mobile App**: Web-only experience
- **No Backup/Restore**: Manual export only

### 6.2 Browser Dependencies
- **localStorage Support**: Required for data persistence
- **Modern Browser**: ES6+ support needed
- **Audio API**: Required for timer completion sounds
- **Notification API**: Optional for browser notifications

## 7. Sound & Notification Handling

### 7.1 Audio Notifications
- **Timer Completion**: Play completion sound when preset timer reaches zero
- **Sound Options**: Multiple sound choices (chime, bell, beep)
- **Volume Control**: Adjustable volume settings
- **Disable Option**: Complete sound disable toggle

### 7.2 Browser Notifications
- **Permission Request**: Ask for notification permissions on first timer
- **Timer Complete**: Show browser notification with project name and duration
- **Notification Actions**: Quick actions to start new timer or view session

### 7.3 Visual Notifications
- **Screen Flash**: Brief color change when timer completes
- **Modal Alert**: Completion dialog with session summary
- **Badge Updates**: Browser tab title updates with timer status

## 8. Offline Behavior

### 8.1 Complete Offline Functionality
- **No Network Required**: App functions entirely without internet connection
- **Local Asset Storage**: All assets (sounds, icons) bundled with app
- **Data Persistence**: localStorage ensures data survives browser restarts
- **Progressive Web App**: Service worker for offline access

### 8.2 Data Backup Strategy
- **Export Feature**: Users can download their data as JSON
- **Import Feature**: Users can restore data from exported files
- **Browser Storage Limits**: Warn users approaching localStorage limits
- **Data Cleanup**: Automatic old session cleanup options

## 9. User Interface Requirements

### 9.1 Layout Structure
- **Header**: App title, theme toggle, settings access
- **Main Content**: Timer interface, project selector
- **Activity Grid**: GitHub-style calendar visualization
- **Sidebar/Panel**: Project list, session history
- **Footer**: Statistics summary, export options

### 9.2 Responsive Design
- **Desktop Primary**: Optimized for desktop/laptop use
- **Tablet Support**: Functional on tablet devices
- **Mobile Consideration**: Basic mobile compatibility

### 9.3 Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Compatible with high contrast modes
- **Focus Management**: Clear focus indicators

## 10. Success Metrics

### 10.1 User Engagement
- **Session Frequency**: Number of tracking sessions per user per day
- **Project Diversity**: Average number of projects per user
- **Session Duration**: Average and total time tracked
- **Return Usage**: User retention over time (via localStorage data age)

### 10.2 Feature Adoption
- **Timer Types**: Usage split between preset and custom durations
- **Grid Interaction**: Activity grid view frequency
- **Export Usage**: Data export feature adoption
- **Theme Preferences**: Dark vs light theme usage

## 11. Future Enhancements (Post-MVP)

### 11.1 Phase 2 Features
- **Advanced Reporting**: Detailed analytics and insights
- **Project Categories**: Organize projects into categories
- **Time Goals**: Set daily/weekly time tracking goals
- **Productivity Insights**: Analysis of productive time patterns

### 11.2 Phase 3 Features
- **Cloud Sync**: Optional cloud backup and sync
- **Mobile App**: Native mobile applications
- **Team Features**: Shared projects and time tracking
- **Integrations**: Connect with popular productivity tools

---

*This PRD defines the complete scope and requirements for the MVP version of the Project Time Tracker application.*