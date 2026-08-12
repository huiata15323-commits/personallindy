import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell } from "./FitIcons";

/** Explosão de partículas douradas sincronizada com o "levantamento". */
const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const dist = 100 + (i % 4) * 26;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    delay: 0.55 + (i % 5) * 0.03,
    size: 4 + (i % 3) * 2,
  };
});

/**
 * Tela de abertura cinematográfica (uma vez por sessão, ~3s): halter fazendo
 * "reps" + anéis de energia + partículas + logo + frase, estilo treino.
 * Nasce coberta (igual no server e no primeiro paint do cliente) — sem flash
 * de conteúdo. O useEffect decide, no cliente, se anima ou pula direto
 * (sessão já viu / prefers-reduced-motion).
 */
export default function LoadingIntro() {
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("pl-intro-shown");
    if (reduced || seen) {
      setInstant(true);
      setShow(false);
      return;
    }
    sessionStorage.setItem("pl-intro-shown", "1");
    const t = window.setTimeout(() => setShow(false), 2500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: instant ? 0 : 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background"
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
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}
            className="absolute h-44 w-44 rounded-full border-2 border-gold"
          />
          <motion.div
            initial={{ scale: 0.3, opacity: 0.7 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.3, delay: 0.55, ease: "easeOut" }}
            className="absolute h-44 w-44 rounded-full border border-gold/60"
          />

          {/* Halter fazendo "reps" — estilo treino */}
          <motion.div
            initial={{ rotate: -25, y: 24, opacity: 0, scale: 0.6 }}
            animate={{
              rotate: [-25, 14, -8, 18, 0],
              y: [24, -6, 3, -5, 0],
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 1.5, times: [0, 0.3, 0.5, 0.75, 1], ease: "easeInOut" }}
            className="relative text-gold"
            style={{ filter: "drop-shadow(0 0 18px var(--color-gold))" }}
          >
            <Dumbbell size={72} />
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <span className="flex items-baseline gap-2 text-2xl sm:text-3xl tracking-widest">
              <span className="font-display uppercase text-foreground">Personal</span>
              <span className="font-serif-display italic text-gradient-gold">Lindy</span>
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-24 origin-center bg-gradient-gold"
            />
          </motion.div>

          {/* Frase de treino */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-4 text-xs sm:text-sm uppercase tracking-[0.35em] text-muted-foreground"
          >
            Sua transformação começa agora
          </motion.p>

          {/* Barra de "carga" */}
          <div className="relative mt-8 h-1.5 w-56 max-w-[60vw] overflow-hidden rounded-full bg-dark-elevated">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
              className="h-full bg-gradient-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
