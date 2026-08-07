import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-background/85 backdrop-blur-md border-t border-border"
        >
          <a
            href={`https://wa.me/5562984811499?text=${encodeURIComponent("Olá Lindy! Quero começar minha transformação.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => navigator.vibrate?.(12)}
            className="btn-shine flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold uppercase tracking-wide text-sm active:scale-[0.98] transition-transform"
          >
            <MessageCircle size={18} />
            Falar no WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
