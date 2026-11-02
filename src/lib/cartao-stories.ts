// Card 1080 × 1920 para a aluna postar a semana nos stories (e marcar a @personallindy).
// Desenhado no próprio celular, num canvas: nenhum dado sai do aparelho.
// Mostra só números agregados (porcentagem, treinos, dias marcados). Humor e sinais ficam de fora.

const PRETO = "#000001";
const DOURADO = "#C79E41";
const CHAMPANHE = "#FBE2A7";
const OURO_VELHO = "#B88513";
const BRANCO = "#F5F5F5";
const CINZA = "#9A9AA2";
const TRILHA = "#24242A";

export interface DadosCartao {
  intervalo: string;
  porcentagem: number;
  treinos: number;
  diasMarcados: number;
  /** progresso de cada dia (domingo a sábado), de 0 a 1, ou null quando o dia não conta */
  dias: (number | null)[];
  frase: string;
}

const L = 1080;
const A = 1920;

function ouro(ctx: CanvasRenderingContext2D, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, CHAMPANHE);
  g.addColorStop(0.45, DOURADO);
  g.addColorStop(1, OURO_VELHO);
  return g;
}

function centralizado(
  ctx: CanvasRenderingContext2D,
  texto: string,
  y: number,
  fonte: string,
  cor: string | CanvasGradient,
) {
  ctx.font = fonte;
  ctx.fillStyle = cor;
  ctx.textAlign = "center";
  ctx.fillText(texto, L / 2, y);
}

async function carregarFontes() {
  if (!document.fonts?.load) return;
  const fontes = [
    '400 72px "Bebas Neue"',
    '600 120px "Cormorant Garamond"',
    'italic 500 60px "Cormorant Garamond"',
    '300 300px "Inter"',
    '500 44px "Inter"',
    '600 44px "Inter"',
  ];
  await Promise.race([
    Promise.all(fontes.map((f) => document.fonts.load(f))),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
}

export async function gerarCartao(d: DadosCartao): Promise<Blob> {
  await carregarFontes();
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponível");

  ctx.fillStyle = PRETO;
  ctx.fillRect(0, 0, L, A);

  // moldura fina dourada
  ctx.strokeStyle = "rgba(199, 158, 65, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  // roundRect não existe no Safari do iOS 15: lá a moldura sai com cantos retos
  if (typeof ctx.roundRect === "function") ctx.roundRect(56, 56, L - 112, A - 112, 40);
  else ctx.rect(56, 56, L - 112, A - 112);
  ctx.stroke();

  // logo: PERSONAL (Bebas Neue) + Lindy (Cormorant itálico, dourado) + o traço do site
  ctx.textBaseline = "alphabetic";
  ctx.font = '400 76px "Bebas Neue", sans-serif';
  const larguraPersonal = ctx.measureText("PERSONAL").width;
  ctx.font = 'italic 600 112px "Cormorant Garamond", serif';
  const larguraLindy = ctx.measureText("Lindy").width;
  const espaco = 22;
  const inicio = (L - (larguraPersonal + espaco + larguraLindy)) / 2;
  ctx.textAlign = "left";
  ctx.font = '400 76px "Bebas Neue", sans-serif';
  ctx.fillStyle = BRANCO;
  ctx.fillText("PERSONAL", inicio, 262);
  ctx.font = 'italic 600 112px "Cormorant Garamond", serif';
  ctx.fillStyle = ouro(ctx, inicio + larguraPersonal, inicio + larguraPersonal + larguraLindy);
  ctx.fillText("Lindy", inicio + larguraPersonal + espaco, 262);

  const tracoX0 = inicio + larguraPersonal + espaco;
  const tracoL = larguraLindy;
  const traco = ctx.createLinearGradient(tracoX0, 0, tracoX0 + tracoL, 0);
  traco.addColorStop(0, "rgba(184, 133, 19, 0)");
  traco.addColorStop(0.5, DOURADO);
  traco.addColorStop(1, "rgba(251, 226, 167, 0)");
  ctx.strokeStyle = traco;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  const y0 = 292;
  ctx.moveTo(tracoX0 + tracoL * 0.02, y0 + 4);
  ctx.quadraticCurveTo(tracoX0 + tracoL * 0.25, y0 - 6, tracoX0 + tracoL * 0.5, y0);
  ctx.quadraticCurveTo(tracoX0 + tracoL * 0.75, y0 + 6, tracoX0 + tracoL * 0.98, y0 - 4);
  ctx.stroke();

  centralizado(ctx, "Minha semana", 560, '600 108px "Cormorant Garamond", serif', BRANCO);
  centralizado(ctx, d.intervalo, 636, '500 42px "Inter", sans-serif', CINZA);

  // a porcentagem é o centro do card (em Inter: no canvas não dá para ligar os números
  // alinhados da Cormorant, e os dela "à moda antiga" ficariam de alturas diferentes)
  centralizado(
    ctx,
    `${d.porcentagem}%`,
    1000,
    '300 300px "Inter", sans-serif',
    ouro(ctx, 220, 860),
  );
  centralizado(ctx, "dos hábitos em dia", 1092, '500 46px "Inter", sans-serif', BRANCO);

  // sete anéis, um por dia, com o progresso de cada um
  const letras = ["D", "S", "T", "Q", "Q", "S", "S"];
  const passo = 128;
  const x0 = L / 2 - passo * 3;
  const cy = 1290;
  const raio = 44;
  d.dias.forEach((v, i) => {
    const cx = x0 + passo * i;
    ctx.lineWidth = 9;
    ctx.strokeStyle = TRILHA;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();
    if (v && v > 0) {
      ctx.strokeStyle = v >= 1 ? DOURADO : "rgba(199, 158, 65, 0.85)";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, raio, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(v, 1));
      ctx.stroke();
    }
    if (v !== null && v >= 1) {
      ctx.fillStyle = DOURADO;
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = '600 30px "Inter", sans-serif';
    ctx.fillStyle = v === null ? "#4A4A52" : CINZA;
    ctx.textAlign = "center";
    ctx.fillText(letras[i], cx, cy + raio + 52);
  });

  const treinos = `${d.treinos} ${d.treinos === 1 ? "treino" : "treinos"}`;
  const dias = `${d.diasMarcados} ${d.diasMarcados === 1 ? "dia marcado" : "dias marcados"}`;
  centralizado(ctx, `${treinos}  ·  ${dias}`, 1500, '500 44px "Inter", sans-serif', CHAMPANHE);

  // a frase da Lindy, em duas linhas
  const partes = d.frase.split(". ");
  const linha1 = partes.length > 1 ? `${partes[0]}.` : d.frase;
  const linha2 = partes.length > 1 ? partes.slice(1).join(". ") : "";
  centralizado(ctx, `“${linha1}`, 1660, 'italic 500 56px "Cormorant Garamond", serif', CHAMPANHE);
  if (linha2)
    centralizado(ctx, `${linha2}”`, 1728, 'italic 500 56px "Cormorant Garamond", serif', CHAMPANHE);

  centralizado(ctx, "@personallindy", 1806, '600 40px "Inter", sans-serif', DOURADO);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("falha ao gerar a imagem"))),
      "image/png",
    ),
  );
}
