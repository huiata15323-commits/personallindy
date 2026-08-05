import { useEffect, useRef, useState } from "react";

/** Halo dourado que segue o cursor com atraso suave (apenas desktop). */
export default function GoldCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { ...target };
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY };
      if (!visible && ref.current) {
        visible = true;
        ref.current.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      if (ref.current) ref.current.style.opacity = "0";
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;
  return <div ref={ref} className="gold-cursor" aria-hidden="true" />;
}
