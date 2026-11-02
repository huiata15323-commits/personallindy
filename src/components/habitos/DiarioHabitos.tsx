import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  ImagePlus,
  MessageCircle,
  Printer,
  Share,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import GoldBurst from "../GoldBurst";
import CartaoStories from "./CartaoStories";
import { EASE, Logo, Topo, TracoDourado } from "./comum";
import type { DadosCartao } from "../../lib/cartao-stories";
import {
  ASSINATURA_LINDY,
  FRASE_LINDY,
  GRUPOS,
  HABITOS,
  HORAS_LEMBRETE,
  HUMOR_ROTULOS,
  LETRAS_DIAS,
  SINAIS,
  apagarTudo,
  arquivoDeCopia,
  arquivoLembrete,
  carregar,
  lerCopia,
  limparNome,
  linkGoogleAgenda,
  chaveDe,
  cumprido,
  dataDe,
  dataPorExtenso,
  diaCurto,
  inicioDaSemana,
  intervaloDaSemana,
  linkWhatsApp,
  nomeCurto,
  nomeDoLink,
  novoDados,
  pontosDoDia,
  porcentagem,
  resumoDaSemana,
  salvar,
  sequencia,
  somarDias,
  temRegistro,
  textoDoResumo,
  type Dados,
  type Dia,
  type Fechamento,
  type Habito,
  type HabitoId,
  type Humor,
  type Sinal,
  type Treino,
} from "../../lib/habitos";

// Movimento (skill motion-design): app de uso diário, personalidade "corporate" com a curva do site
// (0.22, 1, 0.36, 1). Os momentos com mais cena são três e acontecem uma vez:
// o presente (foto que se revela, traço dourado, cortina que sobe), o dia completo (estouro dourado
// do site) e a contagem dos números. Com "reduzir movimento", tudo aparece parado no estado final.
const EASE_CORTINA = [0.76, 0, 0.24, 1] as const;
const DIAS_PARA_TRAS = 30;

type Aba = "hoje" | "semana";
type Plataforma = "ios" | "android" | "outro";
type Atualizar = (fn: (d: Dados) => Dados) => void;

function vibrar(padrao: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(padrao);
  } catch {
    /* sem vibração neste aparelho */
  }
}

export default function DiarioHabitos() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [hoje, setHoje] = useState("");
  const [dia, setDia] = useState("");
  const [semana, setSemana] = useState("");
  const [aba, setAba] = useState<Aba>("hoje");
  const [direcao, setDirecao] = useState(0);
  const [semSalvar, setSemSalvar] = useState(false);
  const [estouro, setEstouro] = useState<{ id: number; x: number; y: number } | null>(null);
  const reduzir = useReducedMotion();
  const ref = useRef<Dados | null>(null);
  const hojeRef = useRef("");

  // Só no navegador: lê o que está salvo no aparelho e o nome que veio no link (#Ana).
  useEffect(() => {
    const h = chaveDe(new Date());
    let d = carregar() ?? novoDados(h);
    // O nome do link só vale enquanto a aluna não trocou o nome à mão (link encaminhado, nome errado).
    const nome = nomeDoLink(window.location.hash);
    if (nome && nome !== d.nome && !d.nomeManual) d = { ...d, nome };
    ref.current = d;
    hojeRef.current = h;
    setDados(d);
    setHoje(h);
    setDia(h);
    setSemana(inicioDaSemana(h));
    if (!salvar(d)) setSemSalvar(true);
  }, []);

  // Virou o dia com o app aberto (ou ao voltar para ele): vai para o novo "hoje".
  useEffect(() => {
    const aoVoltar = () => {
      if (document.visibilityState !== "visible") return;
      const h = chaveDe(new Date());
      if (hojeRef.current && hojeRef.current !== h) {
        hojeRef.current = h;
        setHoje(h);
        setDia(h);
        setSemana(inicioDaSemana(h));
      }
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => document.removeEventListener("visibilitychange", aoVoltar);
  }, []);

  const atualizar = useCallback<Atualizar>((fn) => {
    const atual = ref.current;
    if (!atual) return;
    const novo = fn(atual);
    ref.current = novo;
    setDados(novo);
    if (!salvar(novo)) setSemSalvar(true);
  }, []);

  const mudarDia = useCallback(
    (n: number) => {
      setDirecao(n);
      setDia((atual) => {
        const novo = somarDias(atual, n);
        if (novo > hoje || novo < somarDias(hoje, -DIAS_PARA_TRAS)) return atual;
        return novo;
      });
    },
    [hoje],
  );

  const comemorar = useCallback(
    (x: number, y: number) => {
      vibrar([12, 40, 18]);
      if (reduzir) return;
      const id = Date.now();
      setEstouro({ id, x, y });
      window.setTimeout(() => setEstouro((e) => (e?.id === id ? null : e)), 900);
    },
    [reduzir],
  );

  const abrirDiario = (nomeDigitado: string) => {
    const nome = limparNome(nomeDigitado);
    atualizar((d) => ({
      ...d,
      boasVindas: true,
      ...(nome ? { nome, nomeManual: true } : {}),
    }));
    window.setTimeout(
      () => document.getElementById("hab-saudacao")?.focus({ preventScroll: true }),
      50,
    );
  };

  // Cópia de segurança restaurada: substitui tudo o que estava neste aparelho.
  const restaurar = (copia: Dados) => {
    const novo: Dados = { ...copia, boasVindas: true };
    ref.current = novo;
    setDados(novo);
    if (!salvar(novo)) setSemSalvar(true);
    setDia(hoje);
    setSemana(inicioDaSemana(hoje));
    setAba("hoje");
  };

  const apagar = () => {
    apagarTudo();
    const novo = novoDados(hoje);
    ref.current = novo;
    setDados(novo);
    setDia(hoje);
    setSemana(inicioDaSemana(hoje));
    setAba("hoje");
    window.scrollTo({ top: 0 });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 min-h-screen [font-feature-settings:'lnum'_1]">
        <Topo titulo="Diário de hábitos" />
        {!dados ? (
          <main className="mx-auto w-full max-w-xl px-5 pt-10 sm:px-6">
            <p className="text-sm text-muted-foreground">Abrindo seu diário…</p>
            <noscript>
              <p className="mt-4 text-sm text-muted-foreground">
                Para usar o diário, ative o JavaScript do navegador. A versão para imprimir está em
                personallindy.com.br/diario-de-habitos-lindy.pdf.
              </p>
            </noscript>
          </main>
        ) : (
          <main
            className="mx-auto w-full max-w-xl px-5 pb-24 pt-8 sm:px-6"
            inert={!dados.boasVindas}
          >
            <Saudacao nome={dados.nome} seq={sequencia(dados, hoje)} />
            {semSalvar && (
              <p
                role="alert"
                className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground text-pretty"
              >
                Este navegador não está deixando salvar (talvez seja uma aba anônima). Abra o link
                numa aba normal para não perder suas marcações.
              </p>
            )}
            <Abas aba={aba} onChange={setAba} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={aba}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
                role="tabpanel"
                id={`hab-painel-${aba}`}
                aria-labelledby={`hab-aba-${aba}`}
              >
                {aba === "hoje" ? (
                  <Hoje
                    dados={dados}
                    dia={dia}
                    hoje={hoje}
                    direcao={direcao}
                    mudarDia={mudarDia}
                    atualizar={atualizar}
                    onCompleto={comemorar}
                  />
                ) : (
                  <Semana
                    dados={dados}
                    hoje={hoje}
                    semana={semana}
                    setSemana={setSemana}
                    atualizar={atualizar}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <Rodape
              dados={dados}
              hoje={hoje}
              atualizar={atualizar}
              onRestaurar={restaurar}
              onApagar={apagar}
            />
          </main>
        )}
        <AnimatePresence>
          {dados && !dados.boasVindas && (
            <BoasVindas key="presente" nome={dados.nome} onAbrir={abrirDiario} />
          )}
        </AnimatePresence>
        {estouro ? <GoldBurst key={estouro.id} x={estouro.x} y={estouro.y} /> : null}
      </div>
    </MotionConfig>
  );
}

/* ---------------- Peças comuns ---------------- */

/** Número que sobe contando até o valor novo (parado com "reduzir movimento"). */
function Contagem({ valor }: { valor: number }) {
  const reduzir = useReducedMotion();
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);
  useEffect(() => {
    if (reduzir || anterior.current === valor) {
      setMostrado(valor);
      anterior.current = valor;
      return;
    }
    const controle = animate(anterior.current, valor, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => setMostrado(Math.round(v)),
    });
    anterior.current = valor;
    return () => controle.stop();
  }, [valor, reduzir]);
  return <>{mostrado}</>;
}

