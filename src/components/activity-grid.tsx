"use client";

import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ActivityGrid() {
  const { activities } = useStore();

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
    if (time < 3600) return "bg-green-200";
    if (time < 7200) return "bg-green-400";
    if (time < 10800) return "bg-green-600";
    return "bg-green-800";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {data.map((day, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={cn("h-4 w-4 rounded-sm", getColor(day.totalTime))}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {day.date}: {formatTime(day.totalTime)}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="h-4 w-4 rounded-sm bg-muted" />
          <div className="h-4 w-4 rounded-sm bg-green-200" />
          <div className="h-4 w-4 rounded-sm bg-green-400" />
          <div className="h-4 w-4 rounded-sm bg-green-600" />
          <div className="h-4 w-4 rounded-sm bg-green-800" />
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
