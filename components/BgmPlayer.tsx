"use client";

import { useEffect } from "react";

export const BgmPlayer = () => {
  useEffect(() => {
    const audio = new Audio("/sounds/bgm.wav");
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {
      console.log("BGM再生にはユーザー操作が必要な場合があります");
    });

    return () => audio.pause();
  }, []);

  return null;
};