function CabecalhoSecao({
  id,
  titulo,
  contador,
}: {
  id: string;
  titulo: string;
  contador?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold/25 pb-2">
      <h2
        id={id}
        className="font-serif-display text-[1.65rem] leading-tight text-foreground text-balance"
      >
        {titulo}
      </h2>
      {contador && (
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{contador}</span>
      )}
    </div>
  );
}

function BotaoSeta({
  direcao,
  rotulo,
  onClick,
  desativado,
}: {
  direcao: "voltar" | "avancar";
  rotulo: string;
  onClick: () => void;
  desativado: boolean;
}) {
  const Icone = direcao === "voltar" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={rotulo}
      onClick={onClick}
      disabled={desativado}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-25"
    >
      <Icone size={20} aria-hidden="true" />
    </button>
  );
}

/* ---------------- Saudação e abas ---------------- */

function Saudacao({ nome, seq }: { nome: string; seq: number }) {
  const frase =
    seq > 1
      ? `${seq} dias seguidos marcando. Continue assim.`
      : seq === 1
        ? "Primeiro dia marcado. Amanhã tem mais."
        : "Marque o que você já fez hoje.";
  return (
    <div className="mb-7">
      <h1
        id="hab-saudacao"
        tabIndex={-1}
        className="font-serif-display text-[2.75rem] leading-[1.02] text-foreground outline-none"
      >
        {nome ? (
          <>
            Oi, <span className="italic text-gradient-gold">{nome}</span>
          </>
        ) : (
          <>
            Seu <span className="italic text-gradient-gold">diário</span>
          </>
        )}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{frase}</p>
    </div>
  );
}

