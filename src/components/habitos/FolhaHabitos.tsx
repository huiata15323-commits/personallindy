import { ArrowLeft, Printer } from "lucide-react";
import { ASSINATURA_LINDY, FRASE_LINDY, GRUPOS } from "../../lib/habitos";
import { Logo } from "./comum";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Folha A4 deitada para imprimir (/habitos/imprimir). É dela que sai o PDF
 * public/diario-de-habitos-lindy.pdf. Papel branco, texto escuro e o ouro velho da marca.
 */
export default function FolhaHabitos() {
  return (
    <div className="folha-pagina relative z-10 min-h-screen py-6">
      <style>{CSS}</style>
      <div className="folha-acoes mx-auto mb-5 flex max-w-[297mm] flex-wrap items-center justify-between gap-3 px-4">
        <a
          href="/habitos"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm text-foreground hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar ao diário
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-shine inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Printer size={16} aria-hidden="true" />
          Imprimir ou salvar em PDF
        </button>
      </div>

      <div className="folha-rolagem overflow-x-auto px-4">
        <article className="folha mx-auto" aria-label="Diário de hábitos para imprimir">
          <header className="folha-topo">
            <div className="folha-marca">
              <Logo papel grande />
              <svg
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                className="folha-traco"
                aria-hidden="true"
              >
                <path
                  d="M2 7 Q 25 2, 50 5 T 98 3"
                  fill="none"
                  stroke="#B88513"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="folha-titulo">
              <h1>Diário de hábitos</h1>
              <p>
                Nome <span className="campo campo-nome" /> Semana de{" "}
                <span className="campo campo-data" />/<span className="campo campo-data" /> a{" "}
                <span className="campo campo-data" />/<span className="campo campo-data" />
              </p>
            </div>
          </header>

          <table>
            <colgroup>
              <col />
              {DIAS.map((d) => (
                <col key={d} className="col-dia" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="legenda">
                  Marque o que você cumpriu em cada dia.
                </th>
                {DIAS.map((d) => (
                  <th key={d} scope="col">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            {GRUPOS.map((g) => (
              <tbody key={g.id}>
                <tr className="grupo">
                  <th colSpan={8} scope="colgroup">
                    {g.titulo}
                  </th>
                </tr>
                {g.habitos.map((h) => (
                  <tr key={h.id} className="habito">
                    <th scope="row">
                      {h.tipo === "treino" ? "Treino do dia" : h.texto}
                      {h.tipo === "treino" && <small>✓ treinou · D dia de descanso</small>}
                      {h.soComTreino && <small>só nos dias de treino</small>}
                      {h.dica && <small>{h.dica}</small>}
                    </th>
                    {DIAS.map((d) => (
                      <td key={d}>
                        <span className="caixa" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
            <tbody>
              <tr className="grupo">
                <th colSpan={8} scope="colgroup">
                  Como você está
                </th>
              </tr>
              <tr className="habito">
                <th scope="row">
                  Humor e energia, de 1 a 5<small>1 muito mal · 5 muito bem</small>
                </th>
                {DIAS.map((d) => (
                  <td key={d}>
                    <span className="caixa" />
                  </td>
                ))}
              </tr>
              <tr className="habito">
                <th scope="row">
                  Algo mexeu com você?<small>T TPM · A ansiedade · N nervosismo · C cansaço</small>
                </th>
                {DIAS.map((d) => (
                  <td key={d}>
                    <span className="caixa" />
                  </td>
                ))}
              </tr>
              <tr className="habito total">
                <th scope="row">
                  Total do dia<small>quantos hábitos você cumpriu</small>
                </th>
                {DIAS.map((d) => (
                  <td key={d}>
                    <span className="caixa" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="folha-reflexao">
            <div>
              <p>Quais foram suas dificuldades nesta semana?</p>
              <span className="linha" />
              <span className="linha" />
            </div>
            <div>
              <p>O que você vai fazer para avançar na próxima semana?</p>
              <span className="linha" />
              <span className="linha" />
            </div>
          </div>

          <footer className="folha-rodape">
            <p className="frase">“{FRASE_LINDY}”</p>
            <p className="assinatura">{ASSINATURA_LINDY} · personallindy.com.br</p>
          </footer>
        </article>
      </div>
    </div>
  );
}

const CSS = `
@page { size: A4 landscape; margin: 0; }
.folha {
  width: 297mm; height: 210mm; box-sizing: border-box; padding: 8mm 12mm 6mm;
  display: flex; flex-direction: column; background: #fff; color: #141414;
  font-family: "Inter", sans-serif; font-feature-settings: "lnum" 1; box-shadow: 0 24px 70px rgba(0,0,0,.55);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.folha-topo { display: flex; align-items: flex-end; justify-content: space-between; gap: 10mm; padding-bottom: 2mm; }
.folha-marca { position: relative; padding-bottom: 2mm; }
.folha-traco { position: absolute; left: 34mm; bottom: 0; width: 26mm; height: 2.2mm; overflow: visible; }
.folha-titulo { text-align: right; }
.folha-titulo h1 { font-family: "Cormorant Garamond", serif; font-weight: 600; font-size: 22pt; line-height: 1; margin: 0; color: #141414; }
.folha-titulo p { margin: 1.6mm 0 0; font-size: 9pt; color: #5d5648; }
.campo { display: inline-block; border-bottom: 0.3mm solid #8f8670; height: 3.6mm; vertical-align: -0.6mm; margin: 0 1mm; }
.campo-nome { width: 58mm; margin-right: 5mm; }
.campo-data { width: 7mm; }
.folha table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.folha col.col-dia { width: 14.5mm; }
.folha thead th { font-size: 8.4pt; font-weight: 600; color: #5d5648; text-align: center; padding: 0 0 1.2mm; letter-spacing: .02em; }
.folha thead th.legenda { text-align: left; font-weight: 400; font-style: italic; font-family: "Cormorant Garamond", serif; font-size: 11pt; color: #6b6355; }
.folha tr.grupo th { text-align: left; font-family: "Cormorant Garamond", serif; font-style: italic; font-weight: 600; font-size: 12pt; color: #B88513; padding: 1.3mm 0 0.5mm; border-bottom: 0.35mm solid #B88513; }
.folha tr.habito th { text-align: left; font-weight: 400; font-size: 9pt; line-height: 1.15; padding: 0.75mm 4mm 0.75mm 0; border-bottom: 0.25mm solid #e6dfcf; }
.folha tr.habito th small { display: block; margin-top: 0.15mm; font-size: 7pt; color: #7d7563; }
.folha tr.habito td { text-align: center; vertical-align: middle; border-bottom: 0.25mm solid #e6dfcf; }
.folha tr.total th { font-weight: 600; }
.folha .caixa { display: inline-block; width: 4.6mm; height: 4.6mm; border: 0.3mm solid #b3a27a; border-radius: 1.2mm; }
.folha-reflexao { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; margin-top: 3mm; }
.folha-reflexao p { margin: 0 0 1mm; font-family: "Cormorant Garamond", serif; font-weight: 600; font-size: 11.5pt; color: #141414; }
.folha-reflexao .linha { display: block; height: 5.8mm; border-bottom: 0.25mm solid #cfc6b2; }
.folha-rodape { margin-top: auto; padding-top: 2mm; display: flex; align-items: baseline; justify-content: space-between; gap: 8mm; }
.folha-rodape .frase { margin: 0; font-family: "Cormorant Garamond", serif; font-style: italic; font-weight: 600; font-size: 12.5pt; color: #B88513; }
.folha-rodape .assinatura { margin: 0; font-size: 7.6pt; color: #7d7563; white-space: nowrap; }
@media print {
  html, body { background: #fff !important; }
  .folha-acoes { display: none !important; }
  .folha-pagina { padding: 0 !important; min-height: 0 !important; }
  .folha-rolagem { overflow: visible !important; padding: 0 !important; }
  .folha { box-shadow: none !important; margin: 0 !important; }
}
`;
