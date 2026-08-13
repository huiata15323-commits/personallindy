import { motion } from "framer-motion";

/** Estouro de partículas douradas — momento de deleite ao clicar no CTA. */
const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 2) * 0.2;
  const dist = 58 + (i % 4) * 26;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 7 + (i % 3) * 4,
    delay: (i % 5) * 0.012,
  };
});

export default function GoldBurst({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="pointer-events-none fixed z-[120]"
      style={{ left: x, top: y }}
      aria-hidden="true"
    >
      {/* clarão central que aparece e some */}
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(240,205,120,0.9), rgba(212,175,55,0) 70%)" }}
        initial={{ width: 20, height: 20, opacity: 0.9 }}
        animate={{ width: 120, height: 120, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* anel de energia que expande */}
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/80"
        initial={{ width: 6, height: 6, opacity: 0.85 }}
        animate={{ width: 160, height: 160, opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      />
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: "radial-gradient(circle, var(--color-gold-light), var(--color-gold))",
            boxShadow: "0 0 10px rgba(240,205,120,0.95)",
          }}
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0.2, 1.25, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.8, delay: p.delay, times: [0, 0.28, 1], ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}
