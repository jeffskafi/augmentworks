import { redirect } from "next/navigation";
import { Circle, Clock, CheckCircle2, ListTodo } from "lucide-react";

import { Header } from "~/components/dashboard/Header";
import { TaskList } from "~/components/projects/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";

import { getCurrentUser, getActiveProject } from "~/actions/get-projects";
import { getProjectTasks } from "~/actions/get-tasks";
import type { Task } from "~/types/database";

function groupTasksByStatus(tasks: Task[]) {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

function TaskColumn({
  title,
  icon: Icon,
  tasks,
  iconColor,
}: {
  title: string;
  icon: typeof Circle;
  tasks: Task[];
  iconColor: string;
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
      <CardContent>
        <TaskList tasks={tasks} emptyMessage={`No ${title.toLowerCase()} tasks`} />
      </CardContent>
    </Card>
  );
}

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const project = await getActiveProject();
  if (!project) redirect("/dashboard");

  const tasks = await getProjectTasks(project.id);
  const grouped = groupTasksByStatus(tasks);

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
              />
              <TaskColumn
                title="In Progress"
                icon={Clock}
                tasks={grouped.in_progress}
                iconColor="text-primary"
              />
              <TaskColumn
                title="Done"
                icon={CheckCircle2}
                tasks={grouped.done}
                iconColor="text-success"
              />
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={tasks}
                  emptyMessage="No tasks yet. Tasks will appear here when created by your project manager."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

