/** Faixa deslizante com as especialidades — movimento contínuo, pausa no hover. */
const ITEMS = [
  "Emagrecimento",
  "Hipertrofia",
  "Gestantes",
  "Idosos",
  "Grupos Especiais",
  "Recomposição Corporal",
  "Reabilitação",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]; // duplicado para loop sem emenda
  return (
    <div className="marquee relative overflow-hidden border-y border-gold/15 bg-dark-surface/60 py-4" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-display text-sm md:text-base uppercase tracking-[0.25em] text-gold/80"
          >
            {t}
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold/50" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
