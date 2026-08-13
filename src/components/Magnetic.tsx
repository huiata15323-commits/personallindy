import { useEffect, useRef } from "react";

/**
 * Magnetic hover: o elemento "puxa" na direção do cursor quando ele entra numa
 * zona de proximidade ao redor do botão (não só quando já está por cima) e
 * volta com mola ao sair. Desktop / ponteiro fino, desligado em reduced-motion.
 */
export default function Magnetic({
  children,
  strength = 0.28,
  radius = 90,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  /** Distância extra (px) além das bordas em que o efeito já começa a agir. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    // Ouve o ponteiro na janela inteira e mede a distância até a zona ativa do
    // botão (retângulo expandido por `radius`). Dentro dela, puxa proporcional
    // à proximidade; fora, relaxa de volta ao centro.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const zoneX = r.width / 2 + radius;
      const zoneY = r.height / 2 + radius;

      if (Math.abs(dx) <= zoneX && Math.abs(dy) <= zoneY) {
        // Falloff suave: puxa mais forte quanto mais perto do centro.
        const prox = 1 - Math.min(1, Math.hypot(dx / zoneX, dy / zoneY));
        const pull = strength * (0.45 + 0.55 * prox);
        tx = dx * pull;
        ty = dy * pull;
      } else {
        tx = 0;
        ty = 0;
      }
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {children}
    </span>
  );
}
