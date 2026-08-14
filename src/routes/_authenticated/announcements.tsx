import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteAnnouncement,
  listAnnouncements,
  listProperties,
  saveAnnouncement,
} from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — Rent Receipt Pro" },
      { name: "description", content: "Broadcast notices to tenants across your properties." },
      { property: "og:title", content: "Announcements — Rent Receipt Pro" },
      { property: "og:description", content: "Send notices to all your tenants." },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listAnnouncements);
  const fetchProperties = useServerFn(listProperties);
  const save = useServerFn(saveAnnouncement);
  const remove = useServerFn(deleteAnnouncement);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", category: "general", property_id: "" });

  const list = useQuery({ queryKey: ["announcements"], queryFn: () => fetchAll() });
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => fetchProperties() });

  const mutation = useMutation({
    mutationFn: () => save({ data: { ...draft, property_id: draft.property_id || null } }),
    onSuccess: () => {
      toast.success("Announcement published");
      setOpen(false);
      setDraft({ title: "", body: "", category: "general", property_id: "" });
      qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not publish"),
  });

  const removal = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Announcement deleted");
      qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete"),
  });

  return (
    <AppShell
      title="Announcements"
      description="Notices your tenants see in the portal"
      actions={
        <Button size="sm" className="rounded-full shadow-glow" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> New notice
        </Button>
      }
    >
      {list.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading announcements…</p>
      ) : (list.data ?? []).length === 0 ? (
        <EmptyState title="No announcements yet" hint="Publish a notice and tenants will see it instantly." />
      ) : (
        <div className="space-y-4">
          {(list.data ?? []).map((a) => (
            <article key={a.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-4 text-primary" />
                  <h2 className="font-semibold">{a.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${a.title}`}
                  disabled={removal.isPending}
                  onClick={() => removal.mutate(a.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {a.properties?.name ?? "All properties"} · {shortDate(a.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New announcement</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <Field label="Title" htmlFor="title">
              <Input
                id="title"
                required
                maxLength={140}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Message" htmlFor="body">
              <Textarea
                id="body"
                required
                maxLength={3000}
                rows={5}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </Field>
            <Field label="Property (optional)">
              <Select
                value={draft.property_id}
                onValueChange={(v) => setDraft({ ...draft, property_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All properties" />
                </SelectTrigger>
                <SelectContent>
                  {(properties.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <DialogFooter>
              <Button type="submit" className="rounded-full" disabled={mutation.isPending}>
                Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}