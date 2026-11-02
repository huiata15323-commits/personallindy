import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer } from "../components/LandingPage";
import { trackWhatsApp } from "../lib/analytics";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Personal Lindy" },
      {
        name: "description",
        content: "Política de Privacidade da Personal Lindy (Lindyara Ribeiro) — como tratamos seus dados, em conformidade com a LGPD.",
      },
    ],
    links: [{ rel: "canonical", href: "https://personallindy.com.br/politica-de-privacidade" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="bg-background pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Documento legal</span>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-foreground mt-2 mb-3 leading-[1.1]">
            Política de <span className="text-gradient-gold italic">Privacidade</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-12">Última atualização: 2 de novembro de 2026 (v4 — diário de hábitos das alunas)</p>

          <div className="space-y-10 text-base text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">1. Quem somos</h2>
              <p>
                Este site (<strong className="text-foreground">personallindy.com.br</strong>) é operado por{" "}
                <strong className="text-foreground">Lindyara Ribeiro</strong>, Personal Trainer registrada no CREF
                010437/GO, responsável pelo tratamento das informações tratadas nesta página, em conformidade com a
                Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">
                2. Quais dados coletamos
              </h2>
              <p>
                Este site <strong className="text-foreground">não possui formulários de cadastro</strong> e não
                coleta, armazena ou processa dados pessoais diretamente em seus servidores. Ao clicar em qualquer
                botão de "Falar no WhatsApp" ou "Começar agora", você é redirecionado ao aplicativo WhatsApp, e a
                conversa iniciada passa a ser regida pelas políticas de privacidade da Meta/WhatsApp — não temos
                acesso ao conteúdo dessas conversas além do que você compartilhar diretamente comigo.
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">
                3. Diário de hábitos das alunas
              </h2>
              <p className="mb-3">
                As alunas da consultoria recebem um link para o <strong className="text-foreground">diário de
                hábitos</strong> (personallindy.com.br/habitos). O que você marca nele (hábitos, treino, humor, como
                se sentiu e o fechamento da semana) fica guardado{" "}
                <strong className="text-foreground">só no seu aparelho</strong>, no armazenamento do navegador
                (<em>localStorage</em>). Nada disso é enviado a servidor nenhum nem ao Google Analytics.
              </p>
              <p className="mb-3">
                O resumo da semana só sai do seu aparelho quando você toca em "Enviar minha semana para a Lindy": o
                WhatsApp abre com o texto pronto e você decide se envia. Algumas dessas informações, como humor e
                TPM, são dados de saúde; por isso elas nunca saem sem esse toque seu. O card para os stories também é
                montado no próprio aparelho e mostra só os números da semana.
              </p>
              <p>
                O nome que vem no link do presente fica depois do "#" do endereço, parte que o navegador não envia ao
                site nem ao Analytics. Para apagar tudo, use o botão "Apagar meus registros deste aparelho", no fim
                do diário.
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">
                4. Cookies e ferramentas de análise
              </h2>
              <p className="mb-3">
                Utilizamos um pequeno recurso técnico do navegador (<em>sessionStorage</em>) para controlar a
                exibição da animação de abertura uma única vez por visita — essa informação fica só no seu aparelho,
                não identifica você e não é enviada a nenhum servidor.
              </p>
              <p>
                Também utilizamos o <strong className="text-foreground">Google Analytics</strong>, uma ferramenta de
                estatísticas que nos ajuda a entender, de forma agregada e anônima, quantas pessoas visitam o site,
                de onde vêm, quais páginas acessam e quantas vezes cada botão de WhatsApp é clicado (sem o conteúdo
                das conversas) — não usamos isso para identificar você individualmente nem para
                exibir anúncios. Não utilizamos ferramentas de publicidade de terceiros. Você pode saber mais sobre
                como o Google trata esses dados em{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  policies.google.com/privacy
                </a>
                , ou bloquear esse tipo de coleta usando extensões de navegador como o{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  Google Analytics Opt-out
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">
                5. Seus direitos (LGPD)
              </h2>
              <p>
                Caso você tenha compartilhado dados pessoais comigo por WhatsApp, telefone ou redes sociais, você
                pode, a qualquer momento, solicitar acesso, correção, anonimização ou exclusão dessas informações,
                bem como retirar o consentimento de uso, entrando em contato pelos canais abaixo.
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">
                6. Alterações nesta política
              </h2>
              <p>
                Esta política pode ser atualizada para refletir melhorias no site ou novas ferramentas (como
                análise de tráfego). Alterações relevantes serão indicadas pela data de "última atualização" no topo
                desta página.
              </p>
            </section>

            <section>
              <h2 className="font-serif-display text-2xl md:text-[1.7rem] text-foreground mb-3">7. Contato</h2>
              <p>
                Dúvidas sobre esta política ou sobre seus dados podem ser enviadas para{" "}
                <a
                  href="https://wa.me/5562984811499"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp("politica")}
                  className="text-gold hover:underline"
                >
                  (62) 98481-1499
                </a>{" "}
                (WhatsApp).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
