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
      "Teve seu pai, antigo líder da Plebe Rude, morto por comando de Vax. Desde então assumiu o papel de líder da Plebe Rude quando ainda tinha 9 anos.",
      "Desabafa com Nordis que não mais quer ser líder, pois é um peso que não consegue suportar mais, desde que assumiu a liderança, nunca teve progresso de verdade.",
      "Teve seu fim na luta na Igreja de Khenza contra Topolah."
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
      "Vax é o prefeito da cidade de Khenza e associado ao Conselho Mercantil, isso é tudo que se sabe sobre ele.",
      "Por algum motivo, mesmo aparentemente sendo capaz, deixa a Plebe Rude e Samus continuarem com a resistência."
    ],
  },
  {
    id: "lois-hatus",
    name: "Lois Hatus",
    image: {
      src: "/People/LoisHatus.jpg",
      alt: "Retrato de Lois Hatus",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Amigo de Samus, e membro da Plebe Rude, encontrado preso em um posto da cidade de Khenza.",
      'Seu crime era tentativa de roubo.',
      'O grupo o soltou.'
    ],
  },
  {
    id: "melinda-harlet",
    name: "Melinda Harlet",
    image: {
      src: "/People/MelindaHarlet.jpg",
      alt: "Retrato de Melinda Harlet",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Amiga de Samus, e membro da Plebe Rude, encontrado preso em um posto da cidade de Khenza.",
      'Seu crime era latrocínio.',
      'O grupo o soltou.'
    ],
  },
  {
    id: "yunis-armstrong",
    name: "Yunis Armstrong",
    image: {
      src: "/People/YunisArmstrong.jpg",
      alt: "Retrato de Yunis Armstrong",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Amigo de Samus, e membro da Plebe Rude, encontrado preso em um posto da cidade de Khenza.",
      'Seu crime era latrocínio.',
      'O grupo o soltou.'
    ],
  },
  {
    id: "krig-stih",
    name: "Krig Stih",
    image: {
      src: "/People/Krig%20Stih.jpg",
      alt: "Retrato de Krig Stih",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Apareceu preso em um posto da cidade de Khenza, ele conta que apenas xingou alguns guardas e também conta que tem certeza que estão tramando algo, mas não sabe o que.",
      'Seu crime era desacato.',
      'O grupo o soltou.'
    ],
  },
  {
    id: "sighi-leo",
    name: "Sighi Leo",
    image: {
      src: "/People/Sighi%20Leo.jpg",
      alt: "Retrato de Sighi Leo",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      "Apareceu preso em um posto da cidade de Khenza, ele conta que foi preso por não querer dar dinheiro para o governo e oferceu 50 PO em troca de ser solto.",
      'Seu crime era de sonegação.',
      'O grupo o soltou.',
      "Pede para recuperarem parte de suas finanças em sua casa antes que o governo confisque tudo."
    ],
  },
  {
    id: "mundus-jhoca",
    name: "Mundus Jhoca",
    image: {
      src: "/People/Mundus%20Jhoca.jpg",
      alt: "Retrato de Mundus Jhoca",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      'Apareceu preso em um posto da cidade de Khenza, ele repetia apenas "Liberdade, liberdade para as crianças.',
      'Seus crimes estavam listados como homicídios e tortura.',
      'O grupo não o soltou.',
      'Teve seu fim em um ritual de sacrifício em uma igreja de Khenza.'
    ],
  },
  {
    id: "topolah",
    name: "Topolah",
    image: {
      src: "/People/Topolah.jpg",
      alt: "Retrato de Topolah",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      'Apareceu em Khenza, uma representante do Conselho Mercantil.',
      'Demonstra querer atenção de Vax para si.',
      'Conduziu um Ritual na Igreja de Khenza, onde sacrificou Mundus Jhoca.',
      'Seu maior objetivo aparente era matar Samus, e assim o fez.',
      'Ao ser derrotada, o grupo firmou uma trégua temporária com ela.'
    ],
  },
  {
    id: "wyrmoth-silthar",
    name: "Wyrmoth Silthar",
    image: {
      src: "/People/Wyrmoth%20Silthar.jpg",
      alt: "Retrato de Wyrmoth Silthar",
      width: 800,
      height: 1200,
      sizes: "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 400px",
    },
    paragraphs: [
      'Líder do Conselho Mercantil.',
      'Apareceu em uma espécie de "bola de cristal" achado na igreja de Khenza.',
      'Ele diz que conhece Valerius Vane, e que sabe da mãe dele.',
    ],
  },

];
