import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nomeDoLink } from "../../lib/habitos";
import { EASE, Topo } from "./comum";

/**
 * Página da Lindy (/habitos/presente): ela digita o nome da aluna e sai com o link pessoal
 * (personallindy.com.br/habitos#Nome) e a mensagem de boas-vindas pronta para o WhatsApp.
 */
export default function PresenteHabitos() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState(() =>
    modelo("", "https://personallindy.com.br/habitos"),
  );
  const [editada, setEditada] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [origem, setOrigem] = useState("https://personallindy.com.br");
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setOrigem(window.location.origin);
  }, []);

  const nomeLimpo = nomeDoLink(`#${nome}`);
  const link = `${origem}/habitos${nomeLimpo ? `#${encodeURIComponent(nomeLimpo).replace(/%20/g, "-")}` : ""}`;

  useEffect(() => {
    if (editada) return;
    setMensagem(modelo(nomeLimpo, link));
  }, [nomeLimpo, link, editada]);

  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 2200);
    return () => window.clearTimeout(t);
  }, [copiado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado(true);
    } catch {
      area.current?.select();
      try {
        setCopiado(document.execCommand("copy"));
      } catch {
        /* a mensagem fica selecionada para copiar à mão */
      }
    }
  };

  const restaurar = () => {
    setEditada(false);
    setMensagem(modelo(nomeLimpo, link));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 min-h-screen [font-feature-settings:'lnum'_1]">
        <Topo titulo="Para a Lindy" />
        <main className="mx-auto w-full max-w-xl px-5 pb-20 pt-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="font-serif-display text-[2.6rem] leading-[1.02] text-foreground text-balance">
              Presente para uma <span className="italic text-gradient-gold">aluna nova</span>
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Digite o nome da aluna. O link abre o diário já com o nome dela, e a mensagem vai
              pronta para o WhatsApp.
            </p>

            <label htmlFor="pres-nome" className="mt-8 block text-sm font-medium text-foreground">
              Nome da aluna
            </label>
            <input
              id="pres-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={40}
              autoComplete="off"
              autoCapitalize="words"
              placeholder="Ex.: Ana Paula"
              className="mt-2 min-h-12 w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground/60 focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
            />

            <p className="mt-6 text-sm font-medium text-foreground">Link dela</p>
            <p className="mt-2 break-all rounded-xl border border-border/70 px-4 py-3 text-[14px] text-[#FBE2A7]">
              {link}
            </p>

            <div className="mt-6 flex items-baseline justify-between gap-3">
              <label htmlFor="pres-mensagem" className="text-sm font-medium text-foreground">
                Mensagem
              </label>
              {editada && (
                <button
                  type="button"
                  onClick={restaurar}
                  className="text-xs text-gold hover:underline"
                >
                  Voltar ao texto original
                </button>
              )}
            </div>
            <textarea
              id="pres-mensagem"
              ref={area}
              value={mensagem}
              onChange={(e) => {
                setEditada(true);
                setMensagem(e.target.value);
              }}
              rows={8}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-4 py-3 text-[15px] leading-relaxed text-foreground focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
            />

            <div className="mt-6 grid gap-2.5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Enviar pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={copiar}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                aria-live="polite"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copiado ? "ok" : "copiar"}
                    className="inline-flex items-center gap-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                  >
                    {copiado ? (
                      <Check size={17} aria-hidden="true" />
                    ) : (
                      <Copy size={17} aria-hidden="true" />
                    )}
                    {copiado ? "Mensagem copiada" : "Copiar mensagem"}
                  </motion.span>
                </AnimatePresence>
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Ver como a aluna vai receber
              </a>
            </div>

            <p className="mt-10 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground text-pretty">
              Salve esta página nos favoritos do seu celular. Ela não guarda nada: o nome só vai no
              link que você manda.
            </p>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}

function modelo(nome: string, link: string): string {
  const abertura = nome
    ? `${nome.split(" ")[0]}, seja muito bem-vinda à consultoria! 🤎`
    : "Seja muito bem-vinda à consultoria! 🤎";
  return [
    abertura,
    "",
    "Preparei um presente para você: o seu diário de hábitos. Abra o link, marque seus hábitos todo dia e, no fim da semana, me mande o resumo por aqui.",
    "",
    link,
  ].join("\n");
}
