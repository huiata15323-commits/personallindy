import { motion } from "framer-motion";

/** Traço dourado que se desenha ao entrar na tela. */
export default function GoldDivider() {
  return (
    <div className="px-4 sm:px-6" aria-hidden="true">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
        <motion.span
          className="h-px flex-1 origin-right bg-gradient-to-l from-gold/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="block w-1.5 h-1.5 rotate-45 bg-gold/70"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.35 }}
        />
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-gold/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
