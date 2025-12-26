import { redirect } from "next/navigation";
import { Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Header } from "~/components/dashboard/Header";
import { OnboardingChecklist } from "~/components/onboarding/OnboardingChecklist";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

import { getCurrentUser, getActiveProject } from "~/actions/get-projects";
import { ONBOARDING_STEPS } from "~/actions/update-onboarding";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const project = await getActiveProject();
  if (!project) redirect("/dashboard");

  const totalSteps = ONBOARDING_STEPS.length;
  const completedSteps = Math.min(project.onboarding_step, totalSteps);
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const isComplete = completedSteps >= totalSteps;

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
                <Link href="/dashboard" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <OnboardingChecklist
            projectId={project.id}
            currentStep={project.onboarding_step}
          />
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

