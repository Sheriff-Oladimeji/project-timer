"use client";

import { Timer } from "./timer";
import { ProjectSelector } from "./project-selector";
import { ActivityGrid } from "./activity-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-8 px-10">
        <h1 className="text-3xl font-bold">My Activity</h1>
        <p className="text-muted-foreground">
          Track progress and see your activity
        </p>
      </header>
      <main className="grid grid-cols-1 gap-8 px-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <Timer />
            </CardContent>
          </Card>
          <div className="mt-4">
            <ProjectSelector />
          </div>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityGrid />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
