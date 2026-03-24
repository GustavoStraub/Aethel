export type PersonImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

export type PersonEntry = {
  id: string;
  name: string;
  image: PersonImage;
  paragraphs: string[];
};

export const people: PersonEntry[] = [
  {
    id: "samus",
    name: "Samus",
    image: {
      src: "/People/Samus.jpg",
      alt: "Retrato de Samus",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
      priority: true,
    },
    paragraphs: [
      "Samus é uma jovem com um peso nos olhos que não combina com a idade. Apareceu na fuga nas favelas de Khenza e ajudou o grupo a escapar dos guardas.",
      "Revelou que o Conselho Mercantil manda na cidade e que Vax é o prefeito atual; a riqueza local se sustém em sacrifícios. Faz parte da resistência “Plebe Rude”.",
    ],
  },
  {
    id: "vax",
    name: "Vax",
    image: {
      src: "/People/Vax.jpg",
      alt: "Retrato de Vax",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Vax é o prefeito — e figura de poder — associado à cidade de Khenza, isso é tudo que se sabe sobre ele."
    ],
  },
];
