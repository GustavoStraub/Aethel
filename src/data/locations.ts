export type LocationImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

export type LocationEntry = {
  id: string;
  title: string;
  image: LocationImage;
  /** Parágrafos exibidos abaixo do mapa. */
  paragraphs: string[];
};

export const locations: LocationEntry[] = [
  {
    id: "khenza",
    title: "Khenza",
    image: {
      src: "/Maps/Khenza/khenza.png",
      alt: "Mapa da cidade de Khenza",
      width: 1920,
      height: 1080,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 80vw, min(896px, 90vw)",
      priority: true,
    },
    paragraphs: [
      "Khenza é o primeiro grande cenário urbano da campanha: uma cidade sob o luar, onde ruas e favelas contam histórias diferentes conforme o distrito. Aqui o grupo cruzou com guardas de um símbolo desconhecido, encontrou aliados improváveis e teve o primeiro contato com o que parece ser o poder do Conselho Mercantil e de Vax.",
      "O grupo foi guiado para as favelas fora dos muros da cidade por uma moça Chamada Samus que luta em nome de um grupo chamado \"Plebe Rude\" que luta contra o Conselho Mercantil.",
    ],
  },
];
