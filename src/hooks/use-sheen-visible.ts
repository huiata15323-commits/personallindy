import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on-screen and returns a ref + boolean.
 * Used to pause the `.title-sheen` background-position animation while a
 * heading is scrolled out of view — the sweep is a paint-triggering effect,
 * so skipping it off-screen avoids wasted work on long pages without
 * changing how it looks while visible.
 */
export function useSheenVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
      rootMargin: "80px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}
