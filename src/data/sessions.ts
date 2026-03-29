import { characters } from "@/data/characters";

/** Tabela inserida após um parágrafo (índice 0-based do array `paragraphs`). */
export type SessionInlineTable = {
  afterParagraphIndex: number;
  headers: string[];
  rows: string[][];
};

export type SessionEntry = {
  id: string;
  /** Título exibido na “página” do livro (ex.: Sessão 1). */
  title: string;
  /** Dia ou momento no mundo (texto livre; ex.: “12º dia da Lua de Cortes”). */
  date: string;
  paragraphs: string[];
  inlineTables?: SessionInlineTable[];
  /** Áudio ou gravação em link externo (ex.: Google Drive). Mostrado abaixo da data. */
  recordingUrl?: string;
};

const blomsSouvenir = characters.find((c) => c.id === "blomst-souvenir")!.name;

export const sessions: SessionEntry[] = [
  {
    id: "1",
    title: "Sessão 1",
    date: "6 de Maio de 1564",
    paragraphs: [
      `Tudo começa com Kairos Naerion, um elfo de cabelos brancos como a própria pele, caminhando pela cidade de Khenza sob a luz do luar. Seguindo apenas mais um dia por aí, ele nota que está sendo observado. Começa a andar desconfiado, com passos acelerados, e então tem a confirmação: homens com armaduras e um símbolo no braço direito estão o seguindo. Kairos Naerion começa a correr. A cada passo dado, seu coração acompanha o ritmo da corrida. Os homens, no entanto, conseguem cercá-lo. Kairos Naerion se sente acuado. Ele não entende sua situação, mas eles confirmam que estão ali para pegá-lo.`,

      "Mas então aparecem duas figuras desconhecidas. Nordis, um druida trazendo seu cajado e roupas largas, pergunta o que está acontecendo. A outra, Athena Elarion, uma elfa de cabelos loiros e pele branca em roupa sofisticada, também demonstra interesse no que está acontecendo. Um dos guardas diz para eles se afastarem se não querem problema, mas eles insistem em se intrometer. Os guardas notam que precisarão agir imediatamente e sacam suas armas.",

      `Logo outras figuras aparecem. Um homem de armadura pesada, Valerius Vane, traz a justiça em sua lâmina e carrega o ódio contra o símbolo que aqueles homens carregam no braço direito. Ele logo saca sua arma e parece querer defender o elfo daquela opressão. Outra figura misteriosa, ${blomsSouvenir}, toca um dos homens, que simplesmente vai embora. ${blomsSouvenir} então aparece com a aparência do que foi embora e ordena aos outros próximos que se retirem, e assim o fazem.`,

      "No fundo, uma outra figura, de pele escamosa e cabelos loiros, saca o arco e dispara contra os homens, tentando dar cobertura à sua irmã, Athena Elarion. A batalha continua. Kairos Naerion dá suporte prendendo alguns e manipulando os acontecimentos, e a batalha segue mortal.",

      `Então uma mulher aparece ajudando o grupo, que logo derrota aqueles guardas. Ela os chama para fugirem dali o mais depressa possível. Eles o fazem e vão para as favelas do lado de fora da cidade. Lá conversam brevemente. Nordis diz ter assuntos com Kairos Naerion. Athena Elarion e Rhaenyra Elarion contam que estão atrás de um homem chamado Vax, este que hoje é o prefeito/dono da cidade. ${blomsSouvenir} parece estar apenas tentando entender o que está acontecendo.`,

      'Nordis foi guiado por uma visão misteriosa para a cidade de Khenza. Ele viu o mundo debaixo d\'água, e num momento Kairos Naerion estava fazendo algo que fazia toda aquela água parecer "voltar", ir para onde sempre deveria estar, voltando o mundo como deveria ser.',

      `${blomsSouvenir} contempla uma flor que mostra a cidade de Khenza diferente do que é hoje. Lá ele vê o prefeito daquela cidade apertando a mão de um homem alto, imponente, de armadura que parecia refletir o divino. O prefeito, com lágrimas nos olhos, refletia a pobreza daquele local.`,

      "Valerius Vane conseguiu uma informação de que Khenza estava sendo controlada pelo Conselho Mercantil.",

      "Kairos Naerion estava na cidade faz um tempo, apenas vivendo um dia de cada vez. Não faz a mínima ideia do porquê estão atrás dele.",

      'A moça misteriosa agora conta que se chama Samus. Ela é uma moça jovem, mas carrega nos olhos um peso que não condiz com sua idade. Ela conta que o Conselho Mercantil é quem manda na cidade, e Vax é o atual prefeito. Tudo é feito à base de sacrifícios — toda a riqueza da cidade. Samus faz parte de um grupo de resistência chamado "Plebe Rude". Depois daquela fuga, a lua já estava alta no céu, lembrando que já estava na hora de descansar. Hoje, eles não estariam no maior conforto que já tiveram em suas vidas. A situação era precária por ali. O que tinham era uma pequena cabana na qual dividiam o sono que podiam ter.',
    ],
  },
  {
    id: "2",
    title: "Sessão 2",
    date: "7 de Maio de 1564",
    recordingUrl:
      "https://drive.google.com/file/d/1SW7AJQafiZ6LfMLe75hP4FvI6W2-Gz8w/view?usp=drive_link",
    paragraphs: [
      `Durante o descanso, ${blomsSouvenir} tem mais uma lembrança vinda daquela flor encontrada pouco antes de entrar em Khenza. Ele se encontra do lado de fora de uma igreja, espiando pela janela — é possível ver algumas pessoas acorrentadas pelas mãos e pés. Ao redor delas, figuras encapuzadas repetem palavras incompreensíveis enquanto finalizam um desenho no chão. Os acorrentados então adentram esse círculo, e agora é possível ver uma espécie de sarcófago ao centro. Porém, nesse instante, um dos encapuzados cruza o olhar com ${blomsSouvenir} — e tudo desaparece.`,

      "O sono de todos é interrompido pelo disparo de uma besta. Samus está afastando duas panteras que vivem na floresta próxima. Ela conta que costumavam alimentá-las, e assim viviam em harmonia, porém a comida agora é escassa e as bestas precisam comer alguma coisa. Ela conta também que precisava da ajuda do grupo para libertar alguns de seus amigos presos em um posto da cidade — e que lá também seria possível roubar armas para armar o povo das favelas, dando força a uma futura revolução.",

      `Após uma breve discussão, o grupo propõe tentar um acordo com as panteras. ${blomsSouvenir} reconhece que os animais são capazes de produzir ilusões usando seus tentáculos, e seguindo para a floresta, encontram as duas feras. Nordis tenta convencê-las a esperar e não atacar ninguém até mais tarde, mas o acordo não se sustenta. É então que o grupo sugere algo mais direto: as panteras ajudariam a invadir o posto, e lá poderiam devorar quantos soldados conseguissem. As bestas aceitaram.`,

      "Chegando à cidade, as panteras se ocultaram e deixaram apenas suas ilusões à mostra. Logo as pessoas as notaram, e guardas foram chamados. Quando tentaram golpear as criaturas, as lâminas passaram direto pelas imagens — e as panteras reais atacaram com tudo. Reforços foram convocados imediatamente. Com os guardas saindo do posto em desespero, o grupo aproveitou o caos para adentrar o local.",

      "Lá dentro, percebendo que não seria fácil chegar até os prisioneiros, Athena Elarion decide usar de seus encantos para seduzir o guarda do salão principal — este que rapidamente cai sob sua influência. Com ele distraído, o grupo avança direto para a ala dos presos. Um guarda que vigiava os detentos os avista, mas Kairos Naerion age rápido e o paralisa com sua magia. Valerius Vane então usa o escudo para deixá-lo inconsciente.",

      "Com as chaves encontradas sobre o guarda e um relatório dos presos recolhido de uma mesa próxima, o grupo descobre os nomes e situações dos detidos:",

      "Samus liberta apenas seus amigos e deixa ao grupo a decisão sobre os demais.",

      `Analisando os outros prisioneiros, o grupo se depara com Mundus Jhoca — rosto pesado, um olho cego — que repete em loop: «Liberdade, as crianças precisam ser libertas, as crianças precisam de liberdade.» Por um instante, Kairos Naerion sente o olho cego o encarando com uma profundidade inexplicável, e quase pode ver uma lágrima descendo por aquele rosto. Ele se recompõe, e tudo segue. Krig Stih conta que foi preso apenas por xingar os guardas, mas acredita que eles estão tramando algo — não sabe o quê, mas tem certeza. Já Sighi Leo diz que seu único crime foi se recusar a pagar ao governo, e oferece 50 PO ao grupo em troca de sua liberdade. O grupo decide libertar Sighi Leo e Krig Stih, deixando Mundus Jhoca para trás.`,

      `Com os ex-prisioneiros em mãos, o grupo precisa agora chegar ao depósito de armas — mas o caminho passa pelo refeitório dos guardas. ${blomsSouvenir} assume a aparência de um dos soldados e infiltra o local, papeando com os demais e descobrindo que existe uma sala de acesso restrito ao alto escalão do posto. Lá, ao que parece, Vax foi visto recentemente mais comunicativo que o normal — trocando cartas e demonstrando uma alegria incomum. Enquanto isso, os outros avançam pelos corredores e localizam o depósito. ${blomsSouvenir} os precede mais uma vez, usando sua magia de charme para convencer o guarda do local a tirar uma folga. Com o caminho livre, o grupo se serve do quanto consegue carregar.`,

      "A saída acontece sem mortes, com uma entrada limpa e sem consequências imediatas — ou quase. Ao se esgueirarem pelos becos de volta, o grupo encontra as panteras mortas no chão. Ao redor delas, corpos de soldados com pedaços arrancados e, entre eles, o corpo de uma criança — todos marcados por garras e dentes. Nesse momento, os guardas que ainda restavam avistam o grupo se esgueirando pelas ruelas, carregando um arsenal de armas.",
    ],
    inlineTables: [
      {
        afterParagraphIndex: 5,
        headers: ["Presos", "Status", "Crimes"],
        rows: [
          ["Sighi Leo", "Aguardando julgamento", "Sonegação"],
          ["Krig Stih", "Julgado. Será expulso", "Desacato"],
          ["Melinda Harlet", "Julgada. Será expulsa", "Latrocínio"],
          ["Yunis Armstrong", "Julgado. Será expulso", "Latrocínio"],
          ["Lois Hatus", "Julgado. Será expulso", "Tentativa de roubo"],
          ["Mundus Jhoca", "Julgado. Será expulso", "Homicídio e tortura"],
        ],
      },
    ],
  },
];
