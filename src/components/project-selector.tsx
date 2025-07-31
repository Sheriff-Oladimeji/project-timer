"use client";

import { useStore } from "@/store/use-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProjectSelector() {
  const { projects, createProject, setActiveProject, editProject, deleteProject } = useStore();
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<null | { id: string; name: string }>(null);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName("");
    }
  };

  const handleEditProject = () => {
    if (editingProject && editingProject.name.trim()) {
      editProject(editingProject.id, editingProject.name.trim());
      setEditingProject(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Projects</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
            >
              <div
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => setActiveProject(project.id)}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                ></span>
                <span>{project.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEditingProject({ id: project.id, name: project.name })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteProject(project.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
      {editingProject && (
        <Dialog open onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              />
              <Button onClick={handleEditProject}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="w-full"
          />
          <Button onClick={handleCreateProject} className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
}
