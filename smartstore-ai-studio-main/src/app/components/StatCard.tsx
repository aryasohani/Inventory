import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  label: string;
  value: ReactNode;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: ReactNode;
  accent?: "primary" | "danger" | "warning" | "success";
  hint?: string;
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
};

export function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon,
  accent = "primary",
  hint,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-black/40 border border-white/10 p-6 rounded-2xl overflow-hidden backdrop-blur-xl"
    >
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
            {label}
          </p>
          <h3 className="text-3xl font-display font-bold tracking-tight text-white">
            {value}
          </h3>
          {(delta || hint) && (
            <div className="flex items-center gap-2 pt-1">
              {delta && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    trend === "up" && "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    trend === "down" && "text-rose-400 bg-rose-500/10 border-rose-500/20",
                    trend === "neutral" && "text-white/40 bg-white/5 border-white/10",
                  )}
                >
                  {delta}
                </span>
              )}
              {hint && <span className="text-[10px] text-muted-foreground font-medium">{hint}</span>}
            </div>
          )}
        </div>
        <div
          className={cn(
            "size-12 rounded-xl grid place-items-center border shadow-glow transition-transform duration-300 group-hover:scale-110",
            accentMap[accent],
          )}
        >
          {icon}
        </div>
      </div>
      
      {/* Subtle decorative glow */}
      <div className="absolute -bottom-6 -right-6 size-24 bg-primary/5 blur-2xl rounded-full transition-opacity group-hover:opacity-100 opacity-50" />
    </motion.div>
  );
}
