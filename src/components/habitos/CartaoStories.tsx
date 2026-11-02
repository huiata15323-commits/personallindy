import { AnimatePresence, motion } from "framer-motion";
import { Download, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gerarCartao, type DadosCartao } from "../../lib/cartao-stories";

const EASE = [0.22, 1, 0.36, 1] as const;
const NOME_ARQUIVO = "minha-semana-personal-lindy.png";

/** Prévia do card dos stories, com Compartilhar (celular) e Baixar imagem. */
export default function CartaoStories({
  dados,
  aberto,
  onFechar,
}: {
  dados: DadosCartao;
  aberto: boolean;
  onFechar: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erro, setErro] = useState("");
  const fechar = useRef<HTMLButtonElement>(null);
  const chave = JSON.stringify(dados);

  useEffect(() => {
    if (!aberto) return;
    let vivo = true;
    let criado: string | null = null;
    setErro("");
    setUrl(null);
    setArquivo(null);
    gerarCartao(JSON.parse(chave) as DadosCartao)
      .then((blob) => {
        if (!vivo) return;
        criado = URL.createObjectURL(blob);
        setUrl(criado);
        setArquivo(new File([blob], NOME_ARQUIVO, { type: "image/png" }));
      })
      .catch(() => {
        if (vivo) setErro("Não consegui montar a imagem neste navegador.");
      });
    return () => {
      vivo = false;
      if (criado) URL.revokeObjectURL(criado);
    };
  }, [aberto, chave]);

  useEffect(() => {
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", tecla);
    const t = window.setTimeout(() => fechar.current?.focus(), 50);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", tecla);
      window.clearTimeout(t);
    };
  }, [aberto, onFechar]);

  const podeCompartilhar =
    !!arquivo &&
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [arquivo] });

  const compartilhar = async () => {
    if (!arquivo) return;
    try {
      await navigator.share({ files: [arquivo] });
    } catch (e) {
      if ((e as Error)?.name !== "AbortError")
        setErro("Não deu para abrir o compartilhamento. Use Baixar imagem.");
    }
  };

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onFechar}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hab-cartao-titulo"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="max-h-full w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2
                id="hab-cartao-titulo"
                className="font-serif-display text-2xl leading-tight text-foreground text-balance"
              >
                Sua semana para os stories
              </h2>
              <button
                ref={fechar}
                type="button"
                aria-label="Fechar"
                onClick={onFechar}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[14rem] overflow-hidden rounded-xl border border-border bg-background">
              {url ? (
                <motion.img
                  src={url}
                  alt="Card da sua semana com a porcentagem de hábitos em dia, os treinos e os dias marcados"
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              ) : (
                <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted-foreground">
                  {erro ? "" : "Montando sua imagem…"}
                </p>
              )}
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground text-pretty">
              Só aparecem os números da semana. Humor e anotações ficam de fora.
            </p>
            {erro && (
              <p role="alert" className="mt-2 text-center text-sm text-destructive">
                {erro}
              </p>
            )}
            <div className="mt-4 grid gap-2">
              {podeCompartilhar && (
                <button
                  type="button"
                  onClick={compartilhar}
                  className="btn-shine flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <Share2 size={17} aria-hidden="true" />
                  Compartilhar
                </button>
              )}
              {url && (
                <a
                  href={url}
                  download={NOME_ARQUIVO}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    podeCompartilhar
                      ? "border border-border text-foreground hover:border-gold/60"
                      : "btn-shine bg-primary uppercase tracking-wide text-primary-foreground hover:brightness-110"
                  }`}
                >
                  <Download size={17} aria-hidden="true" />
                  Baixar imagem
                </a>
              )}
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Nos stories, marque a <span className="font-semibold text-gold">@personallindy</span>.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
