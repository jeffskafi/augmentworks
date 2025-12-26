"use server";

import { createClient } from "~/utils/supabase/server";
import type { Metrics, MetricsWithTrend } from "~/types/database";
import { calculatePercentageChange } from "~/lib/utils";

export async function getLatestMetrics(
  projectId: string
): Promise<Metrics | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("project_id", projectId)
    .order("report_month", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching latest metrics:", error);
    return null;
  }

  return data as Metrics;
}

export async function getMetricsWithTrend(
  projectId: string
): Promise<MetricsWithTrend | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("project_id", projectId)
    .order("report_month", { ascending: false })
    .limit(2);

  if (error) {
    console.error("Error fetching metrics:", error);
    return null;
  }

  const metricsData = data as Metrics[] | null;

  if (!metricsData || metricsData.length === 0) {
    return null;
  }

  const current = metricsData[0]!;
  const previous = metricsData[1];

  const metricsWithTrend: MetricsWithTrend = {
    ...current,
    previous_metrics: previous,
    safety_score_change: previous
      ? calculatePercentageChange(current.safety_score, previous.safety_score)
      : undefined,
    hallucinations_change: previous
      ? calculatePercentageChange(
          current.hallucinations_count,
          previous.hallucinations_count
        )
      : undefined,
    jailbreak_change: previous
      ? calculatePercentageChange(
          current.jailbreak_attempts,
          previous.jailbreak_attempts
        )
      : undefined,
    requests_change: previous
      ? calculatePercentageChange(
          current.requests_processed,
          previous.requests_processed
        )
      : undefined,
  };

  return metricsWithTrend;
}

export async function getMetricsHistory(
  projectId: string,
  months = 6
): Promise<Metrics[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("project_id", projectId)
    .order("report_month", { ascending: false })
    .limit(months);

  if (error) {
    console.error("Error fetching metrics history:", error);
    return [];
  }

  return (data as Metrics[] | null) ?? [];
}
