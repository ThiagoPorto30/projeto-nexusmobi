export type BikeId = "v40-pro" | "v20-mini" | "laf-comfort";
export interface Bike {
  id: BikeId;
  name: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  rangeKm: number;
  specs: readonly { label: string; value: string }[];
  source: string;
  imageSource: string;
}
const comparison = "https://www.instagram.com/nexus.mobi/p/DbvnPTjqTWG/";
export const bikes: readonly Bike[] = [
  {
    id: "v40-pro",
    name: "V40 Pro",
    category: "Potência & performance",
    description:
      "Motor de 1.000 W e pneus de 20 polegadas para quem prioriza potência na escolha.",
    image: "/images/v40-pro.webp",
    imageAlt: "Bike elétrica V40 Pro preta à beira da Baía de Guanabara",
    rangeKm: 60,
    specs: [
      { label: "Motor", value: "1.000 W" },
      { label: "Bateria", value: "48 V · 18 Ah" },
      { label: "Pneus", value: "Fat 20 × 4″" },
    ],
    source: comparison,
    imageSource: comparison,
  },
  {
    id: "v20-mini",
    name: "V20 Mini",
    category: "Compacta & versátil",
    description:
      "Motor de 750 W e pneus de 16 polegadas em uma proposta mais compacta para a rotina.",
    image: "/images/v20-mini.webp",
    imageAlt: "Bike elétrica V20 Mini branca na orla do Rio de Janeiro",
    rangeKm: 45,
    specs: [
      { label: "Motor", value: "750 W" },
      { label: "Bateria", value: "48 V · 13 Ah" },
      { label: "Pneus", value: "Fat 16 × 4″" },
    ],
    source: comparison,
    imageSource: comparison,
  },
  {
    id: "laf-comfort",
    name: "LAF Comfort",
    category: "Estilo & conforto",
    description:
      "Uma proposta de conforto para o dia a dia, com banco marrom e estilo próprio.",
    image: "/images/laf-comfort.webp",
    imageAlt: "Bike elétrica LAF Comfort branca com banco marrom",
    rangeKm: 60,
    specs: [
      { label: "Proposta", value: "Conforto urbano" },
      { label: "Uso", value: "Dia a dia" },
    ],
    source: "https://www.instagram.com/nexus.mobi/p/DcgfANxK3-g/",
    imageSource: "https://www.instagram.com/nexus.mobi/p/DdEoY11KqE3/",
  },
];
export const contact = {
  instagram: "https://www.instagram.com/nexus.mobi/",
  whatsapp: "https://wa.me/message/2RQSKLOYV4QYN1",
} as const;
