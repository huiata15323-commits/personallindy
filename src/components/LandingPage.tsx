import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Dumbbell,
  Target,
  MessageCircle,
  TrendingUp,
  Clock,
  MapPin,
  Award,
  Users,
  Flame,
  Star,
  Phone,
  Instagram,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";
import lindyProfile from "../assets/lindy-profile.jpg";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

function WhatsAppButton({
  children,
  className = "",
  large = false,
}: {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
}) {
  return (
    <a
      href="https://wa.me/5562984811499?text=Olá%20Lindy!%20Quero%20começar%20minha%20transformação."
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2
        bg-primary text-primary-foreground
        font-semibold tracking-wide uppercase
        transition-all duration-300
        hover:brightness-110 hover:scale-[1.02]
        active:scale-[0.98]
        ${large ? "px-8 py-4 text-lg rounded-xl animate-pulse-gold" : "px-6 py-3 text-sm rounded-lg"}
        ${className}
      `}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <a href="#top" className="font-display text-xl sm:text-2xl text-foreground uppercase tracking-widest">
          Personal <span className="text-gradient-gold">Lindy</span>
        </a>
        <a
          href="https://wa.me/5562984811499?text=Olá%20Lindy!%20Quero%20começar%20minha%20transformação."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle size={16} />
          <span className="hidden xs:inline sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="text-center mb-12 md:mb-16"
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-wider">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Treino na academia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-gold-subtle bg-background/40 backdrop-blur-sm text-gold text-sm font-medium tracking-wide uppercase">
            <Flame size={16} />
            Personal Trainer Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground uppercase leading-[0.95] tracking-wide"
        >
          Transforme seu corpo com a{" "}
          <span className="text-gradient-gold">Personal Lindy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 md:mt-8 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Treinos personalizados e acompanhamento direto para você conquistar resultados reais.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 md:mt-10"
        >
          <WhatsAppButton large>
            Começar agora
            <ArrowRight size={20} />
          </WhatsAppButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold" /> +500 alunos</span>
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold" /> Suporte direto</span>
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold" /> 100% online</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <div className="relative overflow-hidden rounded-2xl border-gold-subtle">
              <img
                src={lindyProfile}
                alt="Lindyara Rodrigues - Personal Trainer"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-dark-surface border-gold-subtle rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-gold fill-gold" />
                <span className="text-foreground font-semibold text-sm">+500 alunos transformados</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              Sobre a Personal
            </span>
            <h2 className="text-4xl md:text-5xl text-foreground uppercase mt-2 mb-6">
              Lindyara Ribeiro
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              Sou Personal Trainer dedicada a transformar vidas através do treino. Trabalho com foco em resultados reais, respeitando o seu nível, sua rotina e seus objetivos.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              Meu acompanhamento é próximo, estratégico e feito para você evoluir de verdade. Cada treino é pensado exclusivamente para o seu corpo e suas metas.
            </p>
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
    { icon: Target, title: "Avaliação Inicial", desc: "Análise completa do seu perfil, objetivos e condicionamento físico atual." },
    { icon: Dumbbell, title: "Treino Exclusivo", desc: "Montagem de um programa de treino 100% personalizado para o seu corpo." },
    { icon: MessageCircle, title: "Acompanhamento Contínuo", desc: "Suporte direto via WhatsApp para tirar dúvidas e manter a motivação." },
    { icon: TrendingUp, title: "Ajustes e Evolução", desc: "Reavaliações periódicas e adaptações conforme sua evolução." },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Como Funciona"
          subtitle="Um processo simples e estratégico para você alcançar seus objetivos de forma definitiva."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative p-6 md:p-8 rounded-2xl bg-dark-elevated border-gold-subtle hover:border-gold/40 transition-all duration-300"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <step.icon size={32} className="text-gold mb-4" />
              <h3 className="text-xl text-foreground uppercase tracking-wide mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const benefits = [
    { icon: Dumbbell, title: "Treino 100% Personalizado", desc: "Criado exclusivamente para o seu corpo, seus objetivos e sua rotina." },
    { icon: MessageCircle, title: "Suporte Direto Comigo", desc: "Atendimento próximo e humanizado pelo WhatsApp para dúvidas e motivação." },
    { icon: Clock, title: "Flexibilidade de Horários", desc: "Treine no momento que for melhor para você, sem depender de agenda fixa." },
    { icon: MapPin, title: "Treine em Qualquer Lugar", desc: "Programas adaptados para academia, casa, parque ou viagem." },
    { icon: Award, title: "Resultados Reais e Consistentes", desc: "Metodologia comprovada que entrega transformação de verdade." },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Benefícios"
          subtitle="O que você ganha ao treinar com acompanhamento profissional da Personal Lindy."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-2xl bg-dark-surface border-gold-subtle hover:bg-dark-elevated transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <b.icon size={24} className="text-gold" />
              </div>
              <h3 className="text-xl text-foreground uppercase tracking-wide mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
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
    { icon: Users, label: "Iniciantes", desc: "Nunca treinou? Vou te guiar do zero com segurança e confiança." },
    { icon: Target, label: "Quem não consegue resultados", desc: "Cansado de treinar sem evoluir? A estratégia certa muda tudo." },
    { icon: Flame, label: "Quem quer emagrecer", desc: "Programa focado em queima de gordura com saúde e sustentabilidade." },
    { icon: Dumbbell, label: "Quem quer ganhar massa", desc: "Treinos de hipertrofia inteligente para ganho muscular eficiente." },
    { icon: Award, label: "Quem busca disciplina", desc: "Acompanhamento que te mantém focado e consistente no dia a dia." },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Para Quem é"
          subtitle="Seja qual for o seu nível ou objetivo, existe um caminho para você."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {audiences.map((a, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-start gap-4 p-5 md:p-6 rounded-xl bg-dark-elevated border-gold-subtle"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <a.icon size={20} className="text-gold" />
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-base uppercase tracking-wide">{a.label}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials = [
    {
      name: "Ana Carolina",
      text: "A Lindy mudou minha relação com o treino. Em 3 meses perdi 8kg e ganhei uma confiança que nunca tive. O acompanhamento é realmente próximo, ela sempre ajusta meu treino quando preciso.",
      result: "-8kg em 3 meses",
    },
    {
      name: "Marcos Henrique",
      text: "Sempre fui magro e não conseguia ganhar massa sozinho. Com a Lindy aprendi a treinar certo e finalmente vi meu corpo mudar. Hoje estou 7kg mais forte e me sinto outra pessoa.",
      result: "+7kg de massa muscular",
    },
    {
      name: "Juliana Mendes",
      text: "Depois de dois filhos, achei que nunca mais recuperaria minha forma. A Lindy montou um programa perfeito para a minha rotina e em 4 meses estou mais forte do que antes da gravidez.",
      result: "Resultado em 4 meses",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Depoimentos"
          subtitle="Histórias reais de pessoas que transformaram seus corpos com acompanhamento profissional."
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-2xl bg-dark-surface border-gold-subtle flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-foreground font-semibold text-sm uppercase tracking-wide">{t.name}</p>
                <p className="text-gold text-xs font-medium mt-1 uppercase tracking-wider">{t.result}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-dark-surface">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center p-8 md:p-12 lg:p-16 rounded-3xl bg-dark-elevated border-gold-subtle relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-gold opacity-[0.03]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-wide">
              Comece sua <span className="text-gradient-gold">transformação</span> hoje com a Personal Lindy
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Não espere o momento perfeito. Dê o primeiro passo agora e descubra do que o seu corpo é capaz.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton large>
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

function Footer() {
  return (
    <footer className="py-12 md:py-16 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl text-foreground uppercase tracking-wide">Personal Lindy</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Transformando vidas através do treino personalizado.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href="https://wa.me/5562984811499"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm"
            >
              <Phone size={16} />
              (62) 98481-1499
            </a>
            <a
              href="https://instagram.com/personallindy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm"
            >
              <Instagram size={16} />
              @personallindy
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-gradient-gold text-lg md:text-xl font-display uppercase tracking-widest">
            Seu resultado começa com uma decisão.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lindyara Ribeiro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-background">
      <Hero />
      <About />
      <HowItWorks />
      <Benefits />
      <ForWho />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
