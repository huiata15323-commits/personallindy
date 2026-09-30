import { useEffect, useRef, useState } from "react";

const FADE_SECONDS = 0.7;
const START_DELAY_MS = 1200;

type HeroVideoLoopProps = {
  src: string;
  className?: string;
};

/**
 * Fundo "vivo" do Hero: vídeo curto (cabelo, folhas e luz se mexendo) por cima da
 * foto estática. A foto continua embaixo como fallback — se o vídeo não carregar,
 * em reduced-motion ou com economia de dados, o visitante vê o Hero de sempre.
 * O último quadro do vídeo não é igual ao primeiro, então perto do fim ele esmaece
 * de volta pra foto (que é o primeiro quadro) e recomeça: o loop não dá "pulo".
 */
export default function HeroVideoLoop({ src, className = "" }: HeroVideoLoopProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (!reduced && !saveData) setEnabled(true);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!enabled || !video) return;

    const play = () => void video.play().catch(() => {});
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime > video.duration - FADE_SECONDS) setVisible(false);
    };
    const onEnded = () => {
      video.currentTime = 0;
      play();
    };
    const onPlaying = () => setVisible(true);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("playing", onPlaying);

    // Pausa fora da tela (poupa bateria/CPU) e retoma ao voltar pro topo.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else video.pause();
    });
    // Espera a foto terminar de revelar antes de o vídeo assumir.
    const timer = window.setTimeout(() => observer.observe(video), START_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("playing", onPlaying);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_SECONDS}s ease` }}
    />
  );
}
