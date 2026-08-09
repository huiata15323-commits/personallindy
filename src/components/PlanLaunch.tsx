import { motion } from "framer-motion";
import { Dumbbell, MessageCircle } from "lucide-react";

/** Explosão de partículas douradas a partir do centro. */
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 90 + (i % 4) * 30;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    delay: 0.05 + (i % 5) * 0.03,
    size: 4 + (i % 3) * 2,
  };
});

export default function PlanLaunch({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-6 text-center"
    >
      {/* Partículas douradas */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0, 1, 0.3] }}
          transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 rounded-full bg-gold"
          style={{ width: p.size, height: p.size, boxShadow: "0 0 8px var(--color-gold)" }}
        />
      ))}

      {/* Anéis de energia */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute h-40 w-40 rounded-full border-2 border-gold"
      />
      <motion.div
        initial={{ scale: 0.4, opacity: 0.7 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.18, ease: "easeOut" }}
        className="absolute h-40 w-40 rounded-full border border-gold/60"
      />

      {/* Halter levantando com brilho */}
      <motion.div
        initial={{ y: 28, rotate: -12, opacity: 0, scale: 0.8 }}
        animate={{ y: [28, -10, 0], rotate: [-12, 6, 0], opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-gold"
        style={{ filter: "drop-shadow(0 0 14px var(--color-gold))" }}
      >
        <Dumbbell size={64} strokeWidth={1.5} />
      </motion.div>

      {/* Barra de "carga" */}
      <div className="relative mt-8 h-1.5 w-56 max-w-[70vw] overflow-hidden rounded-full bg-dark-elevated">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
          className="h-full bg-gradient-gold"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="font-serif-display mt-6 text-2xl md:text-3xl text-foreground"
      >
        Bora <span className="text-gradient-gold italic">treinar</span>!
      </motion.p>

      {/* Selo "abrindo WhatsApp" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-3 inline-flex items-center gap-2 rounded-full border-gold-subtle bg-dark-surface px-4 py-2 text-sm text-muted-foreground"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle size={16} className="text-gold" />
        </motion.span>
        {label}
      </motion.div>
    </motion.div>
  );
}
