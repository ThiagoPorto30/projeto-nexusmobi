import Image from "next/image";
import { Route } from "lucide-react";
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
            <p className="eyebrow">A SUA PRÓXIMA BIKE</p>
            <h2 id="catalog-title">
              Três jeitos de
              <br />
              <span className="muted-heading">seguir em frente.</span>
            </h2>
          </div>
          <div className="catalog-intro">
            <p>
              Potência, praticidade ou conforto.
              <br />
              Compare. Imagine sua rotina. Escolha o seu caminho.
            </p>
          </div>
        </div>
        <div className="catalog-grid">
          {bikes.map((bike) => (
            <article key={bike.id} id={`bike-${bike.id}`} className="bike-card">
              <div className={`bike-photo bike-photo-${bike.id}`}>
                <Image
                  src={bike.image}
                  alt={bike.imageAlt}
                  fill
                  sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 45vw, 400px"
                />
                <span className="photo-tag">{bike.category}</span>
              </div>
              <div className="bike-info">
                <div className="bike-heading">
                  <h3>{bike.name}</h3>
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
                  <strong>Preço sob consulta</strong>
                </div>
                <LeadLink
                  intent="prices"
                  bikeId={bike.id}
                  className="button button-dark"
                >
                  Consultar preços
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
            A gente te ajuda a escolher
          </LeadLink>
        </div>
      </div>
    </section>
  );
}
