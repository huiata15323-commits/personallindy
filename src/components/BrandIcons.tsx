import type { SVGProps } from "react";

/**
 * Ícones exclusivos da Personal Lindy (substituem os genéricos). Sistema único:
 * grade 48×48, traço 3 com pontas e cantos arredondados, um conceito por ícone e um
 * motivo de marca — a pequena estrela de brilho marca o que é exclusivo/personalizado.
 * Usam currentColor (tingidos pelo pai). Partes com classes `bi-*` animam no hover do
 * card (styles.css, com reduced-motion). Drop-in: aceitam size + className como antes.
 */
type IconProps = { size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, "className">;

function Svg({ size = 24, className = "", children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`fit-icon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Estrela de brilho de 4 pontas: o motivo "exclusivo / personalizado" da marca. */
function Sparkle({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  const k = r * 0.3;
  return (
    <path
      className="bi-sparkle"
      style={{ transformOrigin: `${x}px ${y}px` }}
      strokeWidth={2.8}
      d={`M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`}
    />
  );
}

/** Avaliação inicial — fita métrica (estojo + fita graduada saindo) */
export function Tape(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="9" width="25" height="25" rx="7" />
      <circle cx="17.5" cy="21.5" r="4.5" />
      <g className="bi-tape">
        <path d="M30 27H42.5V34H30" />
        <path d="M34 27V30.5M38.5 27V30.5" strokeWidth={2.6} />
      </g>
    </Svg>
  );
}

/** Treino exclusivo — halter com o brilho de "feito para você" */
export function DumbbellPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <g className="bi-dumbbell" style={{ transformOrigin: "24px 27px" }}>
        <rect x="6" y="21" width="4" height="12" rx="1.6" />
        <rect x="10" y="17" width="6" height="20" rx="2.2" />
        <path d="M16 27H32" />
        <rect x="32" y="17" width="6" height="20" rx="2.2" />
        <rect x="38" y="21" width="4" height="12" rx="1.6" />
      </g>
      <Sparkle x={40} y={8} r={4.5} />
    </Svg>
  );
}

/** Acompanhamento contínuo — conversa (WhatsApp) com batimento */
export function ChatPulse(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 9H34A8 8 0 0 1 42 17V27A8 8 0 0 1 34 35H22L14 41V35A8 8 0 0 1 6 27V17A8 8 0 0 1 14 9Z" />
      <path className="bi-pulse" d="M12 22H17.5L20.5 16.5L25 28L28 22H36" strokeWidth={2.6} />
    </Svg>
  );
}

/** Ajustes e evolução — gráfico subindo */
export function GrowthChart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 8V40H40" />
      <path className="bi-growth" d="M14 32L22 24L28 29L39 16" />
      <path d="M32 16H39V23" />
    </Svg>
  );
}

/** Treino 100% personalizado — kettlebell com brilho */
export function KettlebellPlus(props: IconProps) {
  return (
    <Svg {...props}>
      {/* silhueta de sino: alça larga que se abre no corpo redondo, base reta */}
      <g className="bi-kettle" style={{ transformOrigin: "24px 41px" }}>
        <path d="M16 41C10.5 37.5 10 28.5 14.5 23.5C12 15 16 8 24 8C32 8 36 15 33.5 23.5C38 28.5 37.5 37.5 32 41Z" />
        <path d="M19.2 22C18.4 16.6 20.4 13.2 24 13.2C27.6 13.2 29.6 16.6 28.8 22" />
      </g>
      <Sparkle x={40} y={9} r={4.5} />
    </Svg>
  );
}

/** Suporte direto — dois balões de conversa */
export function ChatDuo(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 17H24A6 6 0 0 1 30 23V30A6 6 0 0 1 24 36H17L11 41V36A6 6 0 0 1 6 30V23A6 6 0 0 1 12 17Z" />
      <path d="M20 17V13A6 6 0 0 1 26 7H36A6 6 0 0 1 42 13V20A6 6 0 0 1 36 26H35V31L30 27" />
      <g className="bi-dots" fill="currentColor" stroke="none">
        <circle cx="12.5" cy="26.5" r="1.8" />
        <circle cx="18" cy="26.5" r="1.8" />
        <circle cx="23.5" cy="26.5" r="1.8" />
      </g>
    </Svg>
  );
}

/** Flexibilidade de horários — cronômetro */
export function StopwatchLine(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="24" cy="27" r="13" />
      <path d="M20 7H28M24 7V14M35.5 14.5L38.5 11.5" />
      <path className="bi-hand" style={{ transformOrigin: "24px 27px" }} d="M24 27V19.5" />
      <circle cx="24" cy="27" r="1.9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Treine em qualquer lugar — mapa dobrado com o ponto "você está aqui" */
export function PinDumbbell(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 13L17 8L31 13L43 8V35L31 40L17 35L5 40Z" />
      <path d="M17 8V35M31 13V40" strokeWidth={2.6} />
      <g className="bi-pin" style={{ transformOrigin: "24px 26px" }}>
        <circle cx="24" cy="22.5" r="3.4" fill="currentColor" stroke="none" />
      </g>
    </Svg>
  );
}

/** Resultados reais — troféu */
export function Trophy(props: IconProps) {
  return (
    <Svg {...props}>
      <g className="bi-trophy" style={{ transformOrigin: "24px 40px" }}>
        <path d="M15 8H33V19A9 9 0 0 1 15 19Z" />
        <path d="M15 11.5H11.5A4 4 0 0 0 11.5 19.5H15.6M33 11.5H36.5A4 4 0 0 1 36.5 19.5H32.4" />
        <path d="M24 28V34M18 40H30M19.5 34H28.5V40H19.5Z" />
      </g>
      <Sparkle x={24} y={16} r={3.6} />
    </Svg>
  );
}

/** Credencial (selo CREF, rodapé) — medalha com fita */
export function MedalRibbon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 6L21.5 18M31 6L26.5 18" />
      <g className="bi-medal" style={{ transformOrigin: "24px 29px" }}>
        <circle cx="24" cy="29" r="10" />
        <path
          strokeWidth={2.2}
          d="M24 23.5L25.6 27.1L29.5 27.5L26.6 30.1L27.4 34L24 32L20.6 34L21.4 30.1L18.5 27.5L22.4 27.1Z"
        />
      </g>
    </Svg>
  );
}
