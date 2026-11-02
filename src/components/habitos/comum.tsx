import { motion } from "framer-motion";
import { useRef } from "react";

/** Curva do site (a mesma do traço do logo e das revelações da landing page). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Logo do site: PERSONAL (Bebas Neue) + Lindy (Cormorant itálico, dourado). */
export function Logo({ grande = false, papel = false }: { grande?: boolean; papel?: boolean }) {
  return (
    <span
      className={`relative inline-flex items-baseline gap-2 tracking-widest ${papel ? "text-[#141414]" : "text-foreground"} ${grande ? "text-2xl" : "text-xl"}`}
    >
      <span className="font-display uppercase">Personal</span>{" "}
      <span
        className={`font-serif-display italic ${papel ? "text-[#B88513]" : "text-gradient-gold"} ${grande ? "text-3xl" : "text-2xl"}`}
      >
        Lindy
      </span>
    </span>
  );
}

/** O traço dourado do logo do site, que se desenha uma vez. */
export function TracoDourado({
  atraso = 0,
  className = "",
  parado = false,
}: {
  atraso?: number;
  className?: string;
  parado?: boolean;
}) {
  const id = useRef(`hab-traco-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <svg
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={`pointer-events-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <motion.path
        d="M2 7 Q 25 2, 50 5 T 98 3"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={parado ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: atraso, ease: EASE }}
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold-dark)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Topo das páginas do diário: logo (volta para o site) e o nome da página. */
export function Topo({ titulo }: { titulo: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5 py-3 sm:px-6">
        {/* O nome que o leitor de tela lê começa pelo texto visível ("Personal Lindy"). */}
        <a
          href="/"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Logo />
          <span className="sr-only">, página inicial</span>
        </a>
        <span className="font-serif-display text-[1.05rem] italic text-muted-foreground">
          {titulo}
        </span>
      </div>
    </header>
  );
}
