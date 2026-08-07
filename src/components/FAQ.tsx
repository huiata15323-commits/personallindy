import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export const faqItems = [
  {
    q: "Como funciona a consultoria online?",
    a: "Após a sua avaliação inicial, monto um treino 100% personalizado no aplicativo, com vídeos de execução. O acompanhamento é feito por WhatsApp, com ajustes sempre que necessário.",
  },
  {
    q: "Preciso treinar em academia?",
    a: "Não. Adapto o treino à sua realidade: academia, condomínio ou em casa com poucos equipamentos.",
  },
  {
    q: "Quanto tempo até ver resultados?",
    a: "Com constância, a maioria dos alunos percebe mudanças de disposição já nas primeiras semanas e resultados visíveis entre 8 e 12 semanas.",
  },
  {
    q: "A consultoria inclui dieta?",
    a: "O foco é o treino e o acompanhamento. Orientações nutricionais detalhadas devem ser feitas por um nutricionista, e posso indicar parceiros.",
  },
  {
    q: "Como faço o pagamento?",
    a: "Pix ou cartão. O plano mensal é R$ 100/mês e o trimestral sai por 3x R$ 95, com acesso por 90 dias.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif-display text-4xl md:text-5xl text-foreground text-center">
          Perguntas <span className="text-gradient-gold italic">frequentes</span>
        </h2>

        <div className="mt-10 md:mt-14 space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl bg-dark-elevated border-gold-subtle overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 md:px-6 md:py-5"
                >
                  <span className="text-foreground text-base md:text-lg">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gold shrink-0"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 md:px-6 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
