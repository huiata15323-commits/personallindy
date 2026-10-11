// Medição dos contatos pelo WhatsApp no Google Analytics 4 (G-0R6ZPS0P70, carregado no __root).
// Usa o evento recomendado "generate_lead" — no GA4 dá para marcá-lo como evento-chave (conversão).
// O parâmetro "origem" diz qual botão gerou o contato; nos planos vai também o valor do plano.
// Para ver "origem" nos relatórios: Administrador > Definições personalizadas > criar dimensão
// personalizada (escopo Evento) com o parâmetro "origem".

type Gtag = (...args: unknown[]) => void;

export type WhatsAppOrigem =
  | "topo"
  | "sobre"
  | "plano-mensal"
  | "plano-trimestral"
  | "fechamento"
  | "cabecalho"
  | "barra-celular"
  | "botao-flutuante"
  | "rodape"
  | "politica";

export function trackWhatsApp(origem: WhatsAppOrigem, valor?: number) {
  if (typeof window === "undefined") return;
  const params: Record<string, string | number> = {
    method: "WhatsApp",
    origem,
    // beacon: o evento é enviado mesmo quando a página sai logo em seguida para o WhatsApp
    transport_type: "beacon",
  };
  if (valor !== undefined) {
    params.value = valor;
    params.currency = "BRL";
  }
  const w = window as Window & { gtag?: Gtag; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", params);
  } else {
    (w.dataLayer ??= []).push({ event: "generate_lead", ...params });
  }
}
