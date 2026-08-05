import { useCallback, useEffect, useRef, type ReactNode } from "react";

const REST = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

export default function Tilt3D({
  children,
  className = "",
  max = 8,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const enabled = useRef(false);
  const touchMode = useRef(false);
  const orientRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    enabled.current = !reduced;
    touchMode.current = !reduced && !fine;

    // Ambient tilt from device orientation on phones/tablets (when the sensor
    // is available without an explicit permission prompt). Passive, rAF-capped.
    if (touchMode.current && typeof window.DeviceOrientationEvent !== "undefined") {
      const clamp = (v: number, l: number) => Math.max(-l, Math.min(l, v));
      const onOrient = (e: DeviceOrientationEvent) => {
        const el = ref.current;
        if (!el || rect.current) return; // finger drag takes priority
        const gamma = e.gamma ?? 0; // left/right
        const beta = e.beta ?? 0; // front/back
        const ry = clamp(gamma / 4, max);
        const rx = clamp((beta - 45) / 6, max);
        if (frame.current !== null) return;
        frame.current = requestAnimationFrame(() => {
          frame.current = null;
          el.style.transition = "transform 220ms ease-out";
          el.style.transform = `perspective(1000px) rotateX(${(-rx).toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1)`;
        });
      };
      orientRef.current = onOrient;
      window.addEventListener("deviceorientation", onOrient, { passive: true });
    }

    return () => {
      if (orientRef.current) window.removeEventListener("deviceorientation", orientRef.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [max]);

  const flush = useCallback(() => {
    frame.current = null;
    const el = ref.current;
    const r = rect.current;
    const p = pending.current;
    if (!el || !r || !p) return;

    const px = (p.x - r.left) / r.width - 0.5;
    const py = (p.y - r.top) / r.height - 0.5;
    el.style.setProperty("--glow-x", `${(((p.x - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-y", `${(((p.y - r.top) / r.height) * 100).toFixed(1)}%`);
    // Single style write per animation frame — caps updates at the display
    // refresh rate and avoids React re-renders on every mousemove.
    el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
  }, [max, scale]);

  const start = useCallback((x: number, y: number) => {
    if (!enabled.current) return;
    const el = ref.current;
    if (!el) return;
    // Measure once per hover instead of on every move (avoids layout thrash).
    rect.current = el.getBoundingClientRect();
    el.style.willChange = "transform";
    el.style.transition = "transform 120ms ease-out";
    el.style.setProperty("--glow-opacity", "1");
    pending.current = { x, y };
    if (frame.current === null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  const move = useCallback((x: number, y: number) => {
    if (!enabled.current || !rect.current) return;
    pending.current = { x, y };
    if (frame.current === null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => start(e.clientX, e.clientY),
    [start],
  );
  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => move(e.clientX, e.clientY),
    [move],
  );
  // Touch: never calls preventDefault, so scrolling and assistive tech stay intact.
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const t = e.touches[0];
      if (t) start(t.clientX, t.clientY);
    },
    [start],
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    },
    [move],
  );

  const handleLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    rect.current = null;
    pending.current = null;
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = REST;
    el.style.willChange = "auto";
    el.style.setProperty("--glow-opacity", "0");
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
      onTouchCancel={handleLeave}
      className={`tilt-glow ${className}`}
      style={{ transform: REST, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  );
}
