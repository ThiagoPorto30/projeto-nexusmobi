import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LeadLink } from "./lead-link";
import { bikes } from "@/lib/catalog";

export function HeroSection() {
  const bike = bikes[0];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero-main">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Mobilidade elétrica. Vida lá fora.
          </p>
          <h1 id="hero-title">
            Seu caminho tem <em>outras</em> possibilidades
            <span className="accent">.</span>
          </h1>
          <div className="hero-intro">
            <p className="hero-description">
              Uma ida ao trabalho. Uma volta pela orla. Uma cidade inteira para
              redescobrir de bike elétrica.
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
        </div>
        <figure className="hero-photo">
          <Image
            src={bike.image}
            alt={bike.imageAlt}
            fill
            sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 50vw, 596px"
            loading="eager"
            fetchPriority="high"
          />
          <span className="photo-location">
            Rio de Janeiro, de um novo jeito.
          </span>
          <figcaption>
            <span>
              Conheça a <strong>V40 Pro</strong>
            </span>
            <a href="#bike-v40-pro" aria-label="Conhecer a V40 Pro">
              <ArrowUpRight size={24} />
            </a>
          </figcaption>
        </figure>
        <div className="hero-route" aria-hidden="true">
          <svg viewBox="0 0 340 190" fill="none">
            <path
              d="M18 167V44Q18 22 40 22H53L258 165Q282 182 282 151V22"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="18" cy="167" r="6" fill="currentColor" />
            <circle cx="282" cy="22" r="6" fill="currentColor" />
          </svg>
          <span>
            Entre você e a cidade,
            <br />
            um novo caminho.
          </span>
        </div>
      </div>
      <div className="shell hero-bottom">
        <span>
          Elétrica no movimento.
          <br />
          <strong>Humana na conexão.</strong>
        </span>
        <span>Bikes elétricas · Rio de Janeiro</span>
        <a href="#modelos">
          Encontre seu ritmo <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
