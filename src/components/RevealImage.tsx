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
              transform: visible
                ? "perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) scale(1)"
                : "perspective(1200px) translate3d(0, 30px, -90px) rotateX(6deg) scale(0.97)",
              transformOrigin: "center 60%",
              backfaceVisibility: "hidden",
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
