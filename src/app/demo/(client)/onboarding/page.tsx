"use client";

import { useState } from "react";
import { Rocket, ArrowRight, CheckCircle2, FileSignature, Key, Calendar, Check, Loader2 } from "lucide-react";
import Link from "next/link";

import { Header } from "~/components/dashboard/Header";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";

const ONBOARDING_STEPS = [
  {
    id: 0,
    title: "Sign Contract",
    description: "Review and sign the service agreement",
    icon: FileSignature,
  },
  {
    id: 1,
    title: "Connect API Keys",
    description: "Integrate your AI system with our monitoring platform",
    icon: Key,
  },
  {
    id: 2,
    title: "Book Kickoff Call",
    description: "Schedule your project kickoff meeting with our team",
    icon: Calendar,
  },
];

export default function DemoOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1 for demo
  const [isUpdating, setIsUpdating] = useState(false);

  const totalSteps = ONBOARDING_STEPS.length;
  const completedSteps = Math.min(currentStep, totalSteps);
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const isComplete = completedSteps >= totalSteps;

  const handleCompleteStep = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Onboarding"
        description="Complete these steps to get your AI monitoring set up"
      />

      <div className="mx-auto max-w-3xl space-y-8 p-6">
        {/* Progress Header */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div
                className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${
                  isComplete
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-8" />
                ) : (
                  <Rocket className="size-8" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {isComplete
                        ? "Onboarding Complete! 🎉"
                        : "Getting Started"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isComplete
                        ? "You're all set up and ready to go"
                        : `${completedSteps} of ${totalSteps} steps completed`}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {progressPercentage}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="mt-4 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Banner */}
        {isComplete ? (
          <Card className="border-success/50 bg-gradient-to-r from-success/10 via-transparent to-transparent">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-semibold text-success">
                  All Done!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your project is now in the security audit phase. Our team will
                  begin analyzing your AI system.
                </p>
              </div>
              <Button asChild>
                <Link href="/demo" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
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
                      <Button
                        onClick={handleCompleteStep}
                        disabled={isUpdating}
                        className="shrink-0"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          "Mark Complete"
                        )}
                      </Button>
                    )}

                    {isCompleted && (
                      <div className="shrink-0 text-sm text-success">
                        ✓ Done
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Help section */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help with onboarding?{" "}
              <a
                href="mailto:support@agentready.com"
                className="font-medium text-primary hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

