"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import type { createStudio, StudioView } from "@/lib/studio-scene";

export function BikeStudio() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<Awaited<ReturnType<typeof createStudio>> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [view, setView] = useState<StudioView>("perspective");

  useEffect(() => {
    const network = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      network.connection?.saveData ||
      innerWidth < 700
    )
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAttempt(1);
        observer.disconnect();
      }
    });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!attempt || !host.current) return;
    const element = host.current;
    const controller = new AbortController();
    let active = true;
    const fail = () => {
      if (active) {
        setState("error");
        scene.current?.dispose();
        scene.current = null;
      }
    };
    const timer = setTimeout(() => {
      fail();
      controller.abort();
    }, 20000);
    const start = requestAnimationFrame(() => {
      if (!active || controller.signal.aborted) return;
      setState("loading");
      import("@/lib/studio-scene")
        .then(({ createStudio }) =>
          createStudio(element, controller.signal, fail),
        )
        .then((instance) => {
          if (!active || controller.signal.aborted) {
            instance.dispose();
            return;
          }
          clearTimeout(timer);
          scene.current = instance;
          setView("perspective");
          setState("ready");
        })
        .catch(() => {
          clearTimeout(timer);
          if (!controller.signal.aborted) fail();
        });
    });
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
      cancelAnimationFrame(start);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [attempt]);

  const changeView = (next: StudioView) => {
    scene.current?.setView(next);
    setView(next);
  };
  return (
    <div className="bike-studio" data-state={state} data-view={view}>
      <div className="studio-floor" aria-hidden="true" />
      <div
        ref={host}
        className="studio-canvas"
        role="img"
        aria-label="Estúdio 3D demonstrativo de bicicleta INOW V20 Brake Pro"
      />
      {state !== "ready" && (
        <div className="studio-placeholder">
          <Image
            src="/images/v40-pro.webp"
            alt="V40 Pro fotografada no Rio de Janeiro"
            width={596}
            height={596}
            priority
          />
          <div className="studio-start">
            {state === "loading" ? (
              <p role="status">
                <LoaderCircle className="spinner" size={18} /> Preparando seu
                olhar em 360°
              </p>
            ) : (
              <>
                {state === "error" && (
                  <p role="status">
                    O 3D não carregou. As fotos e o catálogo continuam
                    disponíveis.
                  </p>
                )}
                <button
                  className="button button-accent"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <Box size={18} />
                  {state === "error" ? "Tentar 3D novamente" : "Explorar em 3D"}
                </button>
                <span>Foto: V40 Pro · 3D: modelo demonstrativo</span>
              </>
            )}
          </div>
        </div>
      )}
      {state === "ready" && (
        <div className="studio-controls" aria-label="Controles do modelo 3D">
          <div className="studio-views">
            <button
              aria-pressed={view === "perspective"}
              aria-label="Vista em perspectiva"
              onClick={() => changeView("perspective")}
            >
              <RotateCcw size={16} />
              <span>Perspectiva</span>
            </button>
            <button
              aria-pressed={view === "side"}
              aria-label="Vista lateral"
              onClick={() => changeView("side")}
            >
              Lateral
            </button>
            <button
              aria-pressed={view === "front"}
              aria-label="Vista frontal"
              onClick={() => changeView("front")}
            >
              Frontal
            </button>
          </div>
          <div className="studio-turn">
            <button
              aria-label="Girar bicicleta para a esquerda"
              onClick={() => scene.current?.rotate(-0.3)}
            >
              <ArrowLeft size={18} />
            </button>
            <span>Arraste para explorar</span>
            <button
              aria-label="Girar bicicleta para a direita"
              onClick={() => scene.current?.rotate(0.3)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
      <p className="studio-disclaimer">
        INOW V20 Brake Pro · modelo demonstrativo
        <span>
          Representação ilustrativa. Os modelos à venda estão no catálogo
          abaixo.
        </span>
      </p>
    </div>
  );
}
