"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { LeadLink } from "./lead-link";
const links = [
  { href: "#modelos", label: "Nossas bikes" },
  { href: "#vantagens", label: "Por que Nexus?" },
  { href: "#contato", label: "Vamos conversar" },
];
export function Navbar() {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function close() {
    setState("closing");
    const duration =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--dropdown-close-dur",
        ),
      ) || 150;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setState("closed"), duration);
  }
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  useEffect(() => {
    const query = matchMedia("(min-width: 900px)");
    const reset = () => {
      if (query.matches) setState("closed");
    };
    query.addEventListener("change", reset);
    return () => query.removeEventListener("change", reset);
  }, []);
  return (
    <header className="site-header">
      <nav
        className="shell nav-inner"
        aria-label="Navegação principal"
        onKeyDown={(e) => {
          if (e.key === "Escape" && state === "open") {
            close();
            toggleRef.current?.focus();
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) close();
        }}
      >
        <div className="nav-brand">
          <Brand />
        </div>
        <div className="desktop-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <LeadLink className="button button-accent nav-cta">
          Consultar test ride
        </LeadLink>
        <button
          className="menu-toggle"
          ref={toggleRef}
          aria-label={state === "open" ? "Fechar menu" : "Abrir menu"}
          aria-controls="mobile-menu"
          aria-expanded={state === "open"}
          onClick={() => {
            if (state === "open") close();
            else {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setState("open");
            }
          }}
        >
          {state === "open" ? <X /> : <Menu />}
        </button>
        <div
          id="mobile-menu"
          className={`mobile-menu t-dropdown ${state === "open" ? "is-open" : state === "closing" ? "is-closing" : ""}`}
          data-origin="top-right"
          inert={state !== "open"}
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <LeadLink className="button button-accent" onNavigate={close}>
            Consultar test ride
          </LeadLink>
        </div>
      </nav>
    </header>
  );
}
