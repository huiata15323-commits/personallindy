// Diário de hábitos das alunas da consultoria (rota /habitos).
// Tudo fica no aparelho da aluna (localStorage): nada vai para servidor nem para o Analytics.
// O resumo da semana só sai quando ela mesma toca em "Enviar pra Lindy" (abre o WhatsApp).
// A lista de hábitos é a da folha original da Lindy, com os textos corrigidos e agrupados.

export const WHATSAPP_LINDY = "5562984811499";
export const FRASE_LINDY = "Você não terá sempre motivação. Aprenda a ter disciplina.";
export const ASSINATURA_LINDY = "Lindy Ribeiro · Personal Trainer · CREF 010437/GO";
/** Itálico de verdade da Cormorant, só nas páginas do diário (o site carrega só a versão reta). */
export const FONTE_ITALICO =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap";
const CHAVE = "pl-habitos-v1";

export type HabitoId =
  | "alimentacao"
  | "proteina"
  | "agua"
  | "semtela"
  | "treino"
  | "foco"
  | "ativa"
  | "sono"
  | "afirmacoes"
  | "pele"
  | "financas";
export type Treino = "feito" | "descanso" | "nao";
export type Humor = 1 | 2 | 3 | 4 | 5;
export type Sinal = "TPM" | "Ansiedade" | "Nervosismo" | "Cansaço";

export interface Habito {
  id: HabitoId;
  texto: string;
  curto: string;
  dica?: string;
  /** "treino" tem três respostas: feito, descanso ou não fiz */
  tipo?: "treino";
  /** só conta nos dias em que o treino foi feito */
  soComTreino?: boolean;
}

export interface Grupo {
  id: string;
  titulo: string;
  habitos: Habito[];
}

export const GRUPOS: Grupo[] = [
  {
    id: "alimentacao",
    titulo: "Alimentação",
    habitos: [
      {
        id: "alimentacao",
        texto: "Alimentação saudável, com legumes, verduras e frutas",
        curto: "Alimentação saudável",
      },
      {
        id: "proteina",
        texto: "Ingeriu fontes de proteína",
        dica: "ovo, frango, whey, carne magra",
        curto: "Proteína",
      },
      { id: "agua", texto: "Bebeu pelo menos 2 litros de água", curto: "Água (2 litros)" },
      { id: "semtela", texto: "Se alimentou sem TV e sem celular", curto: "Refeição sem tela" },
    ],
  },
  {
    id: "movimento",
    titulo: "Treino e movimento",
    habitos: [
      { id: "treino", texto: "Treino do dia", curto: "Treino", tipo: "treino" },
      {
        id: "foco",
        texto: "Deu o seu melhor em cada exercício, com a mente focada no treino",
        curto: "Foco no treino",
        soComTreino: true,
      },
      {
        id: "ativa",
        texto: "Manteve-se ativa ao máximo nas atividades do dia",
        dica: "escada em vez do elevador, levantar para pegar algo em vez de pedir a alguém",
        curto: "Dia ativo",
      },
    ],
  },
  {
    id: "voce",
    titulo: "Descanso e cuidado com você",
    habitos: [
      { id: "sono", texto: "Dormiu pelo menos 7 horas", curto: "Sono (7 horas)" },
      {
        id: "afirmacoes",
        texto: "Declarou palavras afirmativas no decorrer do dia",
        curto: "Palavras afirmativas",
      },
      { id: "pele", texto: "Fez os cuidados com a pele", curto: "Cuidados com a pele" },
      { id: "financas", texto: "Cuidou e controlou a vida financeira", curto: "Vida financeira" },
    ],
  },
];

export const HABITOS: Habito[] = GRUPOS.flatMap((g) => g.habitos);
export const SINAIS: Sinal[] = ["TPM", "Ansiedade", "Nervosismo", "Cansaço"];
export const HUMOR_ROTULOS = ["Muito mal", "Mal", "Mais ou menos", "Bem", "Muito bem"] as const;

export interface Dia {
  feitos: HabitoId[];
  treino?: Treino;
  humor?: Humor;
  sinais?: Sinal[];
}

export interface Fechamento {
  dificuldades: string;
  plano: string;
  enviadoEm?: string;
}

export interface Dados {
  versao: 1;
  nome: string;
  criadoEm: string;
  boasVindas: boolean;
  dias: Record<string, Dia>;
  semanas: Record<string, Fechamento>;
}

export function novoDados(hoje: string): Dados {
  return { versao: 1, nome: "", criadoEm: hoje, boasVindas: false, dias: {}, semanas: {} };
}

