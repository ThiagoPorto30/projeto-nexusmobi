import Image from "next/image";
import { ArrowUpRight, Route, Zap } from "lucide-react";
import { bikes } from "@/lib/catalog";
import { LeadLink } from "./lead-link";
export function CatalogSection() {
  return (
    <section
      id="modelos"
      className="catalog section-space"
      aria-labelledby="catalog-title"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ENCONTRE SEU RITMO</p>
            <h2 id="catalog-title">
              Uma bike para
              <br />
              <span className="muted-heading">cada movimento.</span>
            </h2>
          </div>
          <div className="catalog-intro">
            <p>
              Qual é o seu próximo destino?
              <br />
              Escolha a companhia certa para chegar lá.
            </p>
            <span className="collection-tag">
              <span className="status-dot" /> {bikes.length} modelos. Qual é o
              seu caminho?
            </span>
          </div>
        </div>
        <div className="catalog-grid">
          {bikes.map((bike, i) => (
            <article key={bike.id} id={`bike-${bike.id}`} className="bike-card">
              <div className={`bike-photo bike-photo-${bike.id}`}>
                <Image
                  src={bike.image}
                  alt={bike.imageAlt}
                  fill
                  sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 45vw, 596px"
                />
                <span className="photo-tag">{bike.category}</span>
                <span className="photo-number">0{i + 1}</span>
              </div>
              <div className="bike-info">
                <div className="bike-heading">
                  <h3>{bike.name}</h3>
                  <Zap size={22} strokeWidth={1.5} />
                </div>
                <p className="bike-description">{bike.description}</p>
                <div className="range">
                  <Route size={19} />
                  <span>
                    Até <strong>{bike.rangeKm} km</strong> de autonomia
                  </span>
                </div>
                <dl className="bike-specs">
                  {bike.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="bike-price">
                  <span>Seu próximo movimento</span>
                  <strong>Preço sob consulta</strong>
                </div>
                <LeadLink
                  intent="prices"
                  bikeId={bike.id}
                  className="button button-dark"
                >
                  Consultar preços <ArrowUpRight size={19} />
                </LeadLink>
              </div>
            </article>
          ))}
        </div>
        <p className="range-note">
          Autonomias máximas anunciadas. O alcance varia com trajeto, carga e
          condições de uso. Consulte disponibilidade e especificações com a
          equipe.
        </p>
        <div className="catalog-help">
          <span>Ainda não sabe qual combina com você?</span>
          <LeadLink className="text-link" intent="prices">
            A gente te ajuda a escolher <ArrowUpRight size={17} />
          </LeadLink>
        </div>
      </div>
    </section>
  );
}
