import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

/**
 * Cena 3D ambiente do Hero: uma gema dourada facetada que gira lentamente,
 * flutua e inclina suavemente conforme o cursor. Renderizada só no cliente
 * (carregada via lazy import) e desligada sob prefers-reduced-motion.
 * O loop de render pausa quando a aba está oculta (economia de bateria/CPU).
 */

function Scene() {
  const group = useRef<Group>(null);
  const gem = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05); // evita saltos após a aba voltar do background
    if (gem.current) {
      gem.current.rotation.y += d * 0.18;
      gem.current.rotation.x += d * 0.06;
      gem.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
    if (group.current) {
      // parallax suave: o conjunto inclina em direção ao cursor
      const targetY = state.pointer.x * 0.35;
      const targetX = -state.pointer.y * 0.22;
      const k = Math.min(1, d * 2.5);
      group.current.rotation.y += (targetY - group.current.rotation.y) * k;
      group.current.rotation.x += (targetX - group.current.rotation.x) * k;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.6} color="#ffdca0" />
      <pointLight position={[-5, -2, -3]} intensity={2.2} decay={0} color="#c8922e" />
      <pointLight position={[3, -4, 4]} intensity={1.1} decay={0} color="#fff0cf" />

      {/* Gema principal — icosaedro facetado, ouro metálico */}
      <mesh ref={gem}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#e6bf7a"
          metalness={1}
          roughness={0.24}
          flatShading
          emissive="#2a1d05"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Casca externa em wireframe — dá profundidade sem pesar */}
      <mesh scale={2.5}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#b98b34" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero3D() {
  const [enabled, setEnabled] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    // Só ligamos a cena WebGL em desktop capaz: ponteiro fino, tela larga,
    // memória suficiente e WebGL disponível. Em celular (qualquer versão) fica
    // desligado — a página usa as animações leves (CSS/Tilt) que já existem.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wide = window.innerWidth >= 1024;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMem = typeof mem === "number" && mem <= 4;
    if (reduced || !fine || !wide || lowMem || !hasWebGL()) return;
    setEnabled(true);

    const onVisibility = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!enabled) return null;

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
