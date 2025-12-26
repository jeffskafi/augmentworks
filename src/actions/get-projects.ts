"use server";

import { createClient } from "~/utils/supabase/server";
import type { Project, User } from "~/types/database";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data as User;
}

export async function getUserProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data as Project[] | null) ?? [];
}

export async function getActiveProject(): Promise<Project | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get the most recently updated non-completed project
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .neq("status", "completed")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no active project, get the most recent completed one
    const { data: completedProject } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    return (completedProject as Project | null) ?? null;
  }

  return data as Project;
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data as Project;
}
