"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = { embedUrl: string; title: string; ratio: number };

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

export default function GamePlayer({ embedUrl, title, ratio }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(false);
  const [expanded, setExpanded] = useState(false); // fallback for browsers without the Fullscreen API
  const isFull = native || expanded;

  const maxWidth = `min(100%, calc(80vh * ${ratio}))`;

  useEffect(() => {
    const onChange = () => {
      const d = document as FsDocument;
      setNative(
        (d.fullscreenElement ?? d.webkitFullscreenElement) === boxRef.current,
      );
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const toggle = useCallback(async () => {
    const d = document as FsDocument;
    const el = boxRef.current as FsElement | null;
    if (!el) return;

    if (expanded) {
      setExpanded(false);
      return;
    }
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.());
      return;
    }
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else setExpanded(true);
    } catch {
      setExpanded(true);
    }
  }, [expanded]);

  return (
    <div className="mb-10">
      <div
        ref={boxRef}
        role="region"
        aria-label={`${title} game player`}
        className={
          expanded
            ? "fixed inset-0 z-50 overflow-hidden bg-black"
            : native
              ? "overflow-hidden bg-black"
              : "relative mx-auto w-full overflow-hidden rounded-2xl bg-black shadow-2xl shadow-indigo-500/15 ring-1 ring-zinc-900/10 dark:shadow-indigo-500/20 dark:ring-white/15"
        }
        style={isFull ? undefined : { aspectRatio: ratio, maxWidth }}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-pointer-lock allow-top-navigation-by-user-activation"
        />
        {expanded && (
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Minimize2 aria-hidden="true" className="h-4 w-4" />
            Exit
          </button>
        )}
      </div>

      <div
        className="mx-auto mt-3 flex w-full items-center justify-between gap-3"
        style={{ maxWidth }}
      >
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Press Esc to leave fullscreen.
        </p>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isFull}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/10 dark:focus-visible:ring-offset-zinc-950"
        >
          {isFull ? (
            <Minimize2 aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Maximize2 aria-hidden="true" className="h-4 w-4" />
          )}
          {isFull ? "Exit fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );
}
