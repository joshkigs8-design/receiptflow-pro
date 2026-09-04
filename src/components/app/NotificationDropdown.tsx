import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  FileCheck2,
  Megaphone,
  Receipt,
  Wrench,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { shortDate } from "@/lib/format";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string | null;
  read: boolean | null;
  created_at: string;
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) return [];
      return (data as unknown as NotificationItem[]) || [];
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    await supabase
      .from("notifications" as any)
      .update({ read: true } as any)
      .eq("read", false);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  function getIcon(type: string | null) {
    switch (type) {
      case "receipt":
        return <Receipt className="size-3.5 text-primary" />;
      case "maintenance":
        return <Wrench className="size-3.5 text-amber-500" />;
      case "payment":
        return <FileCheck2 className="size-3.5 text-emerald-500" />;
      case "announcement":
        return <Megaphone className="size-3.5 text-blue-500" />;
      default:
        return <Bell className="size-3.5 text-muted-foreground" />;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="glass relative inline-flex size-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <Bell className="size-4 text-foreground" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0 rounded-2xl border-border bg-card shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-3.5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-sm">Notifications</h4>
            {unreadCount > 0 ? (
              <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                {unreadCount} new
              </Badge>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <CheckCheck className="size-3" /> Mark all read
            </button>
          ) : null}
        </div>

        <div className="max-h-[320px] overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <Bell className="size-6 mx-auto opacity-40 mb-2" />
              <p className="font-medium">No notifications yet</p>
              <p className="text-[11px]">You will be notified when payments or maintenance requests arrive.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 text-xs flex items-start gap-2.5 transition-colors ${
                  !n.read ? "bg-primary/5 font-medium" : "hover:bg-muted/30"
                }`}
              >
                <div className="size-7 rounded-xl bg-background border border-border/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-semibold text-foreground truncate">{n.title}</p>
                  <p className="text-muted-foreground text-[11px] leading-snug line-clamp-2">
                    {n.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 font-mono">
                    {shortDate(n.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border/60 bg-muted/10 text-center">
          <Link
            to="/requests"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-primary hover:underline inline-block py-1"
          >
            View Maintenance Requests →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
