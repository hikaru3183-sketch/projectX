"use client";

import { ReactNode } from "react";
import { ClickSoundProvider } from "./ClickSoundContext";
import { BgmPlayer } from "../components/BgmPlayer";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ClickSoundProvider>
      <BgmPlayer />
      {children}
    </ClickSoundProvider>
  );
}
