import { useEffect } from "react";

/** Troca o título da aba quando o visitante sai dela — reengaja ao voltar. */
export default function TabTitleSwitcher() {
  useEffect(() => {
    const original = document.title;
    const away = "🏋️ Volte! Sua transformação espera";

    const handleVisibility = () => {
      document.title = document.hidden ? away : original;
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.title = original;
    };
  }, []);

  return null;
}
