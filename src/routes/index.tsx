import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Lindy | Transforme Seu Corpo" },
      { name: "description", content: "Treinos personalizados e acompanhamento direto com Lindyara Rodrigues (Lindy). Conquiste resultados reais com uma Personal Trainer dedicada." },
      { property: "og:title", content: "Personal Lindy | Transforme Seu Corpo" },
      { property: "og:description", content: "Treinos personalizados e acompanhamento direto com Lindyara Rodrigues (Lindy). Conquiste resultados reais." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
