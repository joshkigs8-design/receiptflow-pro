import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon: Icon,
  action,
}: {
  title: string;
  hint?: string | undefined;
  icon?: React.ComponentType<{ className?: string }> | undefined;
  action?: { label: string; onClick?: () => void; to?: string } | undefined;
}) {
  return (
    <div className="surface-card p-10 text-center flex flex-col items-center justify-center rounded-2xl border border-border/80">
      {Icon ? (
        <div className="mb-3.5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
      ) : null}
      <p className="font-semibold text-foreground">{title}</p>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">{hint}</p> : null}
      {action ? (
        <div className="mt-4">
          {action.to ? (
            <Button asChild size="sm" className="rounded-full shadow-glow font-semibold text-xs">
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={action.onClick}
              className="rounded-full shadow-glow font-semibold text-xs"
            >
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
