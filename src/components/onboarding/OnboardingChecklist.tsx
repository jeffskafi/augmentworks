"use client";

import { useActionState } from "react";
import { FileSignature, Key, Calendar, Check, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { updateOnboardingStep } from "~/actions/update-onboarding";
import { ONBOARDING_STEPS } from "~/lib/onboarding-config";

const iconMap = {
  FileSignature,
  Key,
  Calendar,
} as const;

interface OnboardingChecklistProps {
  projectId: string;
  currentStep: number;
}

export function OnboardingChecklist({
  projectId,
  currentStep,
}: OnboardingChecklistProps) {
  const [state, formAction, isPending] = useActionState(updateOnboardingStep, {});

  return (
    <div className="space-y-4">
      {ONBOARDING_STEPS.map((step, index) => {
        const Icon = iconMap[step.icon];
        const isCompleted = currentStep > index;
        const isCurrent = currentStep === index;
        const isLocked = currentStep < index;

        return (
          <Card
            key={step.id}
            className={cn(
              "relative overflow-hidden transition-all",
              isCompleted && "border-success/50 bg-success/5",
              isCurrent && "border-primary ring-2 ring-primary/20",
              isLocked && "opacity-60"
            )}
          >
            <CardContent className="flex items-center gap-6 p-6">
              {/* Step indicator */}
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted
                    ? "border-success bg-success text-success-foreground"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-6" />
                ) : (
                  <Icon className="size-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Step {index + 1}
                  </span>
                  {isCompleted && (
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Action */}
              {isCurrent && (
                <form action={formAction}>
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="step" value={index + 1} />
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </form>
              )}

              {isCompleted && (
                <div className="shrink-0 text-sm text-success">
                  ✓ Done
                </div>
              )}
            </CardContent>

            {/* Progress line connector */}
            {index < ONBOARDING_STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute -bottom-4 left-[2.75rem] h-4 w-0.5 translate-x-1/2",
                  isCompleted ? "bg-success" : "bg-border"
                )}
              />
            )}
          </Card>
        );
      })}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}

