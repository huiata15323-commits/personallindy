import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "sobre", label: "Sobre" },
  { id: "video", label: "Bastidores" },
  { id: "como-funciona", label: "Como Funciona" },
  { id: "beneficios", label: "Benefícios" },
  { id: "para-quem", label: "Para Quem" },
  { id: "planos", label: "Investimento" },
  { id: "faq", label: "Perguntas" },
];

/** Navegação por pontos na lateral (telas bem largas) — indica a seção ativa. */
export default function SectionDots() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação rápida da página"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a key={s.id} href={`#${s.id}`} aria-label={s.label} className="group relative flex items-center justify-end">
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md border-gold-subtle bg-dark-elevated px-2.5 py-1 text-xs text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2.5 w-2.5 bg-gold shadow-[0_0_8px_var(--color-gold)]"
                  : "h-1.5 w-1.5 bg-gold/30 group-hover:bg-gold/60"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
