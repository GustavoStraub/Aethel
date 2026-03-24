export type SessionEntry = {
  id: string;
  /** Título exibido na “página” do livro (ex.: Sessão 1). */
  title: string;
  /** Dia ou momento no mundo (texto livre; ex.: “12º dia da Lua de Cortes”). */
  date: string;
  paragraphs: string[];
};

export const sessions: SessionEntry[] = [
  {
    id: "1",
    title: "Sessão 1",
    date: "6 de Maio de 1564",
    paragraphs: [
      "Tudo começa com Kairos, um elfo de cabelos brancos como a própria pele, caminhando pela cidade de Khenza sob a luz do luar. Seguindo apenas mais um dia por aí, ele nota que está sendo observado. Começa a andar desconfiado, com passos acelerados, e então tem a confirmação: homens com armaduras e um símbolo no braço direito estão o seguindo. Kairos começa a correr. A cada passo dado, seu coração acompanha o ritmo da corrida. Os homens, no entanto, conseguem cercá-lo. Kairos se sente acuado. Ele não entende sua situação, mas eles confirmam que estão ali para pegá-lo.",

      "Mas então aparecem duas figuras desconhecidas. Nordis, um druida trazendo seu cajado e roupas largas, pergunta o que está acontecendo. A outra, Athena, uma elfa de cabelos loiros e pele branca em roupa sofisticada, também demonstra interesse no que está acontecendo. Um dos guardas diz para eles se afastarem se não querem problema, mas eles insistem em se intrometer. Os guardas notam que precisarão agir imediatamente e sacam suas armas.",

      "Logo outras figuras aparecem. Um homem de armadura pesada, Valerius, traz a justiça em sua lâmina e carrega o ódio contra o símbolo que aqueles homens carregam no braço direito. Ele logo saca sua arma e parece querer defender o elfo daquela opressão. Outra figura misteriosa, Bloms't, toca um dos homens, que simplesmente vai embora. Bloms't então aparece com a aparência do que foi embora e ordena aos outros próximos que se retirem, e assim o fazem.",

      "No fundo, uma outra figura, de pele escamosa e cabelos loiros, saca o arco e dispara contra os homens, tentando dar cobertura à sua irmã, Athena. A batalha continua. Kairos dá suporte prendendo alguns e manipulando os acontecimentos, e a batalha segue mortal.",

      "Então uma mulher aparece ajudando o grupo, que logo derrota aqueles guardas. Ela os chama para fugirem dali o mais depressa possível. Eles o fazem e vão para as favelas do lado de fora da cidade. Lá conversam brevemente. Nordis diz ter assuntos com Kairos. Athena e Rhaenyra contam que estão atrás de um homem chamado Vax, este que hoje é o prefeito/dono da cidade. Bloms't parece estar apenas tentando entender o que está acontecendo.",

      "Nordis foi guiado por uma visão misteriosa para a cidade de Khenza. Ele viu o mundo debaixo d'água, e num momento Kairos estava fazendo algo que fazia toda aquela água parecer \"voltar\", ir para onde sempre deveria estar, voltando o mundo como deveria ser.",

      "Bloms't contempla uma flor que mostra a cidade de Khenza diferente do que é hoje. Lá ele vê o prefeito daquela cidade apertando a mão de um homem alto, imponente, de armadura que parecia refletir o divino. O prefeito, com lágrimas nos olhos, refletia a pobreza daquele local.",

      "Valerius conseguiu uma informação de que Khenza estava sendo controlada pelo Conselho Mercantil.",

      "Kairos estava na cidade faz um tempo, apenas vivendo um dia de cada vez. Não faz a mínima ideia do porquê estão atrás dele.",

      "A moça misteriosa agora conta que se chama Samus. Ela é uma moça jovem, mas carrega nos olhos um peso que não condiz com sua idade. Ela conta que o Conselho Mercantil é quem manda na cidade, e Vax é o atual prefeito. Tudo é feito à base de sacrifícios — toda a riqueza da cidade. Samus faz parte de um grupo de resistência chamado \"Plebe Rude\". Depois daquela fuga, a lua já estava alta no céu, lembrando que já estava na hora de descansar. Hoje, eles não estariam no maior conforto que já tiveram em suas vidas. A situação era precária por ali. O que tinham era uma pequena cabana na qual dividiam o sono que podiam ter.",
    ],
  },
];
