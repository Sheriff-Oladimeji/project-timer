"use client";

import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ActivityGrid() {
  const { activities, projects } = useStore();
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Generate days for the past year, starting from today going backwards
  const days = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push(date);
    }

    return result;
  }, []);

  const data = useMemo(() => {
    return days.map((date) => {
      const dateString = date.toISOString().split("T")[0];
      const dailyActivities = activities.filter(
        (activity) => activity.date.split("T")[0] === dateString
      );

      // Group by project for detailed tooltip
      const projectTimes = dailyActivities.reduce((acc, activity) => {
        if (!acc[activity.projectId]) {
          acc[activity.projectId] = 0;
        }
        acc[activity.projectId] += activity.time;
        return acc;
      }, {} as Record<string, number>);

      const totalTime = dailyActivities.reduce(
        (acc, activity) => acc + activity.time,
        0
      );

      return {
        date: dateString,
        totalTime,
        projectTimes,
        dayOfWeek: date.getDay(),
        formattedDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        }),
      };
    });
  }, [activities, days]);

  // Calculate intensity levels based on activity distribution
  const maxTime = useMemo(() => {
    return Math.max(...data.map((d) => d.totalTime), 1);
  }, [data]);

  const getIntensity = (time: number) => {
    if (time === 0) return 0;
    const ratio = time / maxTime;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  const getColor = (intensity: number) => {
    const colors = [
      "bg-muted border-border", // 0 - no activity
      "bg-green-200 dark:bg-green-900/30", // 1 - low
      "bg-green-400 dark:bg-green-700/50", // 2 - medium-low
      "bg-green-600 dark:bg-green-500/70", // 3 - medium-high
      "bg-green-800 dark:bg-green-400/90", // 4 - high
    ];
    return colors[intensity];
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "No activity";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Group days by weeks for proper grid layout
  const weeks = useMemo(() => {
    type DayData = (typeof data)[0] | null;
    const result: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Add empty cells for the first week if needed
    const firstDay = days[0];
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    data.forEach((day) => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add the last partial week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
    }

    return result;
  }, [data, days]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; position: number }> = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((day) => day !== null);
      if (firstDayOfWeek) {
        const date = new Date(firstDayOfWeek.date);
        const month = date.getMonth();

        // Only show month label if it's different from previous and at start of month
        if (month !== currentMonth) {
          labels.push({
            month: date.toLocaleDateString("en-US", { month: "short" }),
            position: weekIndex,
          });
          currentMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <TooltipProvider>
      <div className="w-full overflow-x-auto">
        <div className="min-w-fit flex flex-col items-start space-y-2 p-2">
          {/* Month labels */}
          <div className="flex text-xs text-muted-foreground ml-6 min-w-fit relative">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="absolute text-left"
                style={{
                  left: `${label.position * 13}px`,
                }}
              >
                {label.month}
              </div>
            ))}
            <div style={{ height: "16px", width: `${weeks.length * 13}px` }} />
          </div>

          <div className="flex min-w-fit">
            {/* Day labels */}
            <div className="flex flex-col text-xs text-muted-foreground mr-2 justify-between h-[84px] flex-shrink-0">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Activity grid */}
            <div className="flex gap-1 min-w-fit">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-1 flex-shrink-0"
                >
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="h-3 w-3" />;
                    }

                    const intensity = getIntensity(day.totalTime);

                    return (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-3 w-3 rounded-sm border transition-all hover:scale-110 cursor-pointer",
                              getColor(intensity),
                              hoveredDay === day.date && "ring-2 ring-primary"
                            )}
                            onMouseEnter={() => setHoveredDay(day.date)}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{day.formattedDate}</p>
                            <p className="text-sm">
                              {formatTime(day.totalTime)}
                            </p>
                            {Object.keys(day.projectTimes).length > 0 && (
                              <div className="text-xs space-y-1 pt-1 border-t">
                                {Object.entries(day.projectTimes).map(
                                  ([projectId, time]) => {
                                    const project = projects.find(
                                      (p) => p.id === projectId
                                    );
                                    return (
                                      <div
                                        key={projectId}
                                        className="flex items-center gap-2"
                                      >
                                        <span
                                          className="w-2 h-2 rounded-full"
                                          style={{
                                            backgroundColor: project?.color,
                                          }}
                                        />
                                        <span>
                                          {project?.name || "Unknown"}:{" "}
                                          {formatTime(
                                            typeof time === "number" ? time : 0
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground mt-2 ml-6">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div
                key={intensity}
                className={cn("h-3 w-3 rounded-sm border", getColor(intensity))}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
