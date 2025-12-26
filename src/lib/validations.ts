import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Task schemas
export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
});

// Project schemas
export const updateOnboardingSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  step: z.number().int().min(0).max(5),
});

// Types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateOnboardingInput = z.infer<typeof updateOnboardingSchema>;

