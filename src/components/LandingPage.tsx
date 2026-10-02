import { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import {
  MessageCircle,
  Flame,
  Star,
  Phone,
  Instagram,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import * as Fit from "./FitIcons";
// Imagens otimizadas (WebP) servidas de /public — funcionam em qualquer host (Vercel etc.)
// sem depender do proxy de assets do Lovable. Mesma imagem, ~95% mais leve.
const heroBg = { url: "/hero-coach.webp" };
const heroLoop = { url: "/hero-coach-loop.mp4" };
const lindyProfile = { url: "/about-coach.webp" };
import RevealImage from "./RevealImage";
import LoopVideo from "./LoopVideo";
import Tilt3D from "./Tilt3D";
import WordReveal from "./WordReveal";
import CountUp from "./CountUp";
import GoldCursor from "./GoldCursor";
import GoldParticles from "./GoldParticles";
import GoldDivider from "./GoldDivider";
import FAQ from "./FAQ";
import PlanLaunch from "./PlanLaunch";
import MobileCTA from "./MobileCTA";
import Magnetic from "./Magnetic";
import GoldBurst from "./GoldBurst";
import GlassIcon from "./GlassIcon";
import RotatingText from "./RotatingText";
import CircularText from "./CircularText";
import AuthenticVideo from "./AuthenticVideo";
import Marquee from "./Marquee";
import WhatsAppFab from "./WhatsAppFab";
import SectionDots from "./SectionDots";
import LoadingIntro from "./LoadingIntro";
import BackToTop from "./BackToTop";
import TabTitleSwitcher from "./TabTitleSwitcher";
import { useSheenVisible } from "../hooks/use-sheen-visible";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

// Entrada com profundidade real (perspectiva + Z/scale + leve rotateX)
const depthIn: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    z: -120,
    scale: 0.96,
    rotateX: 8,
    filter: "blur(10px)",
    transformPerspective: 1000,
  },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transformPerspective: 1000,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function WhatsAppButton({
  children,
  className = "",
  large = false,
  message = "Olá Lindy! Quero começar minha transformação.",
  launchLabel,
}: {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
  message?: string;
  launchLabel?: string;
}) {
  const encoded = encodeURIComponent(message);
  const href = `https://wa.me/5562984811499?text=${encoded}`;
  const [launching, setLaunching] = useState(false);
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Tilt 3D sutil nos botões grandes (desktop, ponteiro fino, sem reduced-motion)
  const handleTiltMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!large) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 80ms ease-out";
    el.style.transform = `perspective(500px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
  };
  const handleTiltLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "";
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (launching) return;

    if (!launchLabel) {
      // Micro-celebração: estouro de partículas douradas no ponto do clique.
      // Só aqui — nos botões com takeover (launchLabel) a tela "Bora treinar!"
      // já é a celebração e cobriria o burst.
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const id = Date.now();
        setBurst({ id, x: e.clientX, y: e.clientY });
        window.setTimeout(() => setBurst((b) => (b?.id === id ? null : b)), 850);
      }
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([20, 45, 30]);

    // Force the launch screen into the DOM before starting the redirect timer.
    // This avoids the native link navigation winning the race on touch browsers.
    flushSync(() => setLaunching(true));
    window.setTimeout(() => {
      window.location.assign(href);
    }, 1600);
  };

  return (
    <>
    <Magnetic>
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      disabled={launching}
      aria-label={launchLabel ? `${children?.toString() ?? "Escolher plano"}: ${launchLabel}` : undefined}
      className={`
        btn-shine inline-flex items-center justify-center gap-2
        bg-primary text-primary-foreground
        font-semibold tracking-wide uppercase
        transition-all duration-300
        hover:brightness-110 hover:scale-[1.02]
        active:scale-[0.98]
        disabled:pointer-events-none
        ${large ? "px-6 py-4 text-base sm:px-8 sm:text-lg rounded-xl animate-ember whitespace-nowrap" : "px-6 py-3 text-sm rounded-lg"}
        ${className}
      `}
    >
      {children}
    </button>
    </Magnetic>
    {typeof document !== "undefined"
      ? createPortal(
          <>
            <AnimatePresence>
              {launching && launchLabel ? <PlanLaunch label={launchLabel} /> : null}
            </AnimatePresence>
            {burst ? <GoldBurst key={burst.id} x={burst.x} y={burst.y} /> : null}
          </>,
          document.body,
        )
      : null}
    </>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
        scrolled ? "bg-background/90 border-border shadow-[0_8px_30px_-15px_rgba(0,0,0,0.9)]" : "bg-background/60 border-border/40"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-500 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <a href="#top" className="relative text-xl sm:text-2xl text-foreground tracking-widest flex items-baseline gap-2">
          <span className="font-display uppercase">Personal</span>
          <span className="font-serif-display italic text-gradient-gold text-2xl sm:text-3xl">Lindy</span>
          <svg
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -bottom-0.5 left-0 h-2 w-full overflow-visible"
            aria-hidden="true"
          >
            <motion.path
              d="M2 7 Q 25 2, 50 5 T 98 3"
              fill="none"
              stroke="url(#logoFlourish)"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="logoFlourish" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-gold-dark)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-gold)" />
                <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </a>
        <Magnetic strength={0.2}>
          <a
            href="https://wa.me/5562984811499?text=Olá%20Lindy!%20Quero%20começar%20minha%20transformação."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex h-10 items-center gap-2 bg-primary text-primary-foreground px-4 sm:h-auto sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            <span className="hidden xs:inline sm:inline">WhatsApp</span>
          </a>
        </Magnetic>
      </div>
      <motion.div
        style={{ scaleX: progress }}
        className="origin-left h-[3px] w-full bg-gradient-gold shadow-[0_0_12px_rgba(212,175,55,0.65)]"
      />
    </header>
  );
}

function SectionHeading({ number, title, subtitle }: { number?: string; title: string; subtitle?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const sheen = useSheenVisible<HTMLHeadingElement>();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="text-center mb-12 md:mb-16"
    >
      {number && (
        <span className="mb-3 block font-display text-xs md:text-sm tracking-[0.5em] text-gold/80">
          {number}
        </span>
      )}
      <h2
        ref={sheen.ref}
        className={`title-sheen font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] ${sheen.visible ? "sheen-visible" : ""}`}
      >
        <WordReveal text={title} />
      </h2>
      <div className="divider-gold w-24 mx-auto mt-5" />
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// Objetivos que giram no subtítulo do topo (os mesmos públicos da seção "Para Quem é").
// O primeiro repete a frase original, então o HTML inicial continua igual ao de antes.
const heroGoals = [
  "conquistar resultados reais.",
  "emagrecer com saúde.",
  "ganhar massa muscular.",
  "sair do zero com segurança.",
  "ter constância nos treinos.",
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });
  const bgY = useTransform(smooth, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(smooth, [0, 1], [1, 1.08]);
  // Profundidade 3D sutil: o fundo recua no eixo Z e inclina levemente ao rolar.
  const bgZ = useTransform(smooth, [0, 1], [0, -140]);
  const bgRotateX = useTransform(smooth, [0, 1], [0, 4]);
  const overlayOpacity = useTransform(smooth, [0, 1], [1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100svh-4rem)] flex items-center justify-center lg:justify-start overflow-hidden"
      style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
    >
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
          z: bgZ,
          rotateX: bgRotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {/* Câmera cinematográfica: zoom + pan lento e contínuo (Ken Burns) */}
        <div className="hero-kenburns absolute inset-0 will-change-transform">
          <RevealImage
            src={heroBg.url}
            alt="Treino na academia"
            className="w-full h-full object-cover object-top"
          />
          <LoopVideo src={heroLoop.url} className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-hero-overlay hero-overlay" />
      </motion.div>

      <GoldParticles />

      {/* Aurora/luz ambiente dourada atrás do título */}
      <div className="pointer-events-none absolute inset-0 z-[1] hero-glow" aria-hidden="true" />

      {/* Vinheta cinematográfica: escurece as bordas e puxa o olhar pro centro */}
      <div className="pointer-events-none absolute inset-0 z-[2] hero-vignette" aria-hidden="true" />
      {/* Grão de filme sutil, dando textura de cinema */}
      <div className="pointer-events-none absolute inset-0 z-[2] hero-grain" aria-hidden="true" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 text-center md:pt-0 lg:mx-0 lg:ml-[calc(max(0px,(100vw_-_72rem)/2)_+_1.5rem)] lg:max-w-[38rem] lg:px-0 lg:text-left xl:max-w-[46rem] 2xl:max-w-[54rem]"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-gold-subtle bg-background/40 backdrop-blur-sm text-gold text-sm font-medium tracking-wide uppercase">
            <Flame size={16} className="flame-flicker text-ember" />
            Personal Trainer Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[min(6.5rem,11.5vh)] xl:text-[min(8rem,12.5vh)] text-foreground leading-[1.05] sm:leading-[0.95] break-words"
        >
          Transforme seu corpo com a{" "}
          <span className="text-gradient-gold italic">Personal Lindy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hero-sub mt-6 md:mt-8 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed lg:mx-0 lg:max-w-xl"
        >
          Treinos personalizados e acompanhamento direto para você
          {/* Linha própria e altura fixa: a troca de frase não empurra o botão abaixo */}
          <span className="mt-1 flex h-[1.6em] justify-center lg:justify-start">
            <RotatingText
              texts={heroGoals}
              auto={!reduceMotion}
              rotationInterval={2600}
              staggerFrom="last"
              staggerDuration={0.015}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              mainClassName="overflow-hidden font-semibold text-gold"
              splitLevelClassName="overflow-hidden pb-0.5"
            />
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 md:mt-10"
        >
          <WhatsAppButton large launchLabel="Abrindo o WhatsApp da Lindy...">
            Começar agora
            <ArrowRight size={20} />
          </WhatsAppButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground lg:justify-start"
        >
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold" /> Suporte direto</span>
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold" /> 100% online</span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        aria-label="Rolar para a próxima seção"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="hero-scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Role</span>
        <span className="relative h-10 w-6 rounded-full border border-gold/50 overflow-hidden">
          <motion.span
            animate={{ y: [4, 18, 4], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 h-2 w-1 rounded-full bg-gold"
          />
        </span>
      </motion.a>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const sheen = useSheenVisible<HTMLHeadingElement>();

  // Parallax: a foto desliza dentro da moldura fixa enquanto rola (a moldura,
  // vinheta e cantos ficam parados — só a imagem se move, por isso o scale
  // extra, pra nunca revelar borda vazia). Valores em PIXELS, não porcentagem:
  // translateY percentual dentro de um ancestral com transform ativo (o
  // Tilt3D, sempre transformado, mesmo em repouso) resolve pra 0 no
  // WebKit/Safari — bug de resolução de %, confirmado testando o motor real.
  const { scrollYProgress: photoProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smoothPhotoProgress = useSpring(photoProgress, { stiffness: 100, damping: 30, mass: 0.4 });
  const photoY = useTransform(smoothPhotoProgress, [0, 1], [-28, 28]);

  return (
    <section id="sobre" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Tilt3D max={10} className="relative overflow-hidden rounded-2xl border-gold-subtle shadow-[0_0_60px_-18px_oklch(0.72_0.12_85_/_0.5)]">
              <motion.div style={{ y: photoY, scale: 1.1 }}>
                <RevealImage
                  src={lindyProfile.url}
                  alt="Lindyara Ribeiro - Personal Trainer"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              {/* Vinheta sutil — mesma direção fotográfica do Hero, dá unidade à página */}
              <div className="pointer-events-none absolute inset-0 about-vignette" aria-hidden="true" />
              {/* Moldura editorial: cantos dourados */}
              <span className="pointer-events-none absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-gold/70" />
              <span className="pointer-events-none absolute right-3 top-3 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-gold/70" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-gold/70" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-gold/70" />
            </Tilt3D>
            {/* Selo giratório (Circular Text do React Bits) com a credencial dela sobre a foto */}
            <div className="pointer-events-none absolute -bottom-10 right-3 z-10 md:-right-8">
              <div className="relative grid h-28 w-28 place-items-center rounded-full border border-gold/40 bg-background/80 shadow-[0_0_30px_-8px_oklch(0.72_0.12_85_/_0.6)] backdrop-blur-sm md:h-32 md:w-32">
                <CircularText
                  text="PERSONAL TRAINER • CREF 010437/GO • "
                  className="absolute inset-2.5"
                  letterClassName="font-display text-[11px] leading-none tracking-wider text-gold md:text-xs"
                />
                <Fit.Medal size={26} className="text-gold" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              <span className="mr-2 text-gold/80">01</span>Sobre a Personal
            </span>
            <h2
              ref={sheen.ref}
              className={`title-sheen font-serif-display text-4xl sm:text-5xl md:text-6xl text-foreground mt-2 mb-6 leading-[1.1] ${sheen.visible ? "sheen-visible" : ""}`}
            >
              Lindyara <span className="text-gradient-gold italic">Ribeiro</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              Atuo há mais de 9 anos no mercado fitness, ajudando pessoas a conquistarem saúde, qualidade de vida e resultados reais por meio de um treinamento físico estratégico e personalizado.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              Sou especializada em Treinamento para Grupos Especiais, com capacitação para atender gestantes, idosos, pessoas com patologias e outros perfis que exigem um acompanhamento individualizado, seguro e eficiente.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              Ao longo da minha trajetória, também me especializei em emagrecimento, hipertrofia e recomposição corporal. Acredito que a atualização constante é essencial para entregar um atendimento de excelência, baseado em conhecimento técnico, estratégia e eficiência.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              Meu objetivo é proporcionar os melhores resultados no menor tempo possível, sempre respeitando a individualidade, os limites e as metas de cada aluno.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="pulse-badge text-center p-3 rounded-lg bg-dark-surface border-gold-subtle">
                <ShieldCheck size={20} className="text-gold mx-auto mb-1" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">CREF 010437/GO</p>
              </div>
              <div className="pulse-badge text-center p-3 rounded-lg bg-dark-surface border-gold-subtle">
                <Zap size={20} className="text-gold mx-auto mb-1" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  <CountUp to={9} suffix="+" className="text-ember font-bold" /> anos
                </p>
              </div>
            </div>
            <WhatsAppButton>
              Quero treinar com a Lindy
              <ArrowRight size={18} />
            </WhatsAppButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { icon: Fit.Target, title: "Avaliação Inicial", desc: "Análise completa do seu perfil, objetivos e condicionamento físico atual." },
    { icon: Fit.Dumbbell, title: "Treino Exclusivo", desc: "Montagem de um programa de treino 100% personalizado para o seu corpo." },
    { icon: Fit.Heartbeat, title: "Acompanhamento Contínuo", desc: "Suporte direto via WhatsApp para tirar dúvidas e manter a motivação." },
    { icon: Fit.BarsUp, title: "Ajustes e Evolução", desc: "Reavaliações periódicas e adaptações conforme sua evolução." },
  ];

  return (
    <section id="como-funciona" className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          number="03"
          title="Como Funciona"
          subtitle="Um processo simples e estratégico para você alcançar seus objetivos de forma definitiva."
        />

        <div className="relative">
          <motion.span
            aria-hidden="true"
            className="hidden lg:block absolute top-[68px] left-[12%] right-[12%] h-px origin-left bg-gradient-to-r from-transparent via-gold/45 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
          {steps.map((step, i) => (
            <motion.div key={i} variants={depthIn} style={{ transformStyle: "preserve-3d" }} className="h-full">
              <Tilt3D
                max={7}
                className="group relative h-full p-6 md:p-8 rounded-2xl bg-dark-elevated border-gold-subtle hover:border-gold/40"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold z-10">
                  {i + 1}
                </div>
                <GlassIcon className="mb-6 text-[16px]">
                  <step.icon />
                </GlassIcon>
                <h3 className="text-xl text-foreground uppercase tracking-wide mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </Tilt3D>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type PracticeItem = {
  poster: string;
  video?: string;
  alt: string;
  aspect: string;
  label?: string;
};

const practiceItems: PracticeItem[] = [
  { poster: "/pratica-1.webp", video: "/pratica-1-loop.mp4", alt: "Lindy na academia, pronta pro treino", aspect: "aspect-[3/4]" },
  {
    poster: "/pratica-treino-capa.webp",
    video: "/pratica-treino.mp4",
    alt: "Lindy fazendo elevação de quadril na academia",
    aspect: "aspect-[9/16]",
    label: "Treino real",
  },
  { poster: "/pratica-2.webp", alt: "Lindy na academia, mostrando o resultado do treino", aspect: "aspect-[3/4]" },
];

function InPractice() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="na-pratica" className="py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          number="04"
          title="Na Prática"
          subtitle="Cada treino que eu passo, eu vivo na pele. Um pouco da minha rotina na academia."
        />

        {/* Mobile: carrossel de arrastar (sem empilhar 3 fotos altas). Desktop: mosaico
            com o vídeo no centro, mais alto — dá hierarquia sem precisar de legenda. */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="-mx-4 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
        >
          {practiceItems.map((item) => (
            <motion.div
              key={item.poster}
              variants={depthIn}
              style={{ transformStyle: "preserve-3d" }}
              className="w-[72vw] max-w-[320px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <Tilt3D
                max={7}
                className={`group relative overflow-hidden rounded-2xl border-gold-subtle bg-dark-surface shadow-[0_0_60px_-22px_oklch(0.72_0.12_85_/_0.5)] ${item.aspect}`}
              >
                <div className="grade-gold absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                  <img src={item.poster} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
                  {item.video && (
                    <LoopVideo src={item.video} preload="none" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 about-vignette" aria-hidden="true" />
                <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-gold/70" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-gold/70" />
                {item.label && (
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border-gold-subtle bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ember)] animate-pulse" aria-hidden="true" />
                    {item.label}
                  </span>
                )}
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-4 text-center text-xs uppercase tracking-widest text-muted-foreground md:hidden" aria-hidden="true">
          Arraste para o lado →
        </p>
      </div>
    </section>
  );
}

function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const benefits = [
    { icon: Fit.Kettlebell, title: "Treino 100% Personalizado", desc: "Criado exclusivamente para o seu corpo, seus objetivos e sua rotina." },
    { icon: Fit.People, title: "Suporte Direto Comigo", desc: "Atendimento próximo e humanizado pelo WhatsApp para dúvidas e motivação." },
    { icon: Fit.Stopwatch, title: "Flexibilidade de Horários", desc: "Treine no momento que for melhor para você, sem depender de agenda fixa." },
    { icon: Fit.Pin, title: "Treine em Qualquer Lugar", desc: "Programas adaptados para academia, casa, parque ou viagem." },
    { icon: Fit.Medal, title: "Resultados Reais e Consistentes", desc: "Metodologia comprovada que entrega transformação de verdade." },
  ];

  return (
    <section id="beneficios" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          number="05"
          title="Benefícios"
          subtitle="O que você ganha ao treinar com acompanhamento profissional da Personal Lindy."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {/* 5 itens: grade de 6 colunas (2 por card) para a última linha ficar centralizada
              em vez de deixar um buraco à direita; no tablet o último card fica no meio. */}
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={depthIn}
              style={{ transformStyle: "preserve-3d" }}
              className={`h-full lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${
                i === benefits.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:mx-0 lg:w-auto" : ""
              }`}
            >
              <Tilt3D
                max={7}
                className="h-full p-6 md:p-8 rounded-2xl bg-dark-surface border-gold-subtle hover:bg-dark-elevated group"
              >
                <GlassIcon className="mb-6 text-[13px]">
                  <b.icon />
                </GlassIcon>
                <h3 className="text-xl text-foreground uppercase tracking-wide mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ForWho() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const audiences = [
    { label: "Iniciantes", desc: "Nunca treinou? Vou te guiar do zero com segurança e confiança." },
    { label: "Quem não consegue resultados", desc: "Cansado de treinar sem evoluir? A estratégia certa muda tudo." },
    { label: "Quem quer emagrecer", desc: "Programa focado em queima de gordura com saúde e sustentabilidade." },
    { label: "Quem quer ganhar massa", desc: "Treinos de hipertrofia inteligente para ganho muscular eficiente." },
    { label: "Quem busca disciplina", desc: "Acompanhamento que te mantém focado e consistente no dia a dia." },
  ];

  return (
    <section id="para-quem" className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          number="06"
          title="Para Quem é"
          subtitle="Seja qual for o seu nível ou objetivo, existe um caminho para você."
        />

        {/* Lista editorial (sem cards nem ícones): quebra a repetição das grades das
            seções anteriores e fica mais rápida de ler no celular. O losango é o
            mesmo dos divisores dourados da página. */}
        <motion.ul
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid border-t border-gold/15 md:grid-cols-2 md:gap-x-14"
        >
          {audiences.map((a) => (
            <motion.li
              key={a.label}
              variants={fadeInUp}
              className="group flex items-start gap-4 border-b border-gold/15 py-5 md:py-6 md:last:col-span-2"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-2.5 w-2.5 shrink-0 rotate-45 bg-gradient-gold shadow-[0_0_12px_oklch(0.72_0.12_85_/_0.5)] transition-transform duration-300 group-hover:scale-125"
              />
              <div>
                <h3 className="text-lg md:text-xl text-foreground uppercase tracking-wide transition-colors group-hover:text-gold">
                  {a.label}
                </h3>
                <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function Plans() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const plans = [
    {
      name: "Mensal",
      price: "R$ 100",
      priceNum: 100,
      pricePrefix: "R$ ",
      period: "/mês",
      highlight: false,
      ctaMessage:
        "Olá Lindy! 💪 Quero começar com o *Plano MENSAL* (R$ 100/mês). Como faço para iniciar?",
      features: [
        "Treino 100% personalizado",
        "Suporte direto pelo WhatsApp",
        "Reavaliação mensal",
        "Ajustes ilimitados",
      ],
    },
    {
      name: "Trimestral",
      // Preço mensal em destaque para comparar direto com o Mensal; o parcelamento vem logo abaixo.
      price: "R$ 95",
      priceNum: 95,
      pricePrefix: "R$ ",
      period: "/mês",
      billing: "3x de R$ 95 · 90 dias de acompanhamento",
      badge: "Mais escolhido",
      save: "Economize R$ 15 no período",
      highlight: true,
      ctaMessage:
        "Olá Lindy! 💪 Quero começar com o *Plano TRIMESTRAL* (3x R$ 95 - 90 dias). Como faço para iniciar?",
      features: [
        "Consultoria online individualizada",
        "Suporte direto pelo WhatsApp",
        "Reavaliações periódicas",
        "Acesso à ficha por 90 dias",
        "Treinos atualizados na plataforma",
      ],
    },
  ];

  return (
    <section id="planos" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          number="07"
          title="Investimento"
          subtitle="Escolha o plano que mais combina com o seu momento. Todos com acompanhamento direto comigo."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 gap-6"
        >
          {plans.map((p, i) => (
            <motion.div key={i} variants={depthIn} style={{ transformStyle: "preserve-3d" }} className="h-full">
              <Tilt3D
                max={6}
                className={`relative h-full p-6 md:p-8 rounded-2xl flex flex-col ${
                p.highlight
                  ? "plan-glow-border bg-dark-elevated shadow-[0_0_40px_-10px_var(--color-gold)]"
                  : "bg-dark-surface border-gold-subtle"
              }`}
              >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </span>
              )}
              <h3 className="text-2xl text-foreground uppercase tracking-wide">{p.name}</h3>
              <div className="mt-4 mb-2 flex items-baseline gap-1">
                <CountUp
                  to={p.priceNum}
                  prefix={p.pricePrefix}
                  duration={1200}
                  className="text-4xl md:text-5xl font-bold text-gradient-gold"
                />
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              {p.billing && <p className="-mt-1 mb-3 text-xs text-muted-foreground">{p.billing}</p>}
              {p.save ? (
                <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  <Check size={13} /> {p.save}
                </span>
              ) : (
                <div className="mb-5" />
              )}
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-gold mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <WhatsAppButton
                className="w-full"
                message={p.ctaMessage}
                launchLabel={`Plano ${p.name} — abrindo o WhatsApp da Lindy...`}
              >
                Quero esse plano
                <ArrowRight size={16} />
              </WhatsAppButton>
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          A partir de <span className="text-gold font-semibold">R$ 95/mês</span> no plano trimestral. Condições confirmadas direto pelo WhatsApp, com resposta em até 24h.
        </p>
      </div>
    </section>
  );
}

// CTA final: fundo em vídeo (feixe de luz dourada com poeira de giz, gerado no Higgsfield)
// e efeito de profundidade estilo capa de revista: o nome gigante fica atrás da Lindy.
const ctaBg = { poster: "/cta-bg.webp", video: "/cta-bg.mp4" };
const ctaCutout = "/lindy-cutout.webp";

function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const sheen = useSheenVisible<HTMLHeadingElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Na rolagem o nome anda mais devagar que a Lindy, o que reforça a sensação de camadas.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-24, 24]);
  const cutoutY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [16, -16]);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center px-8 pb-8 md:px-12 md:pb-12 lg:px-16 lg:pb-16 rounded-3xl bg-dark-elevated border-gold-subtle relative overflow-hidden"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <img src={ctaBg.poster} alt="" loading="lazy" className="cta-bg-media grade-gold" />
            <LoopVideo src={ctaBg.video} preload="none" className="cta-bg-media grade-gold" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-elevated/20 via-dark-elevated/55 to-dark-elevated" />
          </div>
          <GoldParticles count={12} />
          <div
            ref={stageRef}
            aria-hidden="true"
            className="relative -mx-8 h-[300px] select-none sm:h-[360px] md:-mx-12 md:h-[440px] lg:-mx-16"
          >
            <motion.span style={{ y: wordY }} className="cta-word absolute inset-x-0 top-[6%] block font-display text-gradient-gold">
              LINDY
            </motion.span>
            <div className="absolute inset-0 flex items-end justify-center">
              <motion.img
                style={{ y: cutoutY }}
                src={ctaCutout}
                alt=""
                loading="lazy"
                decoding="async"
                className="cta-cutout"
              />
            </div>
          </div>
          <div className="relative z-10 -mt-4">
            <span className="mb-3 block font-display text-xs md:text-sm tracking-[0.5em] text-gold/80">08</span>
            <h2
              ref={sheen.ref}
              className={`title-sheen text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-wide ${sheen.visible ? "sheen-visible" : ""}`}
            >
              Comece sua <span className="text-gradient-gold">transformação</span> hoje com a Personal Lindy
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Não espere o momento perfeito. Dê o primeiro passo agora e descubra do que o seu corpo é capaz.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton large launchLabel="Abrindo o WhatsApp da Lindy...">
                <MessageCircle size={20} />
                Falar no WhatsApp
              </WhatsAppButton>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Resposta em até 24h | Acompanhamento humano e próximo
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Efeito "máquina de escrever" com largura medida em JS (imune a letter-spacing/fonte). */
function TypewriterTagline({ text }: { text: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });
  const [targetWidth, setTargetWidth] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setTargetWidth(measureRef.current.scrollWidth);
    };
    measure();
    // Re-mede quando a fonte custom carregar: medir com a fonte fallback (mais
    // estreita) travava a caixa num valor curto e cortava o fim do texto.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const done = inView || reduced;

  return (
    <span ref={containerRef} className="relative inline-block align-bottom">
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
        aria-hidden="true"
      >
        {text}
      </span>
      <motion.span
        className="tw-caret text-gradient-gold inline-block overflow-hidden whitespace-nowrap border-r-2 border-gold/70 align-bottom"
        initial={{ width: 0 }}
        // Ao terminar, libera a largura (auto = encolhe ao conteúdo) para nunca
        // cortar o texto, mesmo que a medição tenha ficado alguns px curta.
        animate={{ width: finished ? "auto" : done ? (targetWidth ?? "auto") : 0 }}
        transition={{ duration: reduced ? 0 : 1.5, ease: "linear" }}
        onAnimationComplete={() => {
          if (done && targetWidth) setFinished(true);
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="pt-12 pb-28 md:py-16 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl text-foreground uppercase tracking-wide">Personal Lindy</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Transformando vidas através do treino personalizado.
            </p>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <a
              href="https://wa.me/5562984811499"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-gold transition-colors text-sm"
            >
              <Phone size={16} />
              (62) 98481-1499
            </a>
            <a
              href="https://instagram.com/personallindy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-gold transition-colors text-sm"
            >
              <Instagram size={16} />
              @personallindy
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-gold-subtle bg-dark-surface px-4 py-2 text-xs text-muted-foreground">
            <ShieldCheck size={15} className="text-gold" /> CREF 010437/GO · Registro ativo
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border-gold-subtle bg-dark-surface px-4 py-2 text-xs text-muted-foreground">
            <Fit.Medal size={15} className="text-gold" /> 9+ anos de experiência
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border-gold-subtle bg-dark-surface px-4 py-2 text-xs text-muted-foreground">
            <Star size={15} className="text-gold" /> Especialista em grupos especiais
          </span>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-base sm:text-lg md:text-xl font-display uppercase tracking-wide sm:tracking-widest">
            <TypewriterTagline text="Seu resultado começa com uma decisão." />
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lindyara Ribeiro. Todos os direitos reservados.
            {" · "}
            <a href="/politica-de-privacidade" className="hover:text-gold transition-colors underline underline-offset-2">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <LoadingIntro />
      <TabTitleSwitcher />
      <Header />
      <GoldCursor />
      <main id="top" className="bg-background pt-16">
        {/* Hero "gruda" (desktop) enquanto o Sobre desliza por cima — estilo Apple.
            O sticky vale dentro deste bloco: quando o Sobre termina, o topo já está todo coberto. */}
        <div className="relative">
          <div className="overflow-hidden md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
            <Hero />
          </div>
          <div className="relative z-10 bg-background md:rounded-t-[2.5rem] md:shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.6)]">
            <Marquee />
            <About />
          </div>
        </div>
        <div className="relative z-10 bg-background">
          <GoldDivider />
          <AuthenticVideo />
          <GoldDivider />
          <HowItWorks />
          <GoldDivider />
          <InPractice />
          <GoldDivider />
          <Benefits />
          <GoldDivider />
          <ForWho />
          <GoldDivider />
          <Plans />
          <GoldDivider />
          <FAQ />
          <CTA />
          <Footer />
        </div>
      </main>
      <MobileCTA />
      <WhatsAppFab />
      <BackToTop />
      <SectionDots />
    </>
  );
}
