import { BatteryCharging, Armchair, Truck, ShieldCheck } from "lucide-react";
const features = [
  {
    icon: BatteryCharging,
    number: "01",
    title: "Mais caminho. Menos tomadas.",
    text: "Compare autonomias anunciadas de até 45 ou 60 km, conforme o modelo.",
    label: "AUTONOMIA",
  },
  {
    icon: Armchair,
    number: "02",
    title: "O trajeto também importa.",
    text: "Opções pensadas para transformar os deslocamentos em bons momentos.",
    label: "CONFORTO",
  },
  {
    icon: Truck,
    number: "03",
    title: "Sua nova bike vai até você.",
    text: "Consulte disponibilidade, prazo e condições de entrega para sua região.",
    label: "CONSULTE A ENTREGA",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Confiança em cada etapa.",
    text: "Converse com a equipe sobre preços e formas de pagamento.",
    label: "ATENDIMENTO",
  },
];
export function FeaturesSection() {
  return (
    <section
      id="vantagens"
      className="features section-space"
      aria-labelledby="features-title"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">O JEITO NEXUS DE IR</p>
            <h2 id="features-title">
              A vida acontece
              <br />
              fora do trânsito.
            </h2>
          </div>
          <p>
            Mais do que vender bikes.
            <br />
            Conectamos você a uma nova
            <br className="desktop-break" /> forma de se movimentar.
          </p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, ...feature }) => (
            <article key={feature.number} className="feature-card">
              <div className="feature-top">
                <Icon size={27} strokeWidth={1.5} />
                <span>{feature.number}</span>
              </div>
              <p className="micro-label">{feature.label}</p>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
        <p className="range-note">
          A autonomia varia conforme o modelo, o trajeto, a carga e as condições
          de uso.
        </p>
      </div>
    </section>
  );
}
