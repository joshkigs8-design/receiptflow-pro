import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  FileText,
  Loader2,
  Plus,
  Receipt,
  Search,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { globalSearch } from "@/lib/app.functions";
import { money } from "@/lib/format";

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const searchFn = useServerFn(globalSearch);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const { data, isLoading } = useQuery({
    queryKey: ["globalSearch", term],
    queryFn: () => searchFn({ data: { term: term.trim() } }),
    enabled: term.trim().length >= 2,
    staleTime: 10_000,
  });

  function handleSelect(path: string) {
    onOpenChange(false);
    navigate({ to: path });
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tenants, properties, receipt numbers... (Ctrl+K)"
        value={term}
        onValueChange={setTerm}
      />
      <CommandList className="max-h-[350px] overflow-y-auto">
        {isLoading && term.trim().length >= 2 ? (
          <div className="flex items-center justify-center p-6 text-xs text-muted-foreground gap-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Searching portfolio...</span>
          </div>
        ) : null}

        {!isLoading && term.trim().length >= 2 && !data?.tenants.length && !data?.properties.length && !data?.receipts.length ? (
          <CommandEmpty>No matching tenants, properties, or receipts found.</CommandEmpty>
        ) : null}

        {data?.tenants && data.tenants.length > 0 ? (
          <CommandGroup heading="Tenants">
            {data.tenants.map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => handleSelect("/tenants")}
                className="flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="size-4 text-primary shrink-0" />
                  <span className="font-medium text-sm">{t.full_name}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{t.phone}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.properties && data.properties.length > 0 ? (
          <CommandGroup heading="Properties">
            {data.properties.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => handleSelect("/properties")}
                className="flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-sm">{p.name}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">Code: {p.code}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.receipts && data.receipts.length > 0 ? (
          <CommandGroup heading="Digital Receipts">
            {data.receipts.map((r) => (
              <CommandItem
                key={r.id}
                onSelect={() => handleSelect(`/receipt/${r.public_id}`)}
                className="flex items-center justify-between cursor-pointer py-2.5 px-3 rounded-lg"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="size-4 text-amber-600 shrink-0" />
                  <span className="font-mono text-xs font-semibold">{r.receipt_number}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{money(r.amount)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        <CommandSeparator />

        <CommandGroup heading="Quick Navigation">
          <CommandItem
            onSelect={() => handleSelect("/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer py-2 px-3 text-xs"
          >
            <Search className="size-3.5 text-muted-foreground" />
            <span>Dashboard Overview</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect("/payments")}
            className="flex items-center gap-2.5 cursor-pointer py-2 px-3 text-xs"
          >
            <Plus className="size-3.5 text-primary" />
            <span>Record New Payment</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect("/receipts")}
            className="flex items-center gap-2.5 cursor-pointer py-2 px-3 text-xs"
          >
            <FileText className="size-3.5 text-muted-foreground" />
            <span>Receipts Registry</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
