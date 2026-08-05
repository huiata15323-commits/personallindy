import { useEffect, useRef, useState } from "react";

/** Poeira de luz dourada flutuando sutilmente sobre a capa. */
export default function GoldParticles({ count = 26 }: { count?: number }) {
  const [show, setShow] = useState(false);
  const seeds = useRef(
    Array.from({ length: count }, (_, i) => ({
      left: (i * 37.5) % 100,
      size: 1.5 + ((i * 7) % 4),
      delay: (i * 0.8) % 12,
      duration: 12 + ((i * 3) % 10),
      drift: ((i % 5) - 2) * 18,
      opacity: 0.18 + ((i % 4) * 0.09),
    })),
  );

  useEffect(() => {
    setShow(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {seeds.current.map((p, i) => (
        <span
          key={i}
          className="gold-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