function Abas({ aba, onChange }: { aba: Aba; onChange: (a: Aba) => void }) {
  const itens: [Aba, string][] = [
    ["hoje", "Hoje"],
    ["semana", "Minha semana"],
  ];
  return (
    <div
      role="tablist"
      aria-label="O que ver"
      className="mb-8 grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1"
    >
      {itens.map(([id, rotulo]) => {
        const ativa = aba === id;
        return (
          <button
            key={id}
            id={`hab-aba-${id}`}
            type="button"
            role="tab"
            aria-selected={ativa}
            aria-controls={`hab-painel-${id}`}
            onClick={() => onChange(id)}
            className={`relative min-h-11 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              ativa ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {ativa && (
              <motion.span
                layoutId="hab-aba-fundo"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ duration: 0.3, ease: EASE }}
              />
            )}
            <span className="relative">{rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Hoje ---------------- */

function Hoje({
  dados,
  dia,
  hoje,
  direcao,
  mudarDia,
  atualizar,
  onCompleto,
}: {
  dados: Dados;
  dia: string;
  hoje: string;
  direcao: number;
  mudarDia: (n: number) => void;
  atualizar: Atualizar;
  onCompleto: (x: number, y: number) => void;
}) {
  const registro = dados.dias[dia];
  const base: Dia = registro ?? { feitos: [] };
  const { feitos, total } = pontosDoDia(registro);
  const completo = total > 0 && feitos === total;
  const atras = Math.round((dataDe(hoje).getTime() - dataDe(dia).getTime()) / 86400000);
  const rotulo = atras === 0 ? "Hoje" : atras === 1 ? "Ontem" : `Há ${atras} dias`;

  const aplicar = (novo: Dia, el?: HTMLElement) => {
    const antes = pontosDoDia(registro);
    const depois = pontosDoDia(novo);
    atualizar((d) => ({ ...d, dias: { ...d.dias, [dia]: novo } }));
    const fechou =
      depois.total > 0 && depois.feitos === depois.total && antes.feitos !== antes.total;
    if (fechou && el) {
      const r = el.getBoundingClientRect();
      onCompleto(r.left + Math.min(36, r.width / 2), r.top + r.height / 2);
    }
  };

  const alternar = (id: HabitoId, el: HTMLElement) => {
    const marcar = !base.feitos.includes(id);
    if (marcar) vibrar(8);
    aplicar(
      { ...base, feitos: marcar ? [...base.feitos, id] : base.feitos.filter((x) => x !== id) },
      el,
    );
  };
  const escolherTreino = (t: Treino, el: HTMLElement) =>
    aplicar({ ...base, treino: base.treino === t ? undefined : t }, el);
  const escolherHumor = (h: Humor) => aplicar({ ...base, humor: base.humor === h ? undefined : h });
  const alternarSinal = (s: Sinal) => {
    const atuais = base.sinais ?? [];
    aplicar({
      ...base,
      sinais: atuais.includes(s) ? atuais.filter((x) => x !== s) : [...atuais, s],
    });
  };

  let mensagem: string;
  if (completo) mensagem = "Dia completo. Que orgulho!";
  else if (feitos === 0)
    mensagem =
      atras === 0
        ? "Toque nos hábitos que você já cumpriu."
        : "Esqueceu de marcar? Dá para completar aqui.";
  else if (feitos / total < 0.5) mensagem = "Bom começo. Cada marcação conta.";
  else mensagem = "Falta pouco para fechar o dia.";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <BotaoSeta
          direcao="voltar"
          rotulo="Dia anterior"
          onClick={() => mudarDia(-1)}
          desativado={atras >= DIAS_PARA_TRAS}
        />
        <div className="min-w-0 text-center" aria-live="polite">
          <p className="font-serif-display text-base italic text-gold">{rotulo}</p>
          <p className="font-serif-display text-[1.3rem] leading-tight text-foreground text-balance">
            {dataPorExtenso(dia)}
          </p>
        </div>
        <BotaoSeta
          direcao="avancar"
          rotulo="Próximo dia"
          onClick={() => mudarDia(1)}
          desativado={atras <= 0}
        />
      </div>

      <motion.div
        key={dia}
        initial={{ opacity: 0, x: direcao * 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.26, ease: EASE }}
      >
        <div className="mb-10">
          <div className="flex items-end justify-between gap-4">
            <p className="font-serif-display text-[3.6rem] leading-[0.9] tabular-nums text-foreground">
              <Contagem valor={feitos} />
              <span className="ml-2 text-2xl text-muted-foreground">de {total}</span>
            </p>
            <div className="max-w-[13rem] pb-1 text-right">
              <p
                className={`text-sm leading-snug text-pretty ${completo ? "font-semibold text-[#FBE2A7]" : "text-muted-foreground"}`}
              >
                {mensagem}
              </p>
              {completo && <TracoDourado key={`traco-${dia}`} className="ml-auto mt-1 h-2 w-28" />}
            </div>
          </div>
          <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full origin-left bg-gradient-gold"
              initial={false}
              animate={{ scaleX: total ? feitos / total : 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>

        {GRUPOS.map((g) => {
          const lista = g.habitos.filter((h) => !h.soComTreino || base.treino === "feito");
          const noGrupo = lista.filter((h) => cumprido(registro, h.id)).length;
          return (
            <section key={g.id} aria-labelledby={`hab-grupo-${g.id}`} className="mb-10">
              <CabecalhoSecao
                id={`hab-grupo-${g.id}`}
                titulo={g.titulo}
                contador={`${noGrupo} de ${lista.length}`}
              />
              <ul className="divide-y divide-border/50">
                {g.habitos.map((h) => (
                  <li key={h.id}>
                    {h.tipo === "treino" ? (
                      <LinhaTreino valor={base.treino} onEscolher={escolherTreino} />
                    ) : (
                      <LinhaHabito
                        habito={h}
                        marcado={cumprido(registro, h.id)}
                        desativado={!!h.soComTreino && base.treino !== "feito"}
                        onAlternar={(el) => alternar(h.id, el)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section aria-labelledby="hab-humor" className="mb-6">
          <CabecalhoSecao id="hab-humor" titulo="Como você está hoje?" />
          <p className="mt-3 text-[13.5px] text-muted-foreground text-pretty">
            Seu humor e sua energia me ajudam a ajustar o seu treino.
          </p>
          <div
            role="radiogroup"
            aria-labelledby="hab-humor"
            className="mt-4 grid grid-cols-5 gap-1.5"
          >
            {([1, 2, 3, 4, 5] as Humor[]).map((n) => {
              const ativo = base.humor === n;
              return (
                <motion.button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => escolherHumor(n)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    ativo
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  <span className="font-serif-display text-[1.6rem] leading-none">{n}</span>
                  <span className="text-[10.5px] leading-tight">{HUMOR_ROTULOS[n - 1]}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="mt-5 text-[13.5px] text-muted-foreground">Algo mexeu com você?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SINAIS.map((s) => {
              const ativo = base.sinais?.includes(s) ?? false;
              return (
                <button
                  key={s}
                  type="button"
                  role="checkbox"
                  aria-checked={ativo}
                  onClick={() => alternarSinal(s)}
                  className={`min-h-10 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    ativo
                      ? "border-gold bg-gold/15 text-[#FBE2A7]"
                      : "border-border text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>
      </motion.div>

      <figure className="mx-auto mt-14 max-w-sm px-2 text-center">
        <blockquote className="font-serif-display text-[1.6rem] italic leading-snug text-[#FBE2A7] text-balance">
          “{FRASE_LINDY}”
        </blockquote>
        <figcaption className="mt-3 font-serif-display text-base italic text-muted-foreground">
          Lindy
        </figcaption>
      </figure>
    </div>
  );
}

function Marca({ marcado }: { marcado: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
        marcado ? "border-gold bg-gold" : "border-gold/45 bg-transparent"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <motion.path
          d="M5 12.5l4.2 4.2L19 7"
          fill="none"
          stroke="var(--color-primary-foreground)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: marcado ? 1 : 0, opacity: marcado ? 1 : 0 }}
          transition={{ duration: 0.22, ease: EASE }}
        />
      </svg>
    </span>
  );
}

function LinhaHabito({
  habito,
  marcado,
  desativado,
  onAlternar,
}: {
  habito: Habito;
  marcado: boolean;
  desativado: boolean;
  onAlternar: (el: HTMLElement) => void;
}) {
  const dica = desativado ? "Fica disponível quando o treino do dia estiver feito." : habito.dica;
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={marcado}
      disabled={desativado}
      onClick={(e) => onAlternar(e.currentTarget)}
      whileTap={desativado ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.12 }}
      className="-mx-2 flex w-[calc(100%+1rem)] items-start gap-3.5 rounded-xl px-2 py-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Marca marcado={marcado} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] leading-snug text-foreground text-pretty">
          {habito.texto}
        </span>
        {dica && (
          <span className="mt-1 block text-[13px] leading-snug text-muted-foreground text-pretty">
            {dica}
          </span>
        )}
      </span>
    </motion.button>
  );
}

function LinhaTreino({
  valor,
  onEscolher,
}: {
  valor?: Treino;
  onEscolher: (t: Treino, el: HTMLElement) => void;
}) {
  const opcoes: [Treino, string][] = [
    ["feito", "Feito"],
    ["descanso", "Descanso"],
    ["nao", "Não fiz"],
  ];
  return (
    <div className="py-4">
      <p id="hab-treino-rotulo" className="mb-3 text-[15.5px] text-foreground">
        Treino do dia
      </p>
      <div role="radiogroup" aria-labelledby="hab-treino-rotulo" className="grid grid-cols-3 gap-2">
        {opcoes.map(([v, rotulo]) => {
          const ativo = valor === v;
          const estilo = ativo
            ? v === "nao"
              ? "border-muted-foreground/60 bg-muted text-foreground"
              : "border-gold bg-gold text-primary-foreground"
            : "border-border text-muted-foreground hover:border-gold/50";
          return (
            <motion.button
              key={v}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={(e) => onEscolher(v, e.currentTarget)}
              whileTap={{ scale: 0.96 }}
              className={`min-h-11 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${estilo}`}
            >
              {rotulo}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-2.5 text-[13px] leading-snug text-muted-foreground text-pretty">
        Dia de descanso do seu plano também conta como treino em dia.
      </p>
    </div>
  );
}

/* ---------------- Minha semana ---------------- */

type EstadoCelula = "sim" | "nao" | "descanso" | "na" | "fora";

function Semana({
  dados,
  hoje,
  semana,
  setSemana,
  atualizar,
}: {
  dados: Dados;
  hoje: string;
  semana: string;
  setSemana: (s: string) => void;
  atualizar: Atualizar;
}) {
  const [cartaoAberto, setCartaoAberto] = useState(false);
  const r = useMemo(() => resumoDaSemana(dados, semana, hoje), [dados, semana, hoje]);
  const pct = porcentagem(r.feitos, r.total);
  const fechamento: Fechamento = dados.semanas[semana] ?? { dificuldades: "", plano: "" };
  const semanaAtual = inicioDaSemana(hoje);
  const limite = inicioDaSemana(somarDias(hoje, -84));
  const semanasAtras = Math.round(
    (dataDe(semanaAtual).getTime() - dataDe(semana).getTime()) / (7 * 86400000),
  );
  const rotulo =
    semanasAtras === 0
      ? "Esta semana"
      : semanasAtras === 1
        ? "Semana passada"
        : `Há ${semanasAtras} semanas`;
  const diasMarcados = r.contados.filter((k) => temRegistro(dados.dias[k])).length;

  const editar = (campo: "dificuldades" | "plano", valor: string) =>
    atualizar((d) => ({
      ...d,
      semanas: {
        ...d.semanas,
        [semana]: { ...(d.semanas[semana] ?? { dificuldades: "", plano: "" }), [campo]: valor },
      },
    }));

  const marcarEnviado = () =>
    atualizar((d) => ({
      ...d,
      semanas: {
        ...d.semanas,
        [semana]: {
          ...(d.semanas[semana] ?? { dificuldades: "", plano: "" }),
          enviadoEm: new Date().toISOString(),
        },
      },
    }));

  const estado = (h: Habito, k: string): EstadoCelula => {
    if (!r.contados.includes(k)) return "fora";
    const reg = dados.dias[k];
    if (h.id === "treino")
      return reg?.treino === "feito" ? "sim" : reg?.treino === "descanso" ? "descanso" : "nao";
    if (h.soComTreino && reg?.treino !== "feito") return "na";
    return cumprido(reg, h.id) ? "sim" : "nao";
  };

  const cartao: DadosCartao = useMemo(
    () => ({
      intervalo: intervaloDaSemana(semana),
      porcentagem: pct,
      treinos: r.treinos.feito,
      diasMarcados,
      dias: r.dias.map((k) => {
        if (!r.contados.includes(k)) return null;
        const p = pontosDoDia(dados.dias[k]);
        return p.total ? p.feitos / p.total : 0;
      }),
      frase: FRASE_LINDY,
    }),
    [semana, pct, r, dados, diasMarcados],
  );

  const link = linkWhatsApp(textoDoResumo(dados, r, fechamento));
  const enviadoEm = fechamento.enviadoEm ? new Date(fechamento.enviadoEm) : null;
  const fecharCartao = useCallback(() => setCartaoAberto(false), []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <BotaoSeta
          direcao="voltar"
          rotulo="Semana anterior"
          onClick={() => setSemana(somarDias(semana, -7))}
          desativado={semana <= limite}
        />
        <div className="min-w-0 text-center" aria-live="polite">
          <p className="font-serif-display text-base italic text-gold">{rotulo}</p>
          <p className="font-serif-display text-[1.3rem] leading-tight text-foreground text-balance">
            {intervaloDaSemana(semana)}
          </p>
        </div>
        <BotaoSeta
          direcao="avancar"
          rotulo="Próxima semana"
          onClick={() => setSemana(somarDias(semana, 7))}
          desativado={semana >= semanaAtual}
        />
      </div>

      {r.contados.length === 0 ? (
        <p className="mb-10 border-y border-border py-6 text-sm text-muted-foreground">
          Nenhum dia desta semana entrou no seu diário ainda.
        </p>
      ) : (
        <div className="mb-10">
          <div className="flex items-end gap-4">
            <span className="font-serif-display text-[5.2rem] leading-[0.85] text-gradient-gold tabular-nums">
              <Contagem valor={pct} />%
            </span>
            <span className="pb-1.5 text-sm leading-snug text-muted-foreground">
              dos hábitos em dia
              <br />
              {r.feitos} de {r.total} marcações
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-3 divide-x divide-border border-y border-border text-center">
            <Numero rotulo="treinos" valor={String(r.treinos.feito)} />
            <Numero rotulo="descansos" valor={String(r.treinos.descanso)} />
            <Numero
              rotulo="humor médio"
              valor={r.humorMedio === null ? "–" : r.humorMedio.toFixed(1).replace(".", ",")}
            />
          </dl>
          {(r.forte || r.caprichar) && (
            <div className="mt-5 space-y-1.5 text-sm">
              {r.forte && (
                <p className="text-muted-foreground">
                  Seu ponto forte:{" "}
                  <strong className="font-semibold text-[#FBE2A7]">{nomeCurto(r.forte)}</strong>
                </p>
              )}
              {r.caprichar && (
                <p className="text-muted-foreground">
                  Para caprichar:{" "}
                  <strong className="font-semibold text-foreground">
                    {nomeCurto(r.caprichar)}
                  </strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <section aria-labelledby="hab-folha" className="mb-10">
        <CabecalhoSecao id="hab-folha" titulo="Sua folha da semana" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Hábitos de cada dia da semana</caption>
            <thead>
              <tr>
                <th scope="col" className="py-3 pr-2 text-xs font-normal text-muted-foreground">
                  <span className="sr-only">Hábito</span>
                </th>
                {r.dias.map((k, i) => (
                  <th
                    key={k}
                    scope="col"
                    className={`w-8 px-0.5 py-2 text-center text-[11px] font-semibold ${k === hoje ? "text-gold" : "text-muted-foreground"}`}
                  >
                    <span aria-hidden="true">{LETRAS_DIAS[i]}</span>
                    <span className="sr-only">{dataPorExtenso(k)}</span>
                    <span aria-hidden="true" className="block text-[10px] font-normal opacity-70">
                      {dataDe(k).getDate()}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HABITOS.map((h, linha) => (
                <tr key={h.id} className="border-t border-border/50">
                  <th
                    scope="row"
                    className="py-2 pr-2 text-[12.5px] font-normal leading-tight text-foreground/90"
                  >
                    {h.curto}
                  </th>
                  {r.dias.map((k, coluna) => (
                    <td key={k} className="px-0.5 py-2 text-center">
                      <Celula estado={estado(h, k)} atraso={(linha * 7 + coluna) * 0.006} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border/50">
                <th scope="row" className="py-2 pr-2 text-[12.5px] font-normal text-foreground/90">
                  Humor (1 a 5)
                </th>
                {r.dias.map((k) => (
                  <td
                    key={k}
                    className="px-0.5 py-2 text-center text-[13px] font-semibold tabular-nums text-[#FBE2A7]"
                  >
                    {r.contados.includes(k) ? (dados.dias[k]?.humor ?? "") : ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-gold align-middle" /> feito
          <span className="ml-3 mr-1 inline-block h-2.5 w-2.5 rounded-full border border-muted-foreground/60 align-middle" />{" "}
          não feito
          <span className="ml-3 mr-1 font-semibold text-gold-light">D</span> descanso
        </p>
      </section>

      <section aria-labelledby="hab-fechamento" className="mb-6">
        <CabecalhoSecao id="hab-fechamento" titulo="Fechamento da semana" />
        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          Me conte como foi. É com isso que eu ajusto o seu plano.
        </p>
        <label
          htmlFor="hab-dificuldades"
          className="mt-5 block text-sm font-medium text-foreground"
        >
          Quais foram suas dificuldades nesta semana?
        </label>
        <textarea
          id="hab-dificuldades"
          value={fechamento.dificuldades}
          onChange={(e) => editar("dificuldades", e.target.value)}
          maxLength={600}
          rows={3}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-3.5 py-3 text-[16px] text-foreground placeholder:text-muted-foreground/60 focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
          placeholder="Ex.: dormi pouco na quarta e perdi o treino"
        />
        <label htmlFor="hab-plano" className="mt-4 block text-sm font-medium text-foreground">
          O que você vai fazer para avançar na próxima semana?
        </label>
        <textarea
          id="hab-plano"
          value={fechamento.plano}
          onChange={(e) => editar("plano", e.target.value)}
          maxLength={600}
          rows={3}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-3.5 py-3 text-[16px] text-foreground placeholder:text-muted-foreground/60 focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
          placeholder="Ex.: deixar a roupa de treino separada na noite anterior"
        />
        {r.contados.length === 0 ? (
          <p className="mt-5 rounded-xl border border-border px-4 py-3 text-center text-sm text-muted-foreground">
            Marque pelo menos um dia para enviar o resumo.
          </p>
        ) : (
          <>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={marcarEnviado}
              className="btn-shine mt-6 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Enviar minha semana para a Lindy
            </a>
            <p className="mt-2 text-center text-xs text-muted-foreground text-pretty">
              {enviadoEm
                ? `Resumo aberto no WhatsApp em ${diaCurto(chaveDe(enviadoEm))} às ${String(enviadoEm.getHours()).padStart(2, "0")}h${String(enviadoEm.getMinutes()).padStart(2, "0")}. Se mudar algo, pode abrir de novo.`
                : "Abre o seu WhatsApp com o resumo pronto. Nada sai sem você tocar em enviar."}
            </p>
            <button
              type="button"
              onClick={() => setCartaoAberto(true)}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold/40 px-5 text-sm font-semibold text-[#FBE2A7] transition-colors hover:border-gold hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ImagePlus size={17} aria-hidden="true" />
              Criar card da semana para os stories
            </button>
          </>
        )}
      </section>
      <CartaoStories dados={cartao} aberto={cartaoAberto} onFechar={fecharCartao} />
    </div>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col-reverse px-2 py-4">
      <dt className="mt-1.5 text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="font-serif-display text-[2rem] leading-none text-foreground tabular-nums">
        {valor}
      </dd>
    </div>
  );
}

function Celula({ estado, atraso }: { estado: EstadoCelula; atraso: number }) {
  if (estado === "sim")
    return (
      <motion.span
        className="inline-block h-3.5 w-3.5 rounded-full bg-gold align-middle"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: atraso, ease: EASE }}
      >
        <span className="sr-only">feito</span>
      </motion.span>
    );
  if (estado === "descanso")
    return (
      <span className="text-[12px] font-semibold text-gold-light">
        <span aria-hidden="true">D</span>
        <span className="sr-only">descanso</span>
      </span>
    );
  if (estado === "nao")
    return (
      <span className="inline-block h-3.5 w-3.5 rounded-full border border-muted-foreground/50 align-middle">
        <span className="sr-only">não feito</span>
      </span>
    );
  if (estado === "na")
    return (
      <span className="text-[12px] text-muted-foreground/50">
        –<span className="sr-only">não se aplica</span>
      </span>
    );
  return (
    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/30 align-middle">
      <span className="sr-only">sem registro</span>
    </span>
  );
}

/* ---------------- Rodapé ---------------- */

const classeBotao =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function Rodape({
  dados,
  hoje,
  atualizar,
  onRestaurar,
  onApagar,
}: {
  dados: Dados;
  hoje: string;
  atualizar: Atualizar;
  onRestaurar: (d: Dados) => void;
  onApagar: () => void;
}) {
  const plataforma = usePlataforma();
  const hora = dados.lembreteHora ?? 21;
  const agenda = plataforma === "android" ? linkGoogleAgenda(hoje, hora) : arquivoLembrete(hora);
  return (
    <footer className="mt-16 border-t border-gold/25 pt-8 text-sm text-muted-foreground">
      <div className="space-y-10">
        <section aria-labelledby="hab-lembrete">
          <h2 id="hab-lembrete" className="font-serif-display text-xl text-foreground">
            Lembrete todo dia
          </h2>
          <p className="mt-1 text-pretty">
            Um aviso na agenda do celular para você não esquecer de marcar. Escolha a hora:
          </p>
          <div
            role="radiogroup"
            aria-labelledby="hab-lembrete"
            className="mt-3 flex flex-wrap gap-2"
          >
            {HORAS_LEMBRETE.map((h) => {
              const ativo = h === hora;
              return (
                <button
                  key={h}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => atualizar((d) => ({ ...d, lembreteHora: h }))}
                  className={`min-h-10 min-w-14 rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    ativo
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  {h}h
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={agenda}
              target={plataforma === "android" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={classeBotao}
            >
              <BellRing size={16} aria-hidden="true" />
              Adicionar à agenda às {hora}h
            </a>
            {plataforma === "outro" && (
              <a
                href={linkGoogleAgenda(hoje, hora)}
                target="_blank"
                rel="noopener noreferrer"
                className={classeBotao}
              >
                No Google Agenda
              </a>
            )}
          </div>
        </section>

        <section aria-labelledby="hab-papel">
          <h2 id="hab-papel" className="font-serif-display text-xl text-foreground">
            Prefere no papel?
          </h2>
          <p className="mt-1 text-pretty">
            A mesma folha, pronta para imprimir e colar na geladeira.
          </p>
          <a
            href="/diario-de-habitos-lindy.pdf"
            target="_blank"
            rel="noopener"
            className={`mt-3 ${classeBotao}`}
          >
            <Printer size={16} aria-hidden="true" />
            Baixar versão para imprimir (PDF)
          </a>
        </section>

        <CopiaSeguranca dados={dados} hoje={hoje} atualizar={atualizar} onRestaurar={onRestaurar} />

        <TrocarNome
          nome={dados.nome}
          onSalvar={(nome) => atualizar((d) => ({ ...d, nome, nomeManual: true }))}
        />

        {plataforma !== "outro" && <DicaTelaInicial plataforma={plataforma} />}

        <div>
          <p className="leading-relaxed text-pretty">
            Seus registros ficam só neste aparelho. Eu só vejo o que você me enviar pelo WhatsApp.
          </p>
          <div className="mt-3">
            <BotaoApagar onApagar={onApagar} />
          </div>
        </div>

        <p className="text-xs">
          {ASSINATURA_LINDY} ·{" "}
          <a
            href="/politica-de-privacidade"
            className="text-gold underline underline-offset-2 hover:text-gold-light"
          >
            Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
}

/** Cópia de segurança: um arquivo que fica com a aluna (Arquivos, Drive, WhatsApp) e volta quando ela quiser. */
function CopiaSeguranca({
  dados,
  hoje,
  atualizar,
  onRestaurar,
}: {
  dados: Dados;
  hoje: string;
  atualizar: Atualizar;
  onRestaurar: (d: Dados) => void;
}) {
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [pendente, setPendente] = useState<{ dados: Dados; exportadoEm?: string } | null>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const contarDias = (d: Dados) => Object.values(d.dias).filter((x) => temRegistro(x)).length;
  const ultima = dados.ultimaCopia ? new Date(dados.ultimaCopia) : null;

  const salvarCopia = async () => {
    setAviso(null);
    const { nome, conteudo } = arquivoDeCopia(dados, hoje);
    const arquivo = new File([conteudo], nome, { type: "application/json" });
    const marcar = () => {
      atualizar((d) => ({ ...d, ultimaCopia: new Date().toISOString() }));
      setAviso({
        tipo: "ok",
        texto:
          "Cópia salva. Guarde o arquivo num lugar seguro, como Arquivos, Drive ou o seu WhatsApp.",
      });
    };
    // No celular, abre a folha de compartilhar (salvar em Arquivos, mandar para si mesma…).
    if (typeof navigator.canShare === "function" && navigator.canShare({ files: [arquivo] })) {
      try {
        await navigator.share({ files: [arquivo], title: "Cópia do meu diário de hábitos" });
        marcar();
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    // Senão, baixa o arquivo.
    const url = URL.createObjectURL(arquivo);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    marcar();
  };

  const escolherArquivo = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    if (arquivo.size > 2_000_000) {
      setAviso({
        tipo: "erro",
        texto: "Esse arquivo é grande demais para ser uma cópia do diário.",
      });
      return;
    }
    const lido = lerCopia(await arquivo.text());
    if (!lido) {
      setAviso({ tipo: "erro", texto: "Esse arquivo não é uma cópia do diário." });
      return;
    }
    setAviso(null);
    setPendente(lido);
  };

  const confirmar = () => {
    if (!pendente) return;
    const n = contarDias(pendente.dados);
    // A cópia foi feita antes de a data ser marcada: a "última cópia" é a data do próprio arquivo.
    onRestaurar({
      ...pendente.dados,
      ultimaCopia: pendente.dados.ultimaCopia ?? pendente.exportadoEm,
    });
    setPendente(null);
    setAviso({
      tipo: "ok",
      texto: `Cópia restaurada: ${n} ${n === 1 ? "dia" : "dias"} de registros.`,
    });
  };

  return (
    <section aria-labelledby="hab-copia">
      <h2 id="hab-copia" className="font-serif-display text-xl text-foreground">
        Cópia de segurança
      </h2>
      <p className="mt-1 text-pretty">
        Seus registros ficam só neste celular. Guarde uma cópia de vez em quando: se o celular
        apagar os dados do site ou você trocar de aparelho, é só restaurar.
      </p>
      <p className="mt-1 text-xs">
        {ultima
          ? `Última cópia: ${diaCurto(chaveDe(ultima))}.`
          : "Você ainda não salvou nenhuma cópia."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={salvarCopia} className={classeBotao}>
          <Download size={16} aria-hidden="true" />
          Salvar cópia
        </button>
        <button type="button" onClick={() => entrada.current?.click()} className={classeBotao}>
          <Upload size={16} aria-hidden="true" />
          Restaurar cópia
        </button>
        <input
          ref={entrada}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={escolherArquivo}
        />
      </div>
      {pendente && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-foreground"
        >
          <p className="text-pretty">
            Restaurar a cópia
            {pendente.exportadoEm
              ? ` de ${diaCurto(chaveDe(new Date(pendente.exportadoEm)))}`
              : ""}{" "}
            ({contarDias(pendente.dados)} dias de registros)? O que está neste celular agora será
            substituído.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={confirmar}
              className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Restaurar
            </button>
            <button type="button" onClick={() => setPendente(null)} className={classeBotao}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {aviso && (
        <p
          role="status"
          className={`mt-3 text-sm text-pretty ${aviso.tipo === "erro" ? "text-destructive" : "text-[#FBE2A7]"}`}
        >
          {aviso.texto}
        </p>
      )}
    </section>
  );
}

/** "Seu nome no diário: Ana · Trocar" (link encaminhado para outra pessoa ou nome digitado errado). */
function TrocarNome({ nome, onSalvar }: { nome: string; onSalvar: (nome: string) => void }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nome);
  const campo = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editando) campo.current?.focus();
  }, [editando]);

  if (!editando)
    return (
      <p className="text-pretty">
        Seu nome no diário:{" "}
        <strong className="font-semibold text-foreground">{nome || "não informado"}</strong>{" "}
        <button
          type="button"
          onClick={() => {
            setValor(nome);
            setEditando(true);
          }}
          className="ml-1 text-gold underline underline-offset-2 hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Trocar
        </button>
      </p>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const novo = limparNome(valor);
        if (novo) onSalvar(novo);
        setEditando(false);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <label htmlFor="hab-trocar-nome" className="w-full text-sm text-foreground">
        Como você quer ser chamada?
      </label>
      <input
        id="hab-trocar-nome"
        ref={campo}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        maxLength={40}
        autoComplete="given-name"
        className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-[16px] text-foreground focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
      />
      <button
        type="submit"
        className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Salvar
      </button>
      <button type="button" onClick={() => setEditando(false)} className={classeBotao}>
        Cancelar
      </button>
    </form>
  );
}

function BotaoApagar({ onApagar }: { onApagar: () => void }) {
  const [confirmar, setConfirmar] = useState(false);
  useEffect(() => {
    if (!confirmar) return;
    const t = window.setTimeout(() => setConfirmar(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirmar]);
  return (
    <button
      type="button"
      onClick={() => (confirmar ? onApagar() : setConfirmar(true))}
      className={`min-h-11 rounded-lg border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        confirmar
          ? "border-destructive text-destructive"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {confirmar ? "Toque de novo para apagar tudo" : "Apagar meus registros deste aparelho"}
    </button>
  );
}

function usePlataforma(): Plataforma {
  const [p, setP] = useState<Plataforma>("outro");
  useEffect(() => {
    const ua = navigator.userAgent;
    const instalado =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (instalado) return;
    if (
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    )
      setP("ios");
    else if (/Android/.test(ua)) setP("android");
  }, []);
  return p;
}

function DicaTelaInicial({ plataforma }: { plataforma: Exclude<Plataforma, "outro"> }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 px-4 py-3.5 text-left text-sm">
      <p className="font-semibold text-foreground">Deixe o diário na tela do celular</p>
      {plataforma === "ios" ? (
        <p className="mt-1 leading-relaxed text-muted-foreground text-pretty">
          No Safari, toque em{" "}
          <Share size={15} className="inline align-[-2px] text-foreground" aria-hidden="true" />{" "}
          Compartilhar e depois em “Adicionar à Tela de Início”.
        </p>
      ) : (
        <p className="mt-1 leading-relaxed text-muted-foreground text-pretty">
          No Chrome, toque em{" "}
          <EllipsisVertical
            size={15}
            className="inline align-[-2px] text-foreground"
            aria-hidden="true"
          />{" "}
          e depois em “Adicionar à tela inicial”.
        </p>
      )}
    </div>
  );
}

/* ---------------- Presente (primeira vez) ---------------- */

const entrada: Variants = {
  ini: { opacity: 0, y: 16 },
  fim: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const revelarFoto: Variants = {
  ini: { clipPath: "inset(100% 0% 0% 0%)" },
  fim: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1, ease: EASE } },
};

function BoasVindas({ nome, onAbrir }: { nome: string; onAbrir: (nome: string) => void }) {
  const [digitado, setDigitado] = useState("");
  // Link encaminhado por outra aluna ou nome digitado errado pela Lindy: "Não é você? Trocar nome".
  const [trocando, setTrocando] = useState(false);
  const nomeMostrado = trocando ? limparNome(digitado) : nome;
  const pedirNome = !nome || trocando;
  const plataforma = usePlataforma();
  const reduzir = useReducedMotion();
  const dialogo = useRef<HTMLDivElement>(null);

  // O foco vai para o próprio presente (leitor de tela começa por ele), sem moldura visível.
  useEffect(() => {
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = antes;
    };
  }, []);

  return (
    <motion.div
      ref={dialogo}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hab-presente-titulo"
      className="fixed inset-0 z-50 overflow-y-auto bg-background outline-none"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: EASE_CORTINA }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-10">
        <motion.div
          initial={reduzir ? "fim" : "ini"}
          animate="fim"
          variants={{ fim: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          <motion.div variants={entrada}>
            <Logo grande />
          </motion.div>

          <div className="mt-8 flex items-end gap-5">
            <motion.figure
              variants={revelarFoto}
              className="relative h-[13.5rem] w-[10.25rem] shrink-0 overflow-hidden rounded-t-full border border-gold/40 bg-card"
            >
              <img
                src="/habitos-lindy.webp"
                srcSet="/habitos-lindy-400.webp 400w, /habitos-lindy.webp 600w"
                sizes="164px"
                alt="Lindy Ribeiro, sua personal, na academia"
                width={600}
                height={800}
                decoding="async"
                className="h-full w-full object-cover object-[50%_30%]"
              />
            </motion.figure>
            <motion.p
              variants={entrada}
              className="pb-2 font-serif-display text-lg italic leading-snug text-gold text-balance"
            >
              Diário de hábitos da sua consultoria
            </motion.p>
          </div>

          <motion.h1
            variants={entrada}
            id="hab-presente-titulo"
            className="mt-9 font-serif-display text-[2.9rem] leading-[1.02] text-foreground"
          >
            {nomeMostrado ? (
              <>
                {nomeMostrado},
                <br />
              </>
            ) : null}
            <span className="relative inline-block italic text-gradient-gold">
              preparei isso para você.
              <TracoDourado
                atraso={reduzir ? 0 : 0.9}
                className="absolute -bottom-2 left-0 h-2.5 w-full"
              />
            </span>
          </motion.h1>

          {nome && !trocando && (
            <motion.div variants={entrada} className="mt-6">
              <button
                type="button"
                onClick={() => setTrocando(true)}
                className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Não é você? Trocar nome
              </button>
            </motion.div>
          )}

          <motion.p
            variants={entrada}
            className="mt-8 text-[15px] leading-relaxed text-muted-foreground text-pretty"
          >
            Um diário para acompanhar você em cada dia da consultoria. Marque seus hábitos,
            acompanhe a sua semana e, no fim dela, me mande o resumo pelo WhatsApp.
          </motion.p>

          <motion.blockquote
            variants={entrada}
            className="mt-6 border-l-2 border-gold/60 pl-4 font-serif-display text-xl italic leading-snug text-[#FBE2A7] text-balance"
          >
            “{FRASE_LINDY}”
          </motion.blockquote>

          {pedirNome && (
            <motion.div variants={entrada} className="mt-8">
              <label htmlFor="hab-nome" className="block text-sm font-medium text-foreground">
                {trocando ? "Qual é o seu nome?" : "Como você quer ser chamada?"}
              </label>
              <input
                id="hab-nome"
                value={digitado}
                onChange={(e) => setDigitado(e.target.value)}
                maxLength={40}
                autoComplete="given-name"
                autoFocus={trocando}
                className="mt-2 min-h-12 w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground focus:border-gold/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
                placeholder="Seu primeiro nome"
              />
            </motion.div>
          )}

          {plataforma !== "outro" && (
            <motion.div variants={entrada} className="mt-6">
              <DicaTelaInicial plataforma={plataforma} />
            </motion.div>
          )}

          <motion.button
            variants={entrada}
            type="button"
            onClick={() => onAbrir(digitado.trim())}
            whileTap={{ scale: 0.98 }}
            className="btn-shine mt-8 flex min-h-[3.25rem] w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Abrir meu diário
          </motion.button>

          <motion.p variants={entrada} className="mt-6 text-center text-xs text-muted-foreground">
            {ASSINATURA_LINDY}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
