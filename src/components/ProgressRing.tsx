import { useId, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Anel de progresso que se preenche ao entrar na viewport — metáfora de evolução.
 * Usado na seção "Como Funciona". O conteúdo (ícone) fica centralizado no anel.
 */
export default function ProgressRing({
  size = 78,
  stroke = 3,
  className = "",
  children,
}: {
  size?: number;
  stroke?: number;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const gradId = useId();

  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = inView || reduce;

  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
          opacity={0.5}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: filled ? 0 : circumference }}
          transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.9 0.09 88)" />
            <stop offset="100%" stopColor="oklch(0.6 0.12 80)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
