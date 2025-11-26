"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BlobSpec = {
  id: number;
  xPct: number; // 0..100 viewport percentage
  yPct: number; // 0..100 viewport percentage
  sizePx: number;
  color: string; // hex
  opacity: number; // 0..1 peak opacity
  lifeMs: number; // total life
  borderRadius: string; // organic blob radii
};

// Governance-inspired palette: deep navy base, cyan + amber accents
const PALETTE = [
  "#020617",
  "#0f172a",
  "#1e293b",
  "#1d4ed8",
  "#0ea5e9",
  "#67e8f9",
  "#f59e0b",
  "#9333ea",
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function randomRadius(): string {
  // Organic blobby radius
  const a = () => Math.floor(30 + Math.random() * 70);
  return `${a()}% ${a()}% ${a()}% ${a()}% / ${a()}% ${a()}% ${a()}% ${a()}%`;
}

let idCounter = 1;

export default function BlobField() {
  const [blobs, setBlobs] = useState<BlobSpec[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useRef(false);
  const isSmallViewport = useRef(false);

  const spawn = () => {
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const sizePx = Math.floor(220 + Math.random() * 540); // 220..760
    const lifeMs = Math.floor(4000 + Math.random() * 4200); // 4s..8.2s
    const opacity = 0.45 + Math.random() * 0.25; // 0.45..0.7
    const xPct = Math.random() * 100;
    const yPct = Math.random() * 100;
    const spec: BlobSpec = {
      id: idCounter++,
      xPct,
      yPct,
      sizePx,
      color: color ?? "#000000",
      opacity,
      lifeMs,
      borderRadius: randomRadius(),
    };
    setBlobs((prev) => {
      const next = [...prev, spec];
      // Avoid unbounded accumulation; fewer blobs on small or reduced-motion
      const cap = prefersReduced.current ? 8 : isSmallViewport.current ? 16 : 28;
      return next.slice(-cap);
    });
    // Auto-remove after lifetime
    window.setTimeout(() => {
      setBlobs((prev) => prev.filter((b) => b.id !== spec.id));
    }, lifeMs);
  };

  useEffect(() => {
    // Detect media preferences once on mount
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = reduced.matches;
    const small = window.matchMedia('(max-width: 640px)');
    isSmallViewport.current = small.matches;

    // Tune cadence and cap based on device conditions
    const baseIntervalMs = prefersReduced.current ? 1400 : isSmallViewport.current ? 900 : 700;
    const spawnChance = prefersReduced.current ? 0.3 : isSmallViewport.current ? 0.6 : 0.8;
    const interval = window.setInterval(() => {
      // Random chance to spawn this tick to create uneven cadence
      if (Math.random() < spawnChance) spawn();
    }, baseIntervalMs);
    return () => window.clearInterval(interval);
  }, []);

  const blobNodes = useMemo(
    () =>
      blobs.map((b) => {
        const bg = `radial-gradient(60% 70% at 30% 30%, ${rgba(b.color, 0.9)}, ${rgba(
          b.color,
          0.55
        )} 60%, ${rgba(b.color, 0.2)} 100%)`;
        const style: React.CSSProperties = {
          left: `${b.xPct}%`,
          top: `${b.yPct}%`,
          width: b.sizePx,
          height: b.sizePx,
          borderRadius: b.borderRadius,
          background: bg,
          filter: "blur(48px) saturate(140%)",
          mixBlendMode: "screen",
          // CSS vars for animation
          // @ts-expect-error CSS custom property
          "--life": `${b.lifeMs}ms`,
          "--op": b.opacity,
        };
        return <div key={b.id} className="blob" style={style} />;
      }),
    [blobs]
  );

  return (
    <div ref={containerRef} className="blob-field">
      {blobNodes}
    </div>
  );
}


