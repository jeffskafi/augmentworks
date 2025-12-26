"use client";

import { Clock, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { cn, formatRelativeDate } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { updateTaskStatus } from "~/actions/get-tasks";
import type { Task, TaskStatus } from "~/types/database";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "done";

  const handleStatusChange = (newStatus: TaskStatus) => {
    startTransition(async () => {
      await updateTaskStatus(task.id, newStatus);
    });
  };

  const statusConfig = {
    todo: {
      icon: Circle,
      label: "To Do",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    in_progress: {
      icon: Clock,
      label: "In Progress",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    done: {
      icon: CheckCircle2,
      label: "Done",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  };

  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md",
        task.status === "done" && "opacity-70",
        isPending && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => {
            const nextStatus: TaskStatus =
              task.status === "todo"
                ? "in_progress"
                : task.status === "in_progress"
                  ? "done"
                  : "todo";
            handleStatusChange(nextStatus);
          }}
          disabled={isPending}
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all",
            config.bgColor,
            config.color,
            "hover:scale-110"
          )}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium",
              task.status === "done" && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
            {task.due_date && (
              <span
                className={cn(
                  "text-xs",
                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                )}
              >
                {isOverdue && "⚠️ "}
                Due {formatRelativeDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions on hover */}
      <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {task.status !== "done" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("done")}
            disabled={isPending}
            className="h-7 text-xs"
          >
            Mark Complete
          </Button>
        )}
        {task.status === "done" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange("todo")}
            disabled={isPending}
            className="h-7 text-xs"
          >
            Reopen
          </Button>
        )}
      </div>
    </div>
  );
}

