import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import Tilt3D from "./Tilt3D";

/**
 * Bloco "bastidores": vídeo autêntico da Lindy treinando (clique para assistir).
 * Humaniza a marca. O vídeo só baixa quando o visitante clica (preload none no
 * card estático — só a capa/poster carrega antes), preservando a performance.
 */
export default function AuthenticVideo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Parallax na capa (mesma linguagem da foto "Sobre") — só antes de dar play.
  // Valores em PIXELS, não porcentagem: translateY percentual dentro de um
  // ancestral com transform ativo (o Tilt3D, sempre transformado, mesmo em
  // repouso) resolve pra 0 no WebKit/Safari — bug de resolução de %.
  const { scrollYProgress: posterProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smoothPosterProgress = useSpring(posterProgress, { stiffness: 100, damping: 30, mass: 0.4 });
  const posterY = useTransform(smoothPosterProgress, [0, 1], [-22, 22]);

  return (
    <section id="video" className="py-20 md:py-28 px-4 sm:px-6">
      <div ref={ref} className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">
            <span className="mr-2 text-gold/50">02</span>Bastidores
          </span>
          <h2 className="title-sheen font-serif-display text-3xl sm:text-4xl md:text-5xl text-foreground mt-2 mb-4 leading-[1.1]">
            Treino é vida — e a minha <span className="text-gradient-gold italic">maior torcedora</span> tá sempre por perto
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Mais que personal, sou mãe. Acredito num acompanhamento humano, real e acolhedor —
            do jeitinho que você merece no seu processo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[300px]"
        >
          <Tilt3D
            max={0}
            scale={1.01}
            className="relative rounded-2xl overflow-hidden border-gold-subtle bg-dark-surface aspect-[9/16] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85)]"
          >
            {playing ? (
              <>
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster="/lindy-treino-capa.jpg"
                >
                  <source src="/lindy-treino.mp4" type="video/mp4" />
                </video>
                {/* Cortina dourada: desliza revelando o vídeo em vez de um corte seco */}
                <motion.div
                  initial={{ x: "0%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.05, ease: [0.76, 0, 0.24, 1] }}
                  className="bg-gradient-gold pointer-events-none absolute inset-0 z-10"
                  aria-hidden="true"
                />
              </>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Assistir ao vídeo da Lindy treinando"
              >
                <motion.div style={{ y: posterY, scale: 1.08 }} className="h-full w-full">
                  <img
                    src="/lindy-treino-capa.jpg"
                    alt="Lindy treinando, com a filha por perto"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </motion.div>
                <span className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 animate-ember">
                    <Play size={26} className="ml-1" fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </Tilt3D>
        </motion.div>
      </div>
    </section>
  );
}
