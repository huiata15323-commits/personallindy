import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../components/LandingPage";
import { faqItems } from "../components/FAQ";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Lindy | Transforme Seu Corpo" },
      { name: "description", content: "Consultoria fitness online com treinos personalizados e acompanhamento direto com Lindyara Ribeiro, Personal Trainer. Resultados reais garantidos." },
      { property: "og:title", content: "Personal Lindy | Transforme Seu Corpo" },
      { property: "og:description", content: "Consultoria fitness online com treinos personalizados e acompanhamento direto com Lindyara Ribeiro, Personal Trainer. Resultados reais garantidos." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://personallindy.com.br" },
      { property: "og:image", content: "https://personallindy.com.br/og-image.jpg?v=3" },
      { property: "og:image:url", content: "https://personallindy.com.br/og-image.jpg?v=3" },
      { property: "og:image:secure_url", content: "https://personallindy.com.br/og-image.jpg?v=3" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Personal Lindy - Consultoria Fitness Online com Lindyara Ribeiro" },
      { name: "twitter:image", content: "https://personallindy.com.br/og-image.jpg?v=3" },
      { name: "twitter:image:alt", content: "Personal Lindy - Consultoria Fitness Online com Lindyara Ribeiro" },
    ],
    links: [
      { rel: "canonical", href: "https://personallindy.com.br" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Personal Lindy - Lindyara Ribeiro",
          image: "https://personallindy.com.br/og-image.jpg",
          url: "https://personallindy.com.br",
          telephone: "+55-62-98481-1499",
          address: {
            "@type": "PostalAddress",
            addressCountry: "BR",
            addressRegion: "GO",
          },
          priceRange: "R$",
          description: "Consultoria fitness online com treinos personalizados e acompanhamento direto com Lindyara Ribeiro, Personal Trainer. Resultados reais garantidos.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
