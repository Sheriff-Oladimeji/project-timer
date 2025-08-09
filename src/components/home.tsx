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

      <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-8 max-w-6xl mx-auto w-full">
        {/* Timer Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Project Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTimer />
          </CardContent>
        </Card>

        {/* Session History and Activity Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <SessionHistory />
          </div>
          <Card className="order-1 md:order-2">
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
