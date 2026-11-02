import { createFileRoute } from "@tanstack/react-router";
import PresenteHabitos from "../../components/habitos/PresenteHabitos";
import { FONTE_ITALICO } from "../../lib/habitos";

// Página da Lindy: gera o link pessoal do diário e a mensagem de boas-vindas para cada aluna.
export const Route = createFileRoute("/habitos/presente")({
  head: () => ({
    meta: [
      { title: "Presente para uma aluna | Personal Lindy" },
      {
        name: "description",
        content:
          "Gere o link do diário de hábitos com o nome da aluna e a mensagem de boas-vindas.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#000001" },
    ],
    links: [{ rel: "stylesheet", href: FONTE_ITALICO }],
  }),
  component: PresenteHabitos,
});
