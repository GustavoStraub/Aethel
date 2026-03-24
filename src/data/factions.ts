export type FactionImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

export type FactionEntry = {
  id: string;
  title: string;
  image: FactionImage;
  paragraphs: string[];
};

export const factions: FactionEntry[] = [
  {
    id: "conselho-mercantil",
    title: "Conselho Mercantil",
    image: {
      src: "/Factions/ConselhoMercantil.png",
      alt: "Símbolo ou brasão do Conselho Mercantil",
      width: 1200,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
      priority: true,
    },
    paragraphs: [
      "O Conselho Mercantil tem seu primeiro contato com o grupo na cidade de Khenza. Pouco se sabe ainda sobre esse Conselho, mas o que se sabe é que Vax faz parte dele e é o prefeito da cidade.",
    ],
  },
  {
    id: "plebe-rude",
    title: "Plebe Rude",
    image: {
      src: "/Factions/PlebeRude.png",
      alt: "Símbolo da Plebe Rude",
      width: 1200,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "A Plebe Rude é descrita por Samus como um grupo de resistência contra o domínio do Conselho Mercantil",
      "Após a fuga nas favelas, ela deu abrigo e contexto ao grupo — um contraponto à opressão simbolizada pelos guardas e pelo poder na cidade.",
    ],
  },
];
