"use server";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { revalidatePath } from "next/cache";
import { createClient } from "~/utils/supabase/server";
import { updateOnboardingSchema } from "~/lib/validations";
import type { ProjectStatus } from "~/types/database";

export type OnboardingState = {
  error?: string;
  success?: boolean;
};

export async function updateOnboardingStep(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();

  const rawData = {
    projectId: formData.get("projectId"),
    step: Number(formData.get("step")),
  };

  const result = updateOnboardingSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.errors[0]?.message ?? "Invalid input" };
  }

  const { projectId, step } = result.data;

  // Determine status based on step completion
  const status: ProjectStatus = step >= 3 ? "audit" : "onboarding";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("projects")
    .update({
      onboarding_step: step,
      status,
    })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating onboarding step:", error);
    return { error: "Failed to update onboarding progress" };
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function completeOnboarding(
  projectId: string
): Promise<OnboardingState> {
  const supabase = await createClient();

  const status: ProjectStatus = "audit";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("projects")
    .update({
      onboarding_step: 3,
      status,
    })
    .eq("id", projectId);

  if (error) {
    console.error("Error completing onboarding:", error);
    return { error: "Failed to complete onboarding" };
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");

  return { success: true };
}
