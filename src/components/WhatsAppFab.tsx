import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

/**
 * Botão flutuante do WhatsApp — só desktop/tablet (md+), pois no mobile já
 * existe a barra fixa (MobileCTA). Aparece após rolar a primeira dobra.
 */
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={`https://wa.me/5562984811499?text=${encodeURIComponent("Olá Lindy! Quero começar minha transformação.")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="animate-ember fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_34px_-8px_rgba(0,0,0,0.75)] transition-transform hover:scale-110 md:flex"
        >
          <span className="fab-ping pointer-events-none absolute inset-0 rounded-full border border-gold/50" />
          <MessageCircle size={26} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
