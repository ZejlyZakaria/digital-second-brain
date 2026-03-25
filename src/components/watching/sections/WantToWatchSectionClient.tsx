// components/watching/sections/WantToWatchSectionClient.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { MediaCarousel } from "@/components/watching/MediaCarousel";
import { useWatching } from "@/components/watching/WatchingClient";
import type { WatchItem } from "@/lib/utils/watching-data";
import type { WatchingConfig } from "@/lib/utils/watching-config";

interface Props {
  initialItems: WatchItem[];
  userId: string;
  config: WatchingConfig;
}

export default function WantToWatchSectionClient({ initialItems, userId, config }: Props) {
  const PRIORITY_ORDER: Record<string, number> = { high: 1, medium: 2, low: 3 };

  const sortByPriority = (arr: WatchItem[]) =>
    [...arr].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority_level ?? ""] ?? 4;
      const pb = PRIORITY_ORDER[b.priority_level ?? ""] ?? 4;
      return pa - pb;
    });

  const [items, setItems] = useState(() => sortByPriority(initialItems));
  const { openModal, registerOnAdded, unregisterOnAdded,
          registerOnUpdated, unregisterOnUpdated, notifyMoved } = useWatching();
  const supabase = createClient();

  useEffect(() => {
    registerOnAdded("wantToWatch", item => {
      setItems(prev => {
        if (prev.find(i => i.id === item.id)) return prev.map(i => i.id === item.id ? item : i);
        return [item, ...prev].slice(0, 20);
      });
    });

    registerOnUpdated("wantToWatch", (item: WatchItem) => {
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
    });

    return () => {
      unregisterOnAdded("wantToWatch");
      unregisterOnUpdated("wantToWatch");
    };
  }, [registerOnAdded, unregisterOnAdded, registerOnUpdated, unregisterOnUpdated]);

  const handleMarkWatched = async (itemId: string) => {
    try {
      const { data: updated, error } = await supabase
        .schema("watching").from("media_items")
        .update({ 
          watched: true, 
          recently_watched: true,  // ✅ CORRECTION : Passe à Vu Récemment
          want_to_watch: false, 
          watched_at: new Date().toISOString() 
        })
        .eq("id", itemId).eq("user_id", userId)
        .select().single();
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== itemId));
      // notify recentlyWatched to add the item
      notifyMoved("wantToWatch", updated);
      toast.success("Marqué comme vu !");
    } catch {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await supabase.schema("watching").from("media_items")
        .delete().eq("id", itemId).eq("user_id", userId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success("Supprimé de la watchlist.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = (updated: WatchItem) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  return (
    <MediaCarousel
      title="À Voir"
      subtitle={`Ta watchlist — jusqu'à 20 ${config.labelPlural}`}
      items={items}
      onAddClick={items.length < 20 ? () => openModal("wantToWatch") : undefined}
      onMarkWatched={handleMarkWatched}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  );
}