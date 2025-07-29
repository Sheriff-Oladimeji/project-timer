"use client";

import { useStore } from "@/store/use-store";
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Timer() {
  const { addActivity } = useStore();
  const [time, setTime] = useState(60 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      addActivity({ projectId: "1", time: duration });
      const audio = new Audio("/notification.mp3");
      audio.play();
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time, addActivity, duration]);

  const toggleTimer = () => {
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

  return (
    <div className="flex flex-col items-center">
      <div className="text-7xl font-bold">{formatTime(time)}</div>
      <div className="mt-4 flex gap-4">
        <Button onClick={toggleTimer} size="icon" variant="default">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </Button>
        <Button onClick={resetTimer} size="icon" variant="secondary">
          <RotateCcw size={24} />
        </Button>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={() => handleSetDuration(30)} variant="secondary">
          30m
        </Button>
        <Button onClick={() => handleSetDuration(60)} variant="default">
          1h
        </Button>
        <Button onClick={() => handleSetDuration(120)} variant="secondary">
          2h
        </Button>
      </div>
    </div>
  );
}
