import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Halter real (foto gerada no Higgsfield) e o vídeo dele girando enquanto o pó de giz
// dourado explode atrás (Kling, a partir da mesma foto — o 1º quadro é idêntico à foto,
// então a troca foto → vídeo não "pula").
const introPhoto = "/intro-halter.webp";
const introVideo = "/intro-halter.mp4";

/**
 * Tela de abertura cinematográfica (uma vez por sessão, ~3s): halter real com giz
 * dourado + logo + frase, estilo treino. Nasce coberta (igual no server e no primeiro
 * paint do cliente) — sem flash de conteúdo. O useEffect decide, no cliente, se anima
 * ou pula direto (sessão já viu / prefers-reduced-motion); só nesse caso a foto e o
 * vídeo são baixados.
 */
export default function LoadingIntro() {
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("pl-intro-shown");
    if (reduced || seen) {
      setInstant(true);
      setShow(false);
      return;
    }
    sessionStorage.setItem("pl-intro-shown", "1");
    setPlay(true);
    const t = window.setTimeout(() => setShow(false), 3000);
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
          {/* Palco do halter: foto na hora, vídeo por cima assim que começar a tocar */}
          <div className="intro-stage relative aspect-square w-[min(78vw,380px)] md:w-[min(52vh,480px)]">
            {play && (
              <>
                <motion.img
                  src={introPhoto}
                  alt=""
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                    y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <video
                  src={introVideo}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onPlaying={() => setVideoOn(true)}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
                  style={{ opacity: videoOn ? 1 : 0 }}
                />
              </>
            )}
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="-mt-4 flex flex-col items-center gap-3"
          >
            <span className="flex items-baseline gap-2 text-2xl sm:text-3xl tracking-widest">
              <span className="font-display uppercase text-foreground">Personal</span>
              <span className="font-serif-display italic text-gradient-gold">Lindy</span>
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-24 origin-center bg-gradient-gold"
            />
          </motion.div>

          {/* Frase de treino */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-4 text-xs sm:text-sm uppercase tracking-[0.35em] text-muted-foreground"
          >
            Sua transformação começa agora
          </motion.p>

          {/* Barra de "carga" */}
          <div className="relative mt-8 h-1.5 w-56 max-w-[60vw] overflow-hidden rounded-full bg-dark-elevated">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
              className="h-full bg-gradient-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