export function carregar(): Dados | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const d = JSON.parse(bruto) as Partial<Dados>;
    if (!d || d.versao !== 1 || typeof d.criadoEm !== "string") return null;
    return {
      versao: 1,
      nome: typeof d.nome === "string" ? d.nome : "",
      criadoEm: d.criadoEm,
      boasVindas: !!d.boasVindas,
      dias: d.dias && typeof d.dias === "object" ? d.dias : {},
      semanas: d.semanas && typeof d.semanas === "object" ? d.semanas : {},
    };
  } catch {
    return null;
  }
}

/** Devolve false quando o navegador não deixa salvar (modo privado, armazenamento cheio). */
export function salvar(d: Dados): boolean {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
}

export function apagarTudo() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a apagar */
  }
}

/** Nome que vem no link do presente: personallindy.com.br/habitos#Ana */
export function nomeDoLink(hash: string): string {
  if (!hash || hash.length < 2) return "";
  let bruto = hash.slice(1);
  try {
    bruto = decodeURIComponent(bruto);
  } catch {
    /* mantém como veio */
  }
  const limpo = bruto
    .replace(/[+_-]/g, " ") // no link, espaço vai como hífen: #Ana-Paula
    .replace(/[^\p{L}\p{M}' -]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  return limpo
    .split(" ")
    .map((p) => (p ? p.charAt(0).toLocaleUpperCase("pt-BR") + p.slice(1) : p))
    .join(" ");
}

// ---------- Datas (sempre no fuso do aparelho) ----------

export function chaveDe(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function dataDe(chave: string): Date {
  const [a, m, d] = chave.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function somarDias(chave: string, n: number): string {
  const d = dataDe(chave);
  d.setDate(d.getDate() + n);
  return chaveDe(d);
}

/** A semana vai de domingo a sábado, como na folha da Lindy. */
export function inicioDaSemana(chave: string): string {
  return somarDias(chave, -dataDe(chave).getDay());
}

export function diasDaSemana(inicio: string): string[] {
  return Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
}

export const LETRAS_DIAS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function diaCurto(chave: string): string {
  const d = dataDe(chave);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function dataPorExtenso(chave: string): string {
  const txt = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(dataDe(chave))
    .replace("-feira", ""); // "Segunda, 2 de novembro" cabe numa linha no celular
  return txt.charAt(0).toLocaleUpperCase("pt-BR") + txt.slice(1);
}

export function intervaloDaSemana(inicio: string): string {
  const fmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
  const limpar = (s: string) => s.replace(/\./g, "").replace(" de ", " ");
  return `${limpar(fmt.format(dataDe(inicio)))} a ${limpar(fmt.format(dataDe(somarDias(inicio, 6))))}`;
}

// ---------- Pontuação ----------

/** Hábitos que contam no dia: o foco só entra quando o treino foi feito. */
export function aplicaveis(dia?: Dia): HabitoId[] {
  return HABITOS.filter((h) => !h.soComTreino || dia?.treino === "feito").map((h) => h.id);
}

export function cumprido(dia: Dia | undefined, id: HabitoId): boolean {
  if (!dia) return false;
  if (id === "treino") return dia.treino === "feito" || dia.treino === "descanso";
  if (id === "foco") return dia.treino === "feito" && dia.feitos.includes("foco");
  return dia.feitos.includes(id);
}

export function pontosDoDia(dia?: Dia): { feitos: number; total: number } {
  const lista = aplicaveis(dia);
  return { feitos: lista.filter((id) => cumprido(dia, id)).length, total: lista.length };
}

export function temRegistro(dia?: Dia): boolean {
  return (
    !!dia && (dia.feitos.length > 0 || !!dia.treino || !!dia.humor || (dia.sinais?.length ?? 0) > 0)
  );
}

function primeiroDia(dados: Dados): string {
  const comRegistro = Object.keys(dados.dias).filter((k) => temRegistro(dados.dias[k]));
  return [dados.criadoEm, ...comRegistro].sort()[0];
}

export interface ResumoSemana {
  inicio: string;
  dias: string[];
  contados: string[];
  feitos: number;
  total: number;
  porHabito: Record<HabitoId, { sim: number; de: number }>;
  treinos: { feito: number; descanso: number; nao: number };
  humorMedio: number | null;
  sinais: Record<Sinal, number>;
  forte?: HabitoId;
  caprichar?: HabitoId;
}

export function resumoDaSemana(dados: Dados, inicio: string, hoje: string): ResumoSemana {
  const dias = diasDaSemana(inicio);
  const desde = primeiroDia(dados);
  const contados = dias.filter((k) => k <= hoje && k >= desde);
  const porHabito = Object.fromEntries(
    HABITOS.map((h) => [h.id, { sim: 0, de: 0 }]),
  ) as ResumoSemana["porHabito"];
  const treinos = { feito: 0, descanso: 0, nao: 0 };
  const sinais = Object.fromEntries(SINAIS.map((s) => [s, 0])) as Record<Sinal, number>;
  const humores: number[] = [];
  let feitos = 0;
  let total = 0;

  for (const k of contados) {
    const dia = dados.dias[k];
    for (const id of aplicaveis(dia)) {
      porHabito[id].de += 1;
      total += 1;
      if (cumprido(dia, id)) {
        porHabito[id].sim += 1;
        feitos += 1;
      }
    }
    if (dia?.treino) treinos[dia.treino] += 1;
    if (dia?.humor) humores.push(dia.humor);
    for (const s of dia?.sinais ?? []) sinais[s] += 1;
  }

  let forte: HabitoId | undefined;
  let caprichar: HabitoId | undefined;
  if (contados.length >= 2) {
    const taxas = HABITOS.map((h) => ({
      id: h.id,
      de: porHabito[h.id].de,
      t: porHabito[h.id].sim / (porHabito[h.id].de || 1),
    })).filter((x) => x.de >= 2);
    const ordenadas = [...taxas].sort((a, b) => b.t - a.t);
    if (ordenadas.length && ordenadas[0].t > 0) forte = ordenadas[0].id;
    const fraca = ordenadas[ordenadas.length - 1];
    if (fraca && fraca.id !== forte && fraca.t < 1) caprichar = fraca.id;
  }

  return {
    inicio,
    dias,
    contados,
    feitos,
    total,
    porHabito,
    treinos,
    humorMedio: humores.length ? humores.reduce((a, b) => a + b, 0) / humores.length : null,
    sinais,
    forte,
    caprichar,
  };
}

/** Dias seguidos com alguma marcação, terminando hoje (ou ontem, se hoje ainda está em branco). */
export function sequencia(dados: Dados, hoje: string): number {
  let k = temRegistro(dados.dias[hoje]) ? hoje : somarDias(hoje, -1);
  let n = 0;
  while (temRegistro(dados.dias[k])) {
    n += 1;
    k = somarDias(k, -1);
  }
  return n;
}

export function porcentagem(feitos: number, total: number): number {
  return total ? Math.round((feitos / total) * 100) : 0;
}

export function nomeCurto(id: HabitoId): string {
  return HABITOS.find((h) => h.id === id)?.curto ?? id;
}

// ---------- Resumo para o WhatsApp ----------

export function textoDoResumo(dados: Dados, r: ResumoSemana, f: Fechamento): string {
  const n = r.contados.length;
  const linhas: string[] = [];
  linhas.push(dados.nome ? `Oi, Lindy! Aqui é a ${dados.nome} 🤎` : "Oi, Lindy! 🤎");
  linhas.push(
    `Meu resumo da semana de ${diaCurto(r.inicio)} a ${diaCurto(somarDias(r.inicio, 6))}:`,
  );
  linhas.push("");
  linhas.push(`Hábitos em dia: ${porcentagem(r.feitos, r.total)}% (${r.feitos} de ${r.total})`);
  linhas.push(
    `Treinos: ${r.treinos.feito} feito${r.treinos.feito === 1 ? "" : "s"}, ${r.treinos.descanso} de descanso, ${r.treinos.nao} sem treino`,
  );
  if (r.humorMedio !== null)
    linhas.push(`Humor médio: ${r.humorMedio.toFixed(1).replace(".", ",")} de 5`);
  const sinais = SINAIS.filter((s) => r.sinais[s] > 0).map(
    (s) => `${s} em ${r.sinais[s]} dia${r.sinais[s] === 1 ? "" : "s"}`,
  );
  if (sinais.length) linhas.push(`Senti: ${sinais.join(", ")}`);
  linhas.push("");
  for (const h of HABITOS) {
    if (h.id === "treino") continue;
    const p = r.porHabito[h.id];
    if (h.soComTreino && p.de === 0) continue;
    linhas.push(`• ${h.curto}: ${p.sim} de ${h.soComTreino ? p.de : n}`);
  }
  if (f.dificuldades.trim()) {
    linhas.push("");
    linhas.push("Minhas dificuldades nesta semana:");
    linhas.push(f.dificuldades.trim());
  }
  if (f.plano.trim()) {
    linhas.push("");
    linhas.push("O que vou fazer para avançar na próxima semana:");
    linhas.push(f.plano.trim());
  }
  return linhas.join("\n");
}

export function linkWhatsApp(texto: string, numero = WHATSAPP_LINDY): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
