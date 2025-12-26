"use client";

import { useState } from "react";
import { Circle, Clock, CheckCircle2, ListTodo, Loader2 } from "lucide-react";

import { Header } from "~/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn, formatRelativeDate } from "~/lib/utils";
import { mockProject, mockTasks } from "~/lib/mock-data";
import type { Task, TaskStatus } from "~/types/database";

function TaskCard({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "done";

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onStatusChange(task.id, newStatus);
    setIsPending(false);
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
                  isOverdue
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                )}
              >
                {isOverdue && "⚠️ "}
                Due {formatRelativeDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>

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

function TaskColumn({
  title,
  icon: Icon,
  tasks,
  iconColor,
  onStatusChange,
}: {
  title: string;
  icon: typeof Circle;
  tasks: Task[];
  iconColor: string;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Icon className={`size-5 ${iconColor}`} />
            {title}
          </div>
          <Badge variant="secondary" className="font-normal">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} tasks
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function DemoProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const project = mockProject;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completed_at:
                newStatus === "done" ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const stats = {
    total: tasks.length,
    completed: grouped.done.length,
    inProgress: grouped.in_progress.length,
    todo: grouped.todo.length,
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Project Tasks"
        description={`Manage tasks for ${project.name}`}
      />

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <ListTodo className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Circle className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todo}</p>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="board" className="space-y-6">
          <TabsList>
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          {/* Board View (Kanban-style) */}
          <TabsContent value="board">
            <div className="grid gap-6 lg:grid-cols-3">
              <TaskColumn
                title="To Do"
                icon={Circle}
                tasks={grouped.todo}
                iconColor="text-muted-foreground"
                onStatusChange={handleStatusChange}
              />
              <TaskColumn
                title="In Progress"
                icon={Clock}
                tasks={grouped.in_progress}
                iconColor="text-primary"
                onStatusChange={handleStatusChange}
              />
              <TaskColumn
                title="Done"
                icon={CheckCircle2}
                tasks={grouped.done}
                iconColor="text-success"
                onStatusChange={handleStatusChange}
              />
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

