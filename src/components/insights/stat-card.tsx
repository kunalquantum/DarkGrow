import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  suffix,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-4", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">
        {value}
        {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
