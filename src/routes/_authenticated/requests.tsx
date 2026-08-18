import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listRequests, updateRequestStatus } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/Field";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/requests")({
  head: () => ({
    meta: [
      { title: "Maintenance Requests — Rent Receipt Pro" },
      {
        name: "description",
        content: "Track tenant maintenance requests from report to resolution.",
      },
      { property: "og:title", content: "Maintenance Requests — Rent Receipt Pro" },
      { property: "og:description", content: "Handle tenant maintenance issues quickly." },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const qc = useQueryClient();
  const fetchRequests = useServerFn(listRequests);
  const setStatus = useServerFn(updateRequestStatus);
  const { data, isLoading } = useQuery({ queryKey: ["requests"], queryFn: () => fetchRequests() });

  const mutation = useMutation({
    mutationFn: (input: { id: string; status: "open" | "in_progress" | "resolved" }) =>
      setStatus({ data: input }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Could not update status"),
  });

  return (
    <AppShell title="Maintenance" description="Requests raised by your tenants">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests…</p>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          title="No maintenance requests"
          hint="Tenants can raise issues from the tenant portal."
        />
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((r) => (
            <article key={r.id} className="surface-card flex flex-wrap items-start gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="capitalize">{r.category}</Badge>
                  <Badge variant="secondary" className="capitalize">
                    {r.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{shortDate(r.created_at)}</span>
                </div>
                <p className="mt-3 text-sm">{r.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.tenants?.full_name ?? "Tenant"} · {r.properties?.name ?? "—"} · Unit{" "}
                  {r.units?.unit_number ?? "—"}
                </p>
              </div>
              <div className="w-40">
                <Select
                  value={r.status ?? "open"}
                  onValueChange={(v) =>
                    mutation.mutate({ id: r.id, status: v as "open" | "in_progress" | "resolved" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
