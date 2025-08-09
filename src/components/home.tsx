"use client";

import { EnhancedTimer } from "./enhanced-timer";
import { ActivityGrid } from "./activity-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionHistory } from "./session-history";
import { ThemeToggle } from "./theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { PlusCircle } from "lucide-react";

export function Home() {
  const { createProject } = useStore();
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName("");
      setIsCreateProjectOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateProject();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-xl font-bold">Project Timer</h1>
        <div className="flex items-center gap-4">
          <Dialog
            open={isCreateProjectOpen}
            onOpenChange={setIsCreateProjectOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Project name"
                  autoFocus
                />
                <Button onClick={handleCreateProject}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8 max-w-7xl mx-auto w-full">
        {/* Timer and Session History Side by Side */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
          {/* Timer Section - Takes 60% width on desktop */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-center">Project Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedTimer />
            </CardContent>
          </Card>

          {/* Session History - Takes 40% width on desktop */}
          <div className="lg:col-span-2">
            <SessionHistory />
          </div>
        </div>

        {/* Activity Grid - Full width section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityGrid />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
