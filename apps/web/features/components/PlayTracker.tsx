"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export default function PlayTracker({ slug }: { slug: string }) {
  const { mutate } = useMutation({
    mutationFn: async () => {
      await fetch(`/track/${slug}`, { method: "POST" });
    },
  });

  useEffect(() => {
    try {
      const key = `played:${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable, count anyway
    }
    mutate();
  }, [slug, mutate]);

  return null;
}
