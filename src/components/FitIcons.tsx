import type { SVGProps } from "react";

/**
 * Ícones próprios de fitness — estilo sólido/duotone (não "linha fina" genérica).
 * Usam currentColor (tingidos por text-gold/icon-ember). Partes com classes
 * `fit-*` são animadas via styles.css (cinematográfico, com reduced-motion safe).
 * Drop-in: aceitam size + className como os ícones lucide.
 */
type IconProps = { size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, "className">;

function Svg({ size = 24, className = "", children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`fit-icon ${className}`}
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Halter — balança levemente no hover do card */
export function Dumbbell(props: IconProps) {
  return (
    <Svg {...props}>
      <g className="fit-dumbbell" fill="currentColor">
        <rect x="1" y="9.5" width="2.6" height="5" rx="1" />
        <rect x="3.4" y="7.5" width="2.8" height="9" rx="1.2" />
        <rect x="17.8" y="7.5" width="2.8" height="9" rx="1.2" />
        <rect x="20.4" y="9.5" width="2.6" height="5" rx="1" />
        <rect x="6" y="10.6" width="12" height="2.8" rx="1.4" />
      </g>
    </Svg>
  );
}

/** Kettlebell — sólido */
export function Kettlebell(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fill="currentColor"
        d="M12 2.5a4.2 4.2 0 0 0-4 5.5 7.5 7.5 0 1 0 8 0 4.2 4.2 0 0 0-4-5.5Zm0 2.2a2 2 0 0 1 1.9 2.6 7.6 7.6 0 0 0-3.8 0A2 2 0 0 1 12 4.7Z"
      />
      <circle cx="12" cy="14.5" r="3" className="fit-shine" fill="currentColor" opacity="0.35" />
    </Svg>
  );
}

/** Batimento — coração sólido + linha de ECG que desenha em loop */
export function Heartbeat(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fill="currentColor"
        opacity="0.9"
        d="M12 20.3 4.3 12.9a4.7 4.7 0 0 1 0-6.8 4.9 4.9 0 0 1 6.8 0l.9.9.9-.9a4.9 4.9 0 0 1 6.8 0 4.7 4.7 0 0 1 0 6.8Z"
      />
      <path
        className="fit-ecg"
        d="M3 12.8h4l1.6-3.4 2.6 6.4 2-4 1.2 1H21"
        fill="none"
        stroke="var(--background)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Alvo — anéis concêntricos com pulso */
export function Target(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor">
        <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 2.2A6.8 6.8 0 1 1 5.2 12 6.8 6.8 0 0 1 12 5.2Z" />
        <path d="M12 7.6a4.4 4.4 0 1 0 4.4 4.4A4.4 4.4 0 0 0 12 7.6Zm0 2.2A2.2 2.2 0 1 1 9.8 12 2.2 2.2 0 0 1 12 9.8Z" opacity="0.55" />
        <circle cx="12" cy="12" r="1.6" className="fit-pulse" />
      </g>
    </Svg>
  );
}

/** Medalha — com brilho que passa (sheen) */
export function Medal(props: IconProps) {
  return (
    <Svg {...props}>
      <path fill="currentColor" opacity="0.6" d="M8.5 2h2.3l2 4.8-2 .9-2.3-5.7Zm4.7 0h2.3l-2.3 5.7-2-.9L13.2 2Z" />
      <g className="fit-medal">
        <circle cx="12" cy="15" r="6.2" fill="currentColor" />
        <path
          d="m12 11.4 1 2 2.2.3-1.6 1.6.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.6 2.2-.3Z"
          fill="var(--background)"
        />
      </g>
    </Svg>
  );
}

/** Cronômetro — ponteiro que gira */
export function Stopwatch(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor">
        <rect x="9" y="1.4" width="6" height="2.2" rx="1.1" />
        <path d="M12 4.5a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 2.2A5.8 5.8 0 1 1 6.2 12.5 5.8 5.8 0 0 1 12 6.7Z" />
      </g>
      <line
        className="fit-hand"
        x1="12"
        y1="12.5"
        x2="12"
        y2="8.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Localização — pin sólido que "flutua" */
export function Pin(props: IconProps) {
  return (
    <Svg {...props}>
      <g className="fit-pin" fill="currentColor">
        <path d="M12 2.2a7 7 0 0 0-7 7c0 4.8 7 12.6 7 12.6s7-7.8 7-12.6a7 7 0 0 0-7-7Z" />
        <circle cx="12" cy="9.2" r="2.6" fill="var(--background)" />
      </g>
    </Svg>
  );
}

/** Evolução — barras que sobem */
export function BarsUp(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor">
        <rect className="fit-bar fit-bar-1" x="3" y="13" width="4" height="8" rx="1.2" />
        <rect className="fit-bar fit-bar-2" x="10" y="9" width="4" height="12" rx="1.2" />
        <rect className="fit-bar fit-bar-3" x="17" y="4" width="4" height="17" rx="1.2" />
      </g>
    </Svg>
  );
}

/** Grupo de pessoas — sólido */
export function People(props: IconProps) {
  return (
    <Svg {...props}>
      <g className="fit-people" fill="currentColor">
        <circle cx="8.5" cy="8" r="3.2" />
        <path d="M2.5 20a6 6 0 0 1 12 0 1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z" />
        <circle cx="16.5" cy="8.4" r="2.6" opacity="0.6" />
        <path d="M15 13.4a5 5 0 0 1 6.5 4.7 1 1 0 0 1-1 .9h-3.3a7.4 7.4 0 0 0-2.2-5.6Z" opacity="0.6" />
      </g>
    </Svg>
  );
}

/** Chama — sólida, usa o flicker existente */
export function Flame(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        className="flame-flicker"
        fill="currentColor"
        d="M12 2s5.5 4 5.5 9.5A5.5 5.5 0 0 1 6.5 12c0-1.4.6-2.6 1.4-3.5.2 1 .9 1.8 1.8 2 .2-2.5 1.4-4.8 2.3-6.5.6 1.5 2 2.6 2 4.2 0 .9-.4 1.6-1 2.1 1.7-.2 2.4-1.8 2.2-3.4C16.8 5.8 14.6 3.5 12 2Z"
        style={{ transformOrigin: "center bottom" }}
      />
    </Svg>
  );
}
