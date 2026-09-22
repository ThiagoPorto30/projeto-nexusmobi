"use client";

import Image from "next/image";
import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MoveHorizontal,
} from "lucide-react";

const BikeScene = lazy(() => import("./bike-scene"));
type ViewerState = "poster" | "loading" | "ready" | "fallback";

class ViewerBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function BikeViewer3D() {
  const wrapper = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<ViewerState>("poster");
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [orientation, setOrientation] = useState({ angle: 0, reset: 0 });

  const fail = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setState("fallback");
  }, []);
  const ready = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setState((previous) => (previous === "fallback" ? previous : "ready"));
  }, []);

  useEffect(() => {
    const small = matchMedia("(max-width: 479px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const updateSize = () => {
      setEnabled(!small.matches);
      if (small.matches) setState("poster");
    };
    const updateMotion = () => setReducedMotion(motion.matches);
    updateSize();
    updateMotion();
    small.addEventListener("change", updateSize);
    motion.addEventListener("change", updateMotion);
    const element = wrapper.current;
    let intersecting = false;
    const syncVisibility = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        syncVisibility();
      },
      { threshold: 0.05 },
    );
    if (element) observer.observe(element);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      small.removeEventListener("change", updateSize);
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !visible || state !== "poster") return;
    // A context probe avoids loading Three.js on devices that cannot render WebGL2.
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) {
      const id = requestAnimationFrame(fail);
      return () => cancelAnimationFrame(id);
    }
    context.getExtension("WEBGL_lose_context")?.loseContext();
    const id = requestAnimationFrame(() => setState("loading"));
    return () => cancelAnimationFrame(id);
  }, [enabled, visible, state, fail]);

  useEffect(() => {
    if (state !== "loading" || !enabled) return;
    timer.current = setTimeout(fail, 8000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state, enabled, fail]);

  const showCanvas = enabled && (state === "loading" || state === "ready");
  const isReady = enabled && state === "ready";
  return (
    <div
      ref={wrapper}
      className="bike-viewer"
      data-state={enabled ? state : "poster"}
    >
      <div
        className={`viewer-photo ${isReady ? "is-hidden" : ""}`}
        aria-hidden={isReady}
      >
        <Image
          src="/images/laf-comfort.webp"
          alt="Bike elétrica LAF Comfort branca, com banco marrom"
          fill
          priority
          sizes="(max-width: 899px) 92vw, 55vw"
        />
      </div>
      {showCanvas && (
        <div
          className={`viewer-canvas ${isReady ? "is-ready" : ""}`}
          aria-label="Visualização interativa da bicicleta INOW V20 Brake Pro"
          role="img"
        >
          <ViewerBoundary onError={fail}>
            <Suspense fallback={null}>
              <BikeScene
                visible={visible}
                reducedMotion={reducedMotion}
                orientation={orientation}
                onReady={ready}
                onError={fail}
              />
            </Suspense>
          </ViewerBoundary>
        </div>
      )}
      {isReady ? (
        <div className="viewer-toolbar">
          <span>
            <MoveHorizontal size={15} /> Arraste para explorar
          </span>
          <div>
            <button
              aria-label="Girar bicicleta para a esquerda"
              onClick={() =>
                setOrientation((p) => ({ ...p, angle: p.angle - 0.3 }))
              }
            >
              <ChevronLeft size={17} />
            </button>
            <button
              aria-label="Restaurar vista da bicicleta"
              onClick={() =>
                setOrientation((p) => ({ angle: 0, reset: p.reset + 1 }))
              }
            >
              <RotateCcw size={15} />
            </button>
            <button
              aria-label="Girar bicicleta para a direita"
              onClick={() =>
                setOrientation((p) => ({ ...p, angle: p.angle + 0.3 }))
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      ) : (
        <div className="viewer-photo-label">
          <span className="status-dot" /> LAF COMFORT{" "}
          <span>ESTILO EM MOVIMENTO</span>
        </div>
      )}
    </div>
  );
}
