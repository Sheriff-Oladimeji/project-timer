"use client";

import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function ActivityGrid() {
  const { activities } = useStore();

  const totalTime = useMemo(
    () => activities.reduce((acc, activity) => acc + activity.time, 0),
    [activities]
  );

  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const days = Array.from({ length: 365 }).map((_, i) => {
    const date = new Date(oneYearAgo);
    date.setDate(oneYearAgo.getDate() + i);
    return date;
  });

  const data = useMemo(() => {
    return days.map((date) => {
      const dateString = date.toISOString().split("T")[0];
      const dailyActivities = activities.filter(
        (activity) => activity.date.split("T")[0] === dateString
      );
      const totalTime = dailyActivities.reduce(
        (acc, activity) => acc + activity.time,
        0
      );
      return {
        date: dateString,
        totalTime,
      };
    });
  }, [activities, days]);

  const getColor = (time: number) => {
    if (time === 0) return "bg-muted";
    if (time < 3600) return "bg-primary/20";
    if (time < 7200) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Total: {totalHours}h {totalMinutes}m
        </span>
      </div>
      <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1">
        {data.map((day, i) => (
          <div
            key={i}
            className={cn("h-4 w-4 rounded-sm", getColor(day.totalTime))}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 text-sm text-muted-foreground">
        <span>Less</span>
        <div className="h-4 w-4 rounded-sm bg-muted" />
        <div className="h-4 w-4 rounded-sm bg-primary/20" />
        <div className="h-4 w-4 rounded-sm bg-primary/60" />
        <div className="h-4 w-4 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
