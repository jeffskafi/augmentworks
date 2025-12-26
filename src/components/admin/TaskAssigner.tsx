"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Plus, Loader2, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { createTask, type CreateTaskState } from "~/actions/admin";
import type { Task } from "~/types/database";
import { cn } from "~/lib/utils";

interface TaskAssignerProps {
  projectId: string;
  tasks: Task[];
}

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

const statusColors = {
  todo: "text-slate-400",
  in_progress: "text-amber-400",
  done: "text-emerald-400",
};

export function TaskAssigner({ projectId, tasks }: TaskAssignerProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<CreateTaskState, FormData>(
    createTask,
    {}
  );

  return (
    <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-violet-100">Tasks</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1 bg-violet-600 text-white hover:bg-violet-700"
            >
              <Plus className="size-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="border-violet-900/50 bg-slate-900 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-violet-100">
                Create New Task
              </DialogTitle>
              <DialogDescription className="text-violet-400/70">
                Add a new task to the client&apos;s project board.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4 mt-4">
              <input type="hidden" name="projectId" value={projectId} />

              <div className="space-y-2">
                <Label htmlFor="title" className="text-violet-200">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Upload API documentation"
                  required
                  className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-violet-200">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed instructions for the client..."
                  className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-violet-200">
                  Due Date (optional)
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="border-violet-900/50 bg-slate-800 text-violet-100"
                />
              </div>

              {state.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}
              {state.success && (
                <p className="text-sm text-emerald-400">{state.success}</p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="text-violet-300 hover:bg-violet-600/10 hover:text-violet-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-sm text-violet-400/60">
          No tasks yet. Create one to assign work to this client.
        </p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {tasks.map((task) => {
            const Icon = statusIcons[task.status];
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg bg-slate-800/30 p-3"
              >
                <Icon
                  className={cn("size-5 mt-0.5 shrink-0", statusColors[task.status])}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      task.status === "done"
                        ? "text-violet-400/60 line-through"
                        : "text-violet-200"
                    )}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-violet-400/50 mt-1 truncate">
                      {task.description}
                    </p>
                  )}
                  {task.due_date && (
                    <p className="text-xs text-violet-400/50 mt-1">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

