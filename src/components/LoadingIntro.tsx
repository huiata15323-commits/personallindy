import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Tela de abertura breve (uma vez por sessão): o wordmark se desenha e some.
 * Renderiza null no server e na primeira pintura no cliente (sem flash/hydration
 * mismatch) — só aparece via useEffect, e nunca para quem prefere menos movimento.
 */
export default function LoadingIntro() {
  // Nasce coberta (igual no server e no primeiro paint do cliente) — sem
  // flash de conteúdo. O useEffect decide, no cliente, se anima ou some.
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
    const t = window.setTimeout(() => setShow(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: instant ? 0 : 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <span className="flex items-baseline gap-2 text-2xl sm:text-3xl tracking-widest">
              <span className="font-display uppercase text-foreground">Personal</span>
              <span className="font-serif-display italic text-gradient-gold">Lindy</span>
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-24 origin-center bg-gradient-gold"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
