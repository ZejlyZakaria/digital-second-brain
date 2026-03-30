// components/watching/sections/InProgressSectionClient.tsx
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

export default function InProgressSectionClient({
  initialItems,
  userId,
  config,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const {
    openModal,
    registerOnAdded,
    unregisterOnAdded,
    registerOnUpdated,
    unregisterOnUpdated,
    notifyMoved,
    registerOnDeleted,      
    unregisterOnDeleted,    
    notifyDeleted,          
  } = useWatching();
  const supabase = createClient();

  useEffect(() => {
    registerOnAdded("inProgress", (item) => {
      setItems((prev) =>
        prev.find((i) => i.id === item.id) ? prev : [item, ...prev],
      );
    });

    registerOnUpdated("inProgress", (item) => {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    });

    // Écouter les suppressions des autres sections (ex: Top 10)
    registerOnDeleted("inProgress", (itemId: string) => {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    });

    return () => {
      unregisterOnAdded("inProgress");
      unregisterOnUpdated("inProgress");
      unregisterOnDeleted("inProgress");  
    };
  }, [
    registerOnAdded,
    unregisterOnAdded,
    registerOnUpdated,
    unregisterOnUpdated,
    registerOnDeleted,      
    unregisterOnDeleted,    
  ]);

  const handleMarkWatched = async (itemId: string) => {
    try {
      const { data: updated, error } = await supabase
        .schema("watching")
        .from("media_items")
        .update({
          watched: true,
          recently_watched: true,
          want_to_watch: false,
          in_progress: false,
          watched_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      notifyMoved("inProgress", updated);
      toast.success("Marked as finished !");
    } catch {
      toast.error("Error occurred while updating the item.");
    }
  };

  const handleRemoveFromProgress = async (itemId: string) => {
    try {
      await supabase
        .schema("watching")
        .from("media_items")
        .delete()  
        .eq("id", itemId)
        .eq("user_id", userId);
      
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      notifyDeleted(itemId);   
      toast.success("Deleted.");
    } catch {
      toast.error("Error occurred while deleting the item.");
    }
  };

  const handleUpdate = (updated: WatchItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const label = config.labelPlural === "series" ? "Series" : "Animes";

  return (
    <MediaCarousel
      title="In Progress"
      subtitle={`${label} that you are currently watching`}
      items={items}
      onAddClick={() => openModal("inProgress")}
      onMarkWatched={handleMarkWatched}
      onDelete={handleRemoveFromProgress}
      onUpdate={handleUpdate}
      showEpisodeBadge={true}
    />
  );
}