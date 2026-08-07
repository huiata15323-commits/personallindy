import { motion } from "framer-motion";
import { Dumbbell, Flame } from "lucide-react";

export default function PlanLaunch({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-6 text-center"
    >
      {/* anel de energia */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute h-40 w-40 rounded-full border-2 border-gold"
      />
      <motion.div
        initial={{ scale: 0.4, opacity: 0.7 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.18, ease: "easeOut" }}
        className="absolute h-40 w-40 rounded-full border border-gold/60"
      />

      {/* halter levantando */}
      <motion.div
        initial={{ y: 28, rotate: -12, opacity: 0, scale: 0.8 }}
        animate={{ y: [28, -10, 0], rotate: [-12, 6, 0], opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-gold"
      >
        <Dumbbell size={64} strokeWidth={1.5} />
      </motion.div>

      {/* barra de "carga" */}
      <div className="relative mt-8 h-1.5 w-56 max-w-[70vw] overflow-hidden rounded-full bg-dark-elevated">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
          className="h-full bg-primary"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="font-serif-display mt-6 text-2xl md:text-3xl text-foreground"
      >
        Bora <span className="text-gradient-gold italic">treinar</span>!
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Flame size={14} className="text-gold" />
        {label}
      </motion.p>
    </motion.div>
  );
}
