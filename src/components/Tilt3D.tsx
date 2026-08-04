import { useRef, useState, type ReactNode } from "react";

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
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [active, setActive] = useState(false);

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`,
    );
  };

  const reset = () => {
    setActive(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: active ? "transform 120ms ease-out" : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
