"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { updateProjectStatus } from "~/actions/admin";
import type { ProjectStatus } from "~/types/database";
import { cn } from "~/lib/utils";

interface PhaseSelectorProps {
  projectId: string;
  currentStatus: ProjectStatus;
}

const statusConfig = {
  onboarding: {
    label: "Onboarding",
    description: "Initial setup and configuration",
    color: "text-amber-400",
  },
  audit: {
    label: "Audit",
    description: "Security review in progress",
    color: "text-blue-400",
  },
  monitoring: {
    label: "Active Monitoring",
    description: "Live system monitoring",
    color: "text-emerald-400",
  },
  completed: {
    label: "Completed",
    description: "Project finished",
    color: "text-slate-400",
  },
};

export function PhaseSelector({
  projectId,
  currentStatus,
}: PhaseSelectorProps) {
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleStatusChange = (newStatus: ProjectStatus) => {
    setStatus(newStatus);
    setMessage(null);

    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.success) {
        setMessage({ type: "success", text: "Status updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.error ?? "Failed to update status" });
        setStatus(currentStatus); // Revert on error
      }
    });
  };

  return (
    <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
      <h3 className="text-lg font-semibold text-violet-100 mb-4">
        Project Phase
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-violet-200">Current Phase</Label>
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as ProjectStatus)}
            disabled={isPending}
          >
            <SelectTrigger className="border-violet-900/50 bg-slate-800 text-violet-100">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent className="border-violet-900/50 bg-slate-900">
              {(Object.keys(statusConfig) as ProjectStatus[]).map((key) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="text-violet-200 focus:bg-violet-600/20 focus:text-violet-100"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium", statusConfig[key].color)}>
                      {statusConfig[key].label}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-violet-400/70">
          {statusConfig[status].description}
        </p>

        {message && (
          <p
            className={cn(
              "text-sm",
              message.type === "success" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {message.text}
          </p>
        )}

        {/* Visual timeline */}
        <div className="flex items-center gap-2 pt-4">
          {(Object.keys(statusConfig) as ProjectStatus[]).map((key, index) => {
            const isActive = key === status;
            const isPast =
              Object.keys(statusConfig).indexOf(status) >
              Object.keys(statusConfig).indexOf(key);

            return (
              <div key={key} className="flex items-center flex-1">
                <div
                  className={cn(
                    "size-3 rounded-full transition-colors",
                    isActive
                      ? "bg-violet-500 ring-2 ring-violet-500/30"
                      : isPast
                        ? "bg-violet-600/50"
                        : "bg-slate-700"
                  )}
                />
                {index < Object.keys(statusConfig).length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      isPast ? "bg-violet-600/50" : "bg-slate-700"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-violet-400/50">
          <span>Onboarding</span>
          <span>Audit</span>
          <span>Monitoring</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}

