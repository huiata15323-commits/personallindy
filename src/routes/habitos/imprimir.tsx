import { createFileRoute } from "@tanstack/react-router";
import FolhaHabitos from "../../components/habitos/FolhaHabitos";
import { FONTE_ITALICO } from "../../lib/habitos";

// Folha A4 do diário para imprimir (e a origem do PDF em public/diario-de-habitos-lindy.pdf).
export const Route = createFileRoute("/habitos/imprimir")({
  head: () => ({
    meta: [
      { title: "Diário de hábitos para imprimir | Personal Lindy" },
      {
        name: "description",
        content: "Folha semanal do diário de hábitos da Personal Lindy, pronta para imprimir.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "stylesheet", href: FONTE_ITALICO }],
  }),
  component: FolhaHabitos,
});
