import { cn } from "@/lib/utils";

type Props = {
  status:
    | "ok"
    | "low"
    | "critical"
    | "active"
    | "paused"
    | "draft"
    | "sent"
    | "acknowledged"
    | "received"
    | "success"
    | "warning"
    | "error";
  className?: string;
};

const map: Record<Props["status"], { label: string; cls: string; dot: string }> = {
  ok: { label: "Optimized", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  low: { label: "Low Level", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  critical: {
    label: "Critical",
    cls: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
    dot: "bg-rose-500 animate-pulse",
  },
  active: {
    label: "Active",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  paused: {
    label: "Inactive",
    cls: "text-white/40 bg-white/5 border-white/10",
    dot: "bg-white/20",
  },
  draft: {
    label: "Draft",
    cls: "text-white/40 bg-white/5 border-white/10",
    dot: "bg-white/20",
  },
  sent: { label: "Transmitted", cls: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-500" },
  acknowledged: {
    label: "Confirmed",
    cls: "text-primary bg-primary/10 border-primary/20",
    dot: "bg-primary",
  },
  received: {
    label: "Fulfilled",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  success: {
    label: "Success",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  warning: {
    label: "Warning",
    cls: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-500",
  },
  error: {
    label: "Error",
    cls: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    dot: "bg-rose-500",
  },
};

export function StatusPill({ status, className }: Props) {
  const m = map[status] || { label: status, cls: "bg-white/5 text-white/40 border-white/10", dot: "bg-white/20" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
        m.cls,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
