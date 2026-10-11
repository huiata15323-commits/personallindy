import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Profundidade 3D guiada pela rolagem: o bloco chega inclinado para trás (como uma página sendo
 * erguida), fica de frente quando chega ao centro da tela e inclina de leve ao sair. Acompanha o
 * dedo/rodinha (não é automático). Só transform — leve no celular. Nada em prefers-reduced-motion.
 */
export default function ScrollDepth({
  children,
  className = "",
  strength = 1,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const rotateX = useTransform(p, [0, 0.42, 0.58, 1], [12 * strength, 0, 0, -7 * strength]);
  const y = useTransform(p, [0, 0.42], [40 * strength, 0]);
  const scale = useTransform(p, [0, 0.42, 0.58, 1], [0.95, 1, 1, 0.98]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, y, scale, transformPerspective: 1100, transformOrigin: "50% 100%" }}
    >
      {children}
    </motion.div>
  );
}
