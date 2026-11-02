import { createFileRoute } from "@tanstack/react-router";
import DiarioHabitos from "../../components/habitos/DiarioHabitos";
import { FONTE_ITALICO } from "../../lib/habitos";

// Diário de hábitos: presente da consultoria para as alunas (link personallindy.com.br/habitos#Nome).
// Fica fora do Google (noindex): é uma página para quem recebeu o link.
const TITULO = "Seu diário de hábitos | Personal Lindy";
const DESCRICAO =
  "Um presente da Lindy: marque seus hábitos todo dia e mande o resumo da semana para ela.";
const IMAGEM = "https://personallindy.com.br/og-habitos.jpg?v=1";
const ENDERECO = "https://personallindy.com.br/habitos";

export const Route = createFileRoute("/habitos/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#000001" },
      { name: "apple-mobile-web-app-title", content: "Hábitos" },
      { property: "og:title", content: "Seu diário de hábitos" },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { property: "og:url", content: ENDERECO },
      { property: "og:image", content: IMAGEM },
      { property: "og:image:url", content: IMAGEM },
      { property: "og:image:secure_url", content: IMAGEM },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Diário de hábitos, um presente da Personal Lindy" },
      { name: "twitter:title", content: "Seu diário de hábitos" },
      { name: "twitter:description", content: DESCRICAO },
      { name: "twitter:image", content: IMAGEM },
    ],
    links: [
      { rel: "canonical", href: ENDERECO },
      { rel: "apple-touch-icon", href: "/habitos-icone-180.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/habitos-icone-192.png" },
      { rel: "preload", as: "image", href: "/habitos-lindy.webp", type: "image/webp" },
      // O itálico de verdade da Cormorant (o site carrega só a reta, e o navegador inclinava as letras e
      // deslocava os acentos, como o "ê" de "você").
      { rel: "stylesheet", href: FONTE_ITALICO },
    ],
  }),
  component: DiarioHabitos,
});
