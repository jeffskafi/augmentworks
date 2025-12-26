import { TaskCard } from "./TaskCard";
import type { Task } from "~/types/database";

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

