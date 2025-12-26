"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "~/utils/supabase/server";
import type { Task, TaskStatus } from "~/types/database";

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return (data as Task[] | null) ?? [];
}

export async function getTasksByStatus(
  projectId: string,
  status: TaskStatus
): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching tasks by status:", error);
    return [];
  }

  return (data as Task[] | null) ?? [];
}

export async function getRecentTasks(
  projectId: string,
  limit = 5
): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .neq("status", "done")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent tasks:", error);
    return [];
  }

  return (data as Task[] | null) ?? [];
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task status:", error);
    return null;
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return data as Task;
}
