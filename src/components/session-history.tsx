"use client";

import { useStore } from "@/store/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionHistory() {
  const { activities, projects } = useStore();

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <p className="text-muted-foreground">No sessions recorded yet.</p>
          )}
          {activities
            .slice()
            .reverse()
            .map((activity) => (
              <div key={activity.date} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{getProjectName(activity.projectId)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
                <p className="font-mono">{formatTime(activity.time)}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
