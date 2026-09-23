import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LeadLink } from "./lead-link";
import { BikeStudio } from "./bike-studio";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero-topline">
        <span>MOBILIDADE ELÉTRICA, SEM COMPLICAR.</span>
        <span>RIO DE JANEIRO ↗</span>
      </div>
      <div className="shell hero-heading">
        <h1 id="hero-title">
          Mova o seu <span>mundo.</span>
        </h1>
        <p>Uma nova conexão entre você e a cidade.</p>
      </div>
      <div className="shell">
        <BikeStudio />
      </div>
      <div className="shell hero-bottom">
        <p>
          Troque a pressa pelo prazer do caminho.
          <br />
          <strong>Encontre a elétrica que combina com você.</strong>
        </p>
        <div className="hero-actions">
          <a className="button button-accent" href="#modelos">
            Ver modelos <ArrowDown size={18} />
          </a>
          <LeadLink className="text-link">
            Consultar test ride <ArrowUpRight size={18} />
          </LeadLink>
        </div>
      </div>
    </section>
  );
}
