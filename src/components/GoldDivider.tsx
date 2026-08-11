import { motion } from "framer-motion";

/** Divisor dourado que se desenha ao entrar na tela, com ornamento central. */
export default function GoldDivider() {
  return (
    <div className="px-4 sm:px-6" aria-hidden="true">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
        <motion.span
          className="h-px flex-1 origin-right bg-gradient-to-l from-gold/50 via-gold/20 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="relative flex items-center justify-center"
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span className="absolute h-4 w-4 rotate-45 rounded-[3px] border border-gold/40" />
          <span className="block h-1.5 w-1.5 rotate-45 bg-gold shadow-[0_0_10px_var(--color-gold)]" />
        </motion.span>
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-gold/50 via-gold/20 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
