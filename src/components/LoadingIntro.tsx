import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Abertura animada no After Effects: o halter dourado (Higgsfield/Kling) explode em pó de giz
// enquanto o logo PERSONAL Lindy entra com rastreio cinematográfico, o dourado ganha um reflexo
// de luz e o traço do cabeçalho se desenha. O 1º quadro do vídeo é a capa (poster), então a
// troca capa → vídeo não "pula". Fundo preto, igual ao da página.
const introPoster = "/intro-logo.webp";
const introSources = [
  { src: "/intro-logo.webm", type: "video/webm" },
  { src: "/intro-logo.mp4", type: "video/mp4" },
];
const INTRO_MS = 3300; // o vídeo tem 3,5 s; o logo fica completo a partir de ~2,8 s
const FALLBACK_MS = 900; // se o vídeo não começar até aqui, o logo aparece em texto

/**
 * Tela de abertura cinematográfica (uma vez por sessão, ~3s). Nasce coberta (igual no
 * server e no primeiro paint do cliente) — sem flash de conteúdo. O useEffect decide, no
 * cliente, se anima ou pula direto (sessão já viu / prefers-reduced-motion); só nesse caso
 * a capa e o vídeo são baixados. Clique, toque, Esc ou o botão "Pular" encerram na hora.
 */
export default function LoadingIntro() {
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [fallback, setFallback] = useState(false);

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
    const t = window.setTimeout(() => setShow(false), INTRO_MS);
    const f = window.setTimeout(() => setFallback(true), FALLBACK_MS);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(f);
    };
  }, []);

  useEffect(() => {
    if (!show || instant) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, instant]);

  const showTextLogo = fallback && !videoOn;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: instant ? 0 : 0.6, ease: "easeInOut" }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-background"
        >
          {/* Palco quadrado: capa na hora, vídeo por cima assim que começar a tocar.
              height inline porque a regra global img/video { height: auto } venceria o h-full. */}
          <div className="relative aspect-square w-[min(92vw,560px)] md:w-[min(64vh,600px)]">
            {play && (
              <>
                <img
                  src={introPoster}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full object-contain"
                  style={{ height: "100%" }}
                />
                <video
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onPlaying={() => setVideoOn(true)}
                  className="absolute inset-0 w-full object-contain transition-opacity duration-300"
                  style={{ height: "100%", opacity: videoOn ? 1 : 0 }}
                >
                  {introSources.map((s) => (
                    <source key={s.src} src={s.src} type={s.type} />
                  ))}
                </video>
              </>
            )}

            {/* Reserva: com conexão lenta ou economia de dados o vídeo pode não tocar — o logo
                aparece em texto no mesmo lugar e some se o vídeo começar depois. */}
            <AnimatePresence>
              {showTextLogo && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-3"
                >
                  <span className="flex items-baseline gap-2 text-2xl tracking-widest sm:text-3xl">
                    <span className="font-display uppercase text-foreground">Personal</span>
                    <span className="font-serif-display italic text-gradient-gold">Lindy</span>
                  </span>
                  <span className="h-px w-24 bg-gradient-gold" />
                  <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">
                    Sua transformação começa agora
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barra de "carga" */}
          <div className="relative mt-6 h-1 w-48 max-w-[60vw] overflow-hidden rounded-full bg-dark-elevated">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: INTRO_MS / 1000 - 0.2, ease: "easeInOut" }}
              className="h-full bg-gradient-gold"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
            className="absolute bottom-6 right-6 py-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-gold"
          >
            Pular
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
