"use client";

import { useEffect } from "react";

export default function PlayTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const key = `played:${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable, count anyway
    }
    fetch(`/track/${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
