export type CharacterImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

export type CharacterEntry = {
  id: string;
  name: string;
  image: CharacterImage;
  paragraphs: string[];
};

/**
 * Personagens jogáveis do grupo. Edite aqui ao adicionar ou alterar fichas.
 */
export const characters: CharacterEntry[] = [
  {
    id: "athena-elarion",
    name: "Athena Elarion",
    image: {
      src: "/characters/Athena.jpeg",
      alt: "Retrato de Athena Elarion",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
      priority: true,
    },
    paragraphs: [
      "Elfa de cabelos loiros e pele clara, com vestimenta sofisticada. Interveio quando os guardas cercaram Kairos nas ruas de Khenza, ao lado de Nordis.",
      "No combate, Rhaenyra Elarion cobre-a com o arco — são irmãs.",
    ],
  },
  {
    id: "rhaenyra-elarion",
    name: "Rhaenyra Elarion",
    image: {
      src: "/characters/Rhaenyra.jpeg",
      alt: "Retrato de Rhaenyra Elarion",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
    },
    paragraphs: [
      "Figura de pele escamosa e cabelos loiros; luta com arco e cobre a irmã Athena Elarion em combate.",
      "Com Athena, persegue informações sobre Vax, prefeito de Khenza.",
    ],
  },
  {
    id: "blomst-souvenir",
    name: "Bloms’t Souvenir",
    image: {
      src: "/characters/Blomst.jpg",
      alt: "Retrato de Bloms’t Souvenir",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
    },
    paragraphs: [
      "Toca um dos homens que perseguiam Kairos e, de algum modo, faz com que ele se retire; depois assume a aparência daquele homem e ordena aos outros que se afastem.",
      "Contempla uma flor que mostra Khenza outrora e vislumbra o prefeito apertando a mão de um homem de armadura quase divina.",
    ],
  },
  {
    id: "kairos-naerion",
    name: "Kairos Naerion",
    image: {
      src: "/characters/kairos.jpg",
      alt: "Retrato de Kairos Naerion",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
    },
    paragraphs: [
      "Elfo de cabelos brancos como a pele. A história em Khenza começa com ele caminhando sob o luar, percebendo que é seguido por homens armados com um símbolo no braço.",
      "Foge, é cercado, e o grupo intervém. Está sendo perseguido pelo Conselho Mercantil e não entende o porquê.",
    ],
  },
  {
    id: "nordis",
    name: "Nordis",
    image: {
      src: "/characters/Nordis.png",
      alt: "Retrato de Nordis",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
    },
    paragraphs: [
      "Druida com cajado e roupas largas. Pergunta o que se passa quando os guardas ameaçam Kairos.",
      "Foi guiado por uma visão até Khenza: mundo submerso e Kairos num gesto que faz a água “voltar” ao seu lugar.",
    ],
  },
  {
    id: "valerius-vane",
    name: "Valerius Vane",
    image: {
      src: "/characters/Valerius.jpeg",
      alt: "Retrato de Valerius Vane",
      width: 800,
      height: 1200,
      sizes:
        "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, min(896px, 45vw)",
    },
    paragraphs: [
      "Homem de armadura pesada; odeia o símbolo que os guardas exibem e parece querer defender Kairos.",
      "Conseguiu informação de que Khenza está sob influência do Conselho Mercantil.",
    ],
  },
];
