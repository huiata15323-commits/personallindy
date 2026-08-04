import { useEffect, useRef, useState } from "react";

type RevealImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  delay?: number;
};

export default function RevealImage({ className = "", style, delay = 0, ...props }: RevealImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(reduced
          ? {}
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
              transition:
                "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${delay}ms`,
              willChange: "opacity, transform",
            }),
      }}
      {...props}
    />
  );
}
