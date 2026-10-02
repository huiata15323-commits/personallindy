import { useEffect } from "react";
import { motion, useAnimation, useMotionValue, useReducedMotion } from "framer-motion";

/**
 * Adaptado do Circular Text do React Bits (reactbits.dev/text-animations/circular-text):
 * letras distribuídas num círculo que gira devagar. Tamanho, cor e fonte vêm das classes
 * (o original fixava 200px e texto branco). Com "reduzir movimento" ligado, fica parado.
 */
export default function CircularText({
  text,
  spinDuration = 24,
  className = "",
  letterClassName = "",
}: {
  text: string;
  spinDuration?: number;
  className?: string;
  letterClassName?: string;
}) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      transition: { from: start, ease: "linear", duration: spinDuration, repeat: Infinity },
    });
  }, [reduce, spinDuration, controls, rotation]);

  return (
    // Sem "relative" fixo aqui: quem usa define posição e tamanho (ex.: "absolute inset-2"),
    // senão o conflito relative/absolute zera o tamanho e as letras se empilham.
    <motion.div aria-hidden="true" className={`rounded-full ${className}`} style={{ rotate: rotation }} animate={controls}>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`absolute inset-0 text-center ${letterClassName}`}
          style={{ transform: `rotate(${(360 / letters.length) * i}deg)` }}
        >
          {letter}
        </span>
      ))}
    </motion.div>
  );
}
