import { TrainingMode } from "@/types";

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

export function getModeLabel(mode: TrainingMode): string {
  const labels: Record<TrainingMode, string> = {
    PUSH: "PUSH",
    FORGE: "FORGE",
    MAINTAIN: "MAINTAIN",
    RESTORE: "RESTORE",
    RECOVER: "RECOVER",
  };
  return labels[mode];
}

export function getModeColor(mode: TrainingMode): string {
  const colors: Record<TrainingMode, string> = {
    PUSH: "text-bone",
    FORGE: "text-vital",
    MAINTAIN: "text-ash",
    RESTORE: "text-ghost",
    RECOVER: "text-signal",
  };
  return colors[mode];
}

export function getReadinessLabel(score: number): string {
  if (score >= 80) return "PEAK";
  if (score >= 60) return "READY";
  if (score >= 40) return "MODERATE";
  if (score >= 20) return "LOW";
  return "DEPLETED";
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
