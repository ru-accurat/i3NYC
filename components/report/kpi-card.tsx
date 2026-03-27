interface KPICardProps {
  value: string;
  label: string;
  sublabel?: string;
}

export function KPICard({ value, label, sublabel }: KPICardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-background/50 px-6 py-5">
      <span className="font-mono text-3xl font-light tracking-tight text-primary">{value}</span>
      <span className="text-sm text-foreground/80">{label}</span>
      {sublabel && (
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      )}
    </div>
  );
}
