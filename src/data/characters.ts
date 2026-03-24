export type Character = {
  name: string;
  /** Texto exibido como nível (ex.: "5" ou "Nível 5"). */
  lv: string;
  /** Caminho público da imagem (ex.: `/characters/aria.png`). */
  src: string;
};

/**
 * Lista estática de personagens. Edite aqui ao adicionar ou alterar fichas.
 */
export const characters: Character[] = [
  {
    name: "Athena Elarion",
    lv: "Nível 3",
    src: "/characters/Athena.jpeg",
  },
  {
    name: "Rhaenyra Elarion",
    lv: "Nível 3",
    src: "/characters/Rhaenyra.jpeg",
  },
  {
    name: "Bloms’t Souvenir",
    lv: "Nível 3",
    src: "/characters/Blomst.jpg",
  },
  {
    name: "Kairos Naerion",
    lv: "Nível 3",
    src: "/characters/kairos.jpg",
  },
  {
    name: "Nordis",
    lv: "Nível 3",
    src: "/characters/Nordis.png",
  },
  {
    name: "Valerius Vane",
    lv: "Nível 3",
    src: "/characters/Valerius.jpeg",
  },
];
