import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  duration = 1400,
  suffix = "",
  prefix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [runId, setRunId] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setRunId((n) => n + 1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // re-run every time it enters the viewport
          if (e.isIntersecting) setRunId((n) => n + 1);
          else setValue(0);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (runId === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let frame = 0;
    setAnimating(true);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // elegant expo-out easing
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * to));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setAnimating(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runId, to, duration]);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums transition-[opacity,transform,filter] duration-500 ease-out ${className}`}
      style={{
        opacity: animating ? 0.85 : 1,
        transform: animating ? "translateY(2px) scale(0.98)" : "none",
        filter: animating ? "blur(0.3px)" : "none",
      }}
    >
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
