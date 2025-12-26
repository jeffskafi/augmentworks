"use client";

import { useActionState } from "react";
import { Loader2, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updateClientMetrics, type UpdateMetricsState } from "~/actions/admin";
import type { Metrics } from "~/types/database";

interface MetricsInjectorProps {
  projectId: string;
  currentMetrics?: Metrics | null;
}

export function MetricsInjector({
  projectId,
  currentMetrics,
}: MetricsInjectorProps) {
  const [state, formAction, isPending] = useActionState<UpdateMetricsState, FormData>(
    updateClientMetrics,
    {}
  );

  return (
    <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="rounded-lg bg-violet-600/20 p-2">
          <Zap className="size-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-violet-100">
            Metrics Injector
          </h3>
          <p className="text-sm text-violet-400/70">
            Wizard of Oz mode - Update what the client sees
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="projectId" value={projectId} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="safetyScore" className="text-violet-200">
              Safety Score (0-100)
            </Label>
            <Input
              id="safetyScore"
              name="safetyScore"
              type="number"
              min="0"
              max="100"
              defaultValue={currentMetrics?.safety_score ?? 85}
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hallucinationsCount" className="text-violet-200">
              Hallucinations Count
            </Label>
            <Input
              id="hallucinationsCount"
              name="hallucinationsCount"
              type="number"
              min="0"
              defaultValue={currentMetrics?.hallucinations_count ?? 0}
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jailbreakAttempts" className="text-violet-200">
              Jailbreak Attempts Blocked
            </Label>
            <Input
              id="jailbreakAttempts"
              name="jailbreakAttempts"
              type="number"
              min="0"
              defaultValue={currentMetrics?.jailbreak_attempts ?? 0}
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestsProcessed" className="text-violet-200">
              Requests Processed
            </Label>
            <Input
              id="requestsProcessed"
              name="requestsProcessed"
              type="number"
              min="0"
              defaultValue={currentMetrics?.requests_processed ?? 0}
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100"
            />
          </div>
        </div>

        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-400">{state.success}</p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-violet-600 text-white hover:bg-violet-700"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Updating Metrics...
            </>
          ) : (
            <>
              <Zap className="mr-2 size-4" />
              Inject Metrics
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

