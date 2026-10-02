import type { ReactNode } from "react";

/**
 * Ícone de vidro, adaptado do Glass Icons do React Bits (reactbits.dev/components/glass-icons):
 * uma placa dourada inclinada atrás e uma placa de vidro fosco na frente, com o ícone.
 * Tudo é medido em `em`, então o tamanho vem do font-size (text-[16px] = placa de 72px).
 * O hover é o do card pai (classe `group`): o ícone reage com o mouse em qualquer parte do card.
 */
export default function GlassIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`glass-icon ${className}`}>
      <span className="glass-icon-back" />
      <span className="glass-icon-front">
        <span className="glass-icon-glyph">{children}</span>
      </span>
    </span>
  );
}
