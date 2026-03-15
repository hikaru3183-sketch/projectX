"use client";

import { useState } from "react";
import { Avatar, useGlobalStore } from "@/store/useGlobalStore";
import { CHARACTERS } from "@/components/avatar/avatarData";

export function AvatarPicker({
  initial,
  onSelect, // 親（Modal）に選択したアバターを伝える
}: {
  initial?: Avatar;
  onSelect: (a: Avatar) => void;
}) {
  const [selectedId, setSelectedId] = useState(initial?.image || "1");
  const avatarIds = ["1", "2", "3"];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect({ mode: "image", image: id });
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-1">
      {avatarIds.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => handleSelect(id)}
          className={`relative border-4 rounded-2xl p-2 transition-all bg-background ${
            selectedId === id
              ? "border-blue-500 bg-blue-500/10 scale-105 shadow-md"
              : "border-foreground/5 opacity-60 hover:opacity-100"
          }`}
        >
          <img
            src={`/avatars/${id}.png`}
            className="w-full aspect-square object-cover rounded-lg mb-1"
            alt={`Char ${id}`}
          />
          <p className="text-[9px] font-black text-foreground/70 truncate uppercase">
            {CHARACTERS[id]?.name || id}
          </p>
        </button>
      ))}
    </div>
  );
}