"use client";

import { useStore } from "@/store/use-store";
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Timer() {
  const { addActivity, activeProjectId } = useStore();
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  const [customMinutes, setCustomMinutes] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      if (activeProjectId) {
        addActivity({ projectId: activeProjectId, time: duration });
      }
      const audio = new Audio("/notification.mp3");
      audio.play();
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time, addActivity, duration, activeProjectId]);

  const toggleTimer = () => {
    if (!activeProjectId) {
      alert("Please select a project first.");
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSetDuration = (minutes: number) => {
    setDuration(minutes * 60);
    setTime(minutes * 60);
    setIsActive(false);
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-8xl font-bold tracking-tighter">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          variant="default"
          className="w-32"
        >
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} size="lg" variant="secondary">
          <RotateCcw />
        </Button>
      </div>
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
        <Dialog>
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
              />
              <Button onClick={handleCustomTimeSubmit}>Set Timer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
