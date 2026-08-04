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

  useEffect(() => {
    // Disable entirely on touch/coarse pointers and when motion is reduced:
    // no listeners, no transforms, zero cost on phones.
    enabled.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const flush = useCallback(() => {
    frame.current = null;
    const el = ref.current;
    const r = rect.current;
    const p = pending.current;
    if (!el || !r || !p) return;

    const px = (p.x - r.left) / r.width - 0.5;
    const py = (p.y - r.top) / r.height - 0.5;
    // Single style write per animation frame — caps updates at the display
    // refresh rate and avoids React re-renders on every mousemove.
    el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
  }, [max, scale]);

  const handleEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled.current) return;
    const el = ref.current;
    if (!el) return;
    // Measure once per hover instead of on every move (avoids layout thrash).
    rect.current = el.getBoundingClientRect();
    el.style.willChange = "transform";
    el.style.transition = "transform 120ms ease-out";
    pending.current = { x: e.clientX, y: e.clientY };
    if (frame.current === null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled.current || !rect.current) return;
    pending.current = { x: e.clientX, y: e.clientY };
    if (frame.current === null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

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
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transform: REST, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  );
}
