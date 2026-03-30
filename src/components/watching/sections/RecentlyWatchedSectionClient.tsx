// components/watching/sections/RecentlyWatchedSectionClient.tsx
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

export default function RecentlyWatchedSectionClient({ initialItems, userId, config }: Props) {
  const [items, setItems] = useState(initialItems);
  const { openModal, registerOnAdded, unregisterOnAdded,
          registerOnUpdated, unregisterOnUpdated,
          registerOnMoved, unregisterOnMoved,
          registerOnDeleted, unregisterOnDeleted, notifyDeleted } = useWatching(); 
  const supabase = createClient();

  useEffect(() => {
    registerOnAdded("recentlyWatched", item => {
      setItems(prev => {
        if (prev.find(i => i.id === item.id)) return prev.map(i => i.id === item.id ? item : i);
        return [item, ...prev].slice(0, 10);
      });
    });

    registerOnUpdated("recentlyWatched", item => {
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
    });

    // receive items moved from wantToWatch or inProgress
    registerOnMoved("recentlyWatched", item => {
      setItems(prev => {
        if (prev.find(i => i.id === item.id)) return prev;
        return [item, ...prev].slice(0, 10);
      });
    });

    registerOnDeleted("recentlyWatched", (itemId: string) => {
      setItems(prev => prev.filter(i => i.id !== itemId));
    });

    return () => {
      unregisterOnAdded("recentlyWatched");
      unregisterOnUpdated("recentlyWatched");
      unregisterOnMoved("recentlyWatched");
      unregisterOnDeleted("recentlyWatched");  
    };
  }, [registerOnAdded, unregisterOnAdded, registerOnUpdated, unregisterOnUpdated,
      registerOnMoved, unregisterOnMoved,
      registerOnDeleted, unregisterOnDeleted]);  

  const handleDelete = async (itemId: string) => {
    try {
      await supabase.schema("watching").from("media_items")
        .delete().eq("id", itemId).eq("user_id", userId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      notifyDeleted(itemId);
      toast.success("Supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = (updated: WatchItem) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  return (
    <MediaCarousel
      title="Recently Watched"
      subtitle={`Your 10 most recently watched ${config.labelPlural}`}
      items={items}
      onAddClick={() => openModal("recentlyWatched")}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  );
}