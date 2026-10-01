import { useEffect, useRef, useState } from "react";

const FADE_SECONDS = 0.7;
const START_DELAY_MS = 1200;

type LoopVideoProps = {
  src: string;
  className?: string;
  /** "auto" pro Hero (aparece de cara); "none" pros vídeos do meio da página,
   *  que só baixam quando o visitante chega perto deles. */
  preload?: "auto" | "none";
};

/**
 * Vídeo curto, mudo e em loop por cima de uma foto estática (o "poster", que é o
 * primeiro quadro). A foto fica embaixo como fallback — se o vídeo não carregar,
 * em reduced-motion ou com economia de dados, o visitante vê só a foto.
 * Quando o último quadro não é igual ao primeiro, o vídeo esmaece de volta pra
 * foto perto do fim e recomeça: o loop não dá "pulo". Pausa fora da tela.
 */
export default function LoopVideo({ src, className = "", preload = "auto" }: LoopVideoProps) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "120px 0px" },
    );
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
      preload={preload}
      aria-hidden="true"
      tabIndex={-1}
      className={className}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_SECONDS}s ease` }}
    />
  );
}
