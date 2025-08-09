"use client";

import { useStore } from "@/store/use-store";
import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EnhancedTimer() {
  const {
    projects,
    activeProjectId,
    setActiveProject,
    timerState,
    updateTimerState,
    saveTimerProgress,
    resetTimer,
  } = useStore();

  const [time, setTime] = useState(timerState.duration);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSaveRef = useRef<number>(Date.now());
  const visibilityRef = useRef<boolean>(false);

  const handleTimerComplete = useCallback(() => {
    if (activeProjectId && timerState.startTime) {
      const totalTime =
        timerState.elapsedTime +
        Math.floor((Date.now() - timerState.startTime) / 1000);
      updateTimerState({
        isActive: false,
        isPaused: false,
        elapsedTime: totalTime,
      });
      saveTimerProgress();

      // Play notification sound
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        // Fallback if audio fails
        console.log("Timer completed!");
      });
    }
    resetTimer();
  }, [
    activeProjectId,
    timerState.startTime,
    timerState.elapsedTime,
    updateTimerState,
    saveTimerProgress,
    resetTimer,
  ]);

  // Page Visibility API to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = typeof document !== "undefined" && !document.hidden;
      const wasVisible = visibilityRef.current;
      visibilityRef.current = isVisible;

      if (timerState.isActive && timerState.startTime) {
        if (!isVisible && wasVisible) {
          // Tab became hidden - save current state
          const now = Date.now();
          const elapsedSinceStart = Math.floor(
            (now - timerState.startTime) / 1000
          );
          updateTimerState({
            elapsedTime: timerState.elapsedTime + elapsedSinceStart,
            startTime: now,
          });
        } else if (isVisible && !wasVisible) {
          // Tab became visible - resume from saved state
          updateTimerState({
            startTime: Date.now(),
          });
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [
    timerState.isActive,
    timerState.startTime,
    timerState.elapsedTime,
    updateTimerState,
  ]);

  // Timer logic with performance optimization
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        if (timerState.startTime) {
          const elapsedSinceStart = Math.floor(
            (now - timerState.startTime) / 1000
          );
          const totalElapsed = timerState.elapsedTime + elapsedSinceStart;
          const remaining = Math.max(0, timerState.duration - totalElapsed);

          setTime(remaining);

          // Auto-save every 30 minutes (1800 seconds)
          if (now - lastSaveRef.current >= 30 * 60 * 1000) {
            updateTimerState({
              elapsedTime: totalElapsed,
              startTime: now,
              lastSaveTime: now,
            });
            lastSaveRef.current = now;
          }

          // Timer completed
          if (remaining === 0) {
            handleTimerComplete();
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    timerState.isActive,
    timerState.isPaused,
    timerState.startTime,
    timerState.elapsedTime,
    timerState.duration,
    handleTimerComplete,
    updateTimerState,
  ]);

  // Update document title with timer
  useEffect(() => {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    const baseTitle = "Project Timer";
    if (typeof document !== "undefined") {
      if (timerState.isActive && activeProjectId) {
        const project = projects.find((p) => p.id === activeProjectId);
        const projectName = project?.name || "Unknown Project";
        const status = timerState.isPaused ? " (Paused)" : "";
        document.title = `${formatTime(
          time
        )} - ${projectName}${status} | ${baseTitle}`;
      } else {
        document.title = baseTitle;
      }
    }

    return () => {
      if (typeof document !== "undefined") {
        document.title = baseTitle;
      }
    };
  }, [
    time,
    timerState.isActive,
    timerState.isPaused,
    activeProjectId,
    projects,
  ]);

  const toggleTimer = () => {
    if (!activeProjectId) {
      alert("Please select a project first.");
      return;
    }

    if (!timerState.isActive) {
      // Start timer
      updateTimerState({
        isActive: true,
        isPaused: false,
        currentProjectId: activeProjectId,
        startTime: Date.now(),
      });
    } else if (!timerState.isPaused) {
      // Pause timer
      const now = Date.now();
      if (timerState.startTime) {
        const elapsedSinceStart = Math.floor(
          (now - timerState.startTime) / 1000
        );
        updateTimerState({
          isPaused: true,
          elapsedTime: timerState.elapsedTime + elapsedSinceStart,
        });
        // Auto-save when paused
        saveTimerProgress();
      }
    } else {
      // Resume timer
      updateTimerState({
        isPaused: false,
        startTime: Date.now(),
      });
    }
  };

  const handleResetTimer = () => {
    if (timerState.isActive && timerState.startTime) {
      // Save progress before resetting
      const totalTime =
        timerState.elapsedTime +
        Math.floor((Date.now() - timerState.startTime) / 1000);
      if (totalTime > 0) {
        updateTimerState({ elapsedTime: totalTime });
        saveTimerProgress();
      }
    }
    resetTimer();
    setTime(timerState.duration);
  };

  const handleSetDuration = (minutes: number) => {
    const seconds = minutes * 60;
    updateTimerState({ duration: seconds });
    setTime(seconds);
    resetTimer();
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setCustomMinutes(0);
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setCustomMinutes(numValue);
    }
  };

  const handleCustomTimeSubmit = () => {
    if (customMinutes > 0) {
      handleSetDuration(customMinutes);
      setIsDialogOpen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const selectedProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Project Selector */}
      <div className="w-full max-w-md">
        <Select value={activeProjectId || ""} onValueChange={setActiveProject}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a project">
              {selectedProject && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  {selectedProject.name}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timer Display */}
      <div className="text-8xl font-bold tracking-tighter">
        {formatTime(time)}
      </div>

      {/* Timer Status */}
      {timerState.isActive && (
        <div className="text-sm text-muted-foreground">
          {timerState.isPaused ? "Paused" : "Running"}
          {selectedProject && ` • ${selectedProject.name}`}
        </div>
      )}

      {/* Timer Controls */}
      <div className="flex gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          variant="default"
          className="w-32"
        >
          {timerState.isActive && !timerState.isPaused ? (
            <>
              <Pause className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2" />
              {timerState.isPaused ? "Resume" : "Start"}
            </>
          )}
        </Button>
        <Button onClick={handleResetTimer} size="lg" variant="secondary">
          <RotateCcw />
        </Button>
      </div>

      {/* Duration Presets */}
      <div className="flex items-center gap-2">
        <Button onClick={() => handleSetDuration(15)} variant="outline">
          15m
        </Button>
        <Button onClick={() => handleSetDuration(25)} variant="outline">
          25m
        </Button>
        <Button onClick={() => handleSetDuration(50)} variant="outline">
          50m
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Custom Time</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="custom-time"
                type="number"
                value={customMinutes || ""}
                onChange={handleCustomTimeChange}
                placeholder="Enter minutes"
                className="col-span-3"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCustomTimeSubmit();
                  }
                }}
              />
              <Button onClick={handleCustomTimeSubmit}>Set Timer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
