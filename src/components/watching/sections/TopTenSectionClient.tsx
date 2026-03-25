// components/watching/sections/TopTenSectionClient.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Save } from "lucide-react";
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

export default function TopTenSectionClient({
  initialItems,
  userId,
  config,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    openModal,
    registerOnAdded,
    unregisterOnAdded,
    registerOnUpdated,
    unregisterOnUpdated,
    registerOnDeleted,      // ✅ AJOUTÉ
    unregisterOnDeleted,    // ✅ AJOUTÉ
    notifyDeleted,          // ✅ AJOUTÉ
  } = useWatching();
  const supabase = createClient();

  useEffect(() => {
    registerOnAdded("topTen", (item) => {
      setItems((prev) => {
        if (prev.find((i) => i.id === item.id)) {
          // update existing
          return prev
            .map((i) => (i.id === item.id ? item : i))
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        }
        return [...prev, item].sort(
          (a, b) => (a.priority || 999) - (b.priority || 999),
        );
      });
    });

    // listen for updates from MediaDetailModal
    registerOnUpdated("topTen", (item) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (!exists) return prev;
        // if favorite removed → remove from top10
        if (!item.favorite || item.priority == null) {
          return prev.filter((i) => i.id !== item.id);
        }
        return prev.map((i) => (i.id === item.id ? item : i));
      });
    });

    // ✅ AJOUTÉ : Écouter les suppressions des autres sections
    registerOnDeleted("topTen", (itemId: string) => {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    });

    return () => {
      unregisterOnAdded("topTen");
      unregisterOnUpdated("topTen");
      unregisterOnDeleted("topTen");  // ✅ AJOUTÉ
    };
  }, [
    registerOnAdded,
    unregisterOnAdded,
    registerOnUpdated,
    unregisterOnUpdated,
    registerOnDeleted,      // ✅ AJOUTÉ
    unregisterOnDeleted,    // ✅ AJOUTÉ
  ]);

  const handleReorder = useCallback((reordered: WatchItem[]) => {
    setItems(reordered.map((item, i) => ({ ...item, priority: i + 1 })));
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        items.map((item) =>
          supabase
            .schema("watching")
            .from("media_items")
            .update({ priority: item.priority })
            .eq("id", item.id)
            .eq("user_id", userId),
        ),
      );
      setIsDirty(false);
      toast.success("Classement sauvegardé !");
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await supabase
        .schema("watching")
        .from("media_items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", userId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      notifyDeleted(itemId);  // ✅ AJOUTÉ : Notifier toutes les sections
      toast.success("Supprimé du Top 10.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = (updated: WatchItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const label =
    config.labelPlural === "films"
      ? "de Tous les Temps"
      : config.labelPlural === "séries"
        ? "Séries"
        : "Animes";

  return (
    <div>
      {isDirty && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500  text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Sauvegarde..." : "Sauvegarder le classement"}
          </button>
        </div>
      )}
      <MediaCarousel
        title={`Mon Top 10 ${label}`}
        subtitle={`Tes 10 ${config.labelPlural} incontournables`}
        items={items}
        onAddClick={items.length < 10 ? () => openModal("topTen") : undefined}
        draggable
        onReorder={handleReorder}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        showRankBadge={true}
      />
    </div>
  );
}