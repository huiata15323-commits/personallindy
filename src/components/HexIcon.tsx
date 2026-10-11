import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Placa sextavada dos ícones — o mesmo formato das cabeças do halter da abertura: aro dourado
 * metálico, face preta fosca e o ícone em dourado (mais contraste que branco sobre ouro).
 * Medidas em `em`: o tamanho vem do font-size (text-[16px] = placa de ~74px).
 *
 * Na rolagem: o ícone chega inclinado com o aro girado, e no centro da tela o aro "encaixa"
 * na face (como uma anilha sendo travada) enquanto a face se aproxima e o ícone acende.
 * No hover do card (classe `group`), uma faixa de luz atravessa o aro. Sem animação em
 * prefers-reduced-motion.
 */
export default function HexIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const rotateX = useTransform(p, [0, 0.5, 1], [34, 0, -20]);
  const rotateY = useTransform(p, [0, 0.5, 1], [-26, 0, 14]);
  const lift = useTransform(p, [0, 0.5, 1], [14, 0, -8]);
  const rimSpin = useTransform(p, [0, 0.5, 1], [-30, 0, 14]);
  const faceZ = useTransform(p, [0, 0.5, 1], ["0em", "0.9em", "0.3em"]);
  const glow = useTransform(p, [0.25, 0.5, 0.75], [0, 1, 0.35]);
  const glyphFilter = useTransform(
    glow,
    (g) => `drop-shadow(0 0 ${2 + g * 9}px oklch(0.86 0.13 88 / ${0.1 + g * 0.6}))`,
  );

  if (reduce) {
    return (
      <span ref={ref} aria-hidden="true" className={`hex-icon ${className}`}>
        <span className="hex-glow" />
        <span className="hex-rim" />
        <span className="hex-face">
          <span className="hex-glyph">{children}</span>
        </span>
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`hex-icon ${className}`}
      style={{ rotateX, rotateY, y: lift, transformPerspective: 420, transformStyle: "preserve-3d" }}
    >
      <span className="hex-glow" />
      <motion.span className="hex-rim" style={{ rotateZ: rimSpin }} />
      <motion.span className="hex-face" style={{ z: faceZ }}>
        <motion.span className="hex-glyph" style={{ filter: glyphFilter }}>
          {children}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}
