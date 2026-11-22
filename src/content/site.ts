// Conteúdo do site em um só lugar.
// Fonte: "Doc2.docx" (folder de divulgação) e "ESTRUTURAS ACRILICAS.docx" (tabela de serviços).
// Itens marcados com "A CONFIRMAR" ainda são provisórios.

export const site = {
  name: "Itacaramby",
  tagline: "Estética em Prótese Dentária",
  city: "Anápolis - GO",
  cro: "CRO 430",
  description:
    "Laboratório de prótese dentária em Anápolis (GO). Coroas, facetas, protocolos, próteses totais e removíveis em cerâmica, E.max, Rosetta, Signum, Resilab e metalocerâmica.",

  contact: {
    whatsapp: "5562984490810",
    whatsappLabel: "(62) 98449-0810",
    email: "itacaramby76@outlook.com",
    instagram: "", // A CONFIRMAR: @ do Instagram
    address: "Rua Dinamarca, Qd. 37, Lt. 14, nº 14 — Vila Santa Isabel, Anápolis - GO, CEP 75083-323",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Rua Dinamarca 14, Vila Santa Isabel, Anápolis - GO, 75083-323"),
  },

  verse: {
    text: "Confia os teus cuidados ao Senhor, e ele te sustentará; jamais permitirá que o justo seja abalado.",
    ref: "Salmos 55.22",
  },

  hero: {
    eyebrow: "ESTÉTICA • PRECISÃO • COMPROMISSO",
    title: ["O sorriso do seu paciente", "começa na nossa bancada."],
    text: "Coroas, facetas, protocolos e próteses totais e removíveis feitas com materiais de primeira linha e acabamento estético. Envie seu caso pelo WhatsApp e receba no prazo.",
  },

  owner: {
    name: "Cesar Itacaramby",
    role: "Técnico em Prótese Dentária · Responsável técnico",
    photo: "/img/responsavel.png",
  },

  about: {
    title: "Onde a técnica encontra o detalhe.",
    paragraphs: [
      "O Itacaramby é um laboratório de prótese dentária em Anápolis dedicado à estética. Trabalhamos lado a lado com o dentista, do planejamento à entrega, para que cada peça chegue ao consultório pronta para o paciente.",
      "Seguimos investindo em cursos, equipamentos e materiais de qualidade — E.max, Rosetta, Signum, Resilab, metalocerâmica e ligas metálicas — para entregar trabalhos com adaptação precisa e aparência natural.",
    ],
    stats: [
      { value: "CRO 430", label: "laboratório registrado" },
      { value: "5 dias", label: "prazo a partir de 5 dias úteis" },
      { value: "30+", label: "tipos de trabalho" },
    ],
  },

  // Agrupado como na tabela de serviços do laboratório (sem valores — "solicite sua lista").
  services: [
    {
      title: "E.max e Rosetta",
      image: "/img/dissilicato.png",
      text: "Cerâmicas de alta estética para coroas, facetas e lentes.",
      items: ["Coroa", "Onlay / Inlay", "Faceta ou lente", "Fragmento", "E.max"],
    },
    {
      title: "Metalocerâmica",
      image: "/img/coroas-implante.png",
      text: "Resistência e estética para unitários, pontes e implantes.",
      items: ["Coroa metalocerâmica", "Coroa sobre implante", "Protocolo metalocerâmico", "Protocolo com gengiva cerâmica"],
    },
    {
      title: "Signum e Resilab",
      image: "/img/ceramica.png",
      text: "Resinas laboratoriais para coroas e restaurações indiretas.",
      items: ["Coroa Signum", "Coroa Resilab", "Onlay / Inlay Signum", "Onlay / Inlay Resilab"],
    },
    {
      title: "Protocolos sobre implantes",
      image: "/img/protocolo-ceramica.png",
      text: "Reabilitações fixas sobre implantes, do provisório ao definitivo.",
      items: ["Protocolo em resina", "Protocolo provisório", "Barra de protocolo", "Barra com O-ring"],
    },
    {
      title: "Próteses totais",
      image: "/img/protese-total.png",
      text: "Dentaduras com acabamento rosa, caracterizado ou customizado.",
      items: ["Prótese total rosa", "Prótese total caracterizada", "Prótese total customizada", "Prótese total imediata", "Clonagem de PT"],
    },
    {
      title: "Removíveis e estruturas metálicas",
      image: "/img/ppr.png",
      text: "PPR e núcleos em liga de prata, cromo e metal amarelo.",
      items: ["Prótese parcial removível", "N.M.F e R.M.F (prata, cromo, metal amarelo)", "Coping metálico"],
    },
    {
      title: "Placas, guias e outros",
      image: "/img/protocolo-resina.png",
      text: "Trabalhos complementares para o dia a dia do consultório.",
      items: ["Guia cirúrgico", "Placa de clareamento", "Placa de bruxismo (silicone ou acrílica)", "Veneer em Art Glass ou resina acrílica"],
    },
    {
      title: "Trabalhos fracionados",
      image: "",
      text: "Etapas avulsas para complementar o seu fluxo.",
      items: ["Provisório", "Moldeira individual", "Montagem e prensagem (PT/PPR)", "Troca de dentes", "Aplicação de cerâmica"],
    },
  ],

  leadTimes: [
    { item: "N.M.F / R.M.F", days: "5 dias úteis" },
    { item: "Montagem de dentes", days: "5 dias úteis" },
    { item: "Acrilização", days: "5 dias úteis" },
    { item: "Metal C.M.C", days: "7 dias úteis" },
    { item: "Grade da PPR", days: "10 dias úteis" },
    { item: "C.M.C direta", days: "10 dias úteis" },
    { item: "Estrutura metálica de protocolo", days: "10 dias úteis" },
    { item: "Metal C.M.C sobre implante", days: "10 dias úteis" },
  ],

  steps: [
    { title: "Envie o caso", text: "Fale com a gente pelo WhatsApp e combine a coleta do modelo ou moldagem, com cor e informações do paciente." },
    { title: "Planejamento", text: "Avaliamos o caso e alinhamos com você material, prazo e detalhes estéticos." },
    { title: "Confecção", text: "Produção no laboratório com materiais de primeira linha e acabamento manual." },
    { title: "Entrega", text: "Peça conferida e entregue no prazo combinado, pronta para o consultório." },
  ],

  // A CONFIRMAR: legendas das fotos (identificadas a partir do folder).
  gallery: [
    { title: "Coroas sobre implante", tag: "Metalocerâmica", image: "/img/coroas-implante.png" },
    { title: "Protocolo com gengiva", tag: "Implantes", image: "/img/protocolo-ceramica.png" },
    { title: "Coroas em cerâmica", tag: "Cerâmica", image: "/img/ceramica.png" },
    { title: "Prótese total", tag: "PT", image: "/img/protese-total.png" },
    { title: "Protocolo em resina", tag: "Implantes", image: "/img/protocolo-resina.png" },
    { title: "Prótese parcial removível", tag: "PPR", image: "/img/ppr.png" },
    { title: "Onlays em dissilicato", tag: "E.max", image: "/img/dissilicato.png" },
  ],

  partners: {
    // A CONFIRMAR: nomes/logos reais das clínicas parceiras
    logos: ["Clínica Parceira 1", "Clínica Parceira 2", "Clínica Parceira 3", "Clínica Parceira 4", "Clínica Parceira 5"],
    // A CONFIRMAR: depoimentos reais (com autorização dos dentistas)
    testimonials: [
      {
        quote: "Adaptação impecável e cor muito fiel. Hoje mando praticamente todos os meus casos estéticos para o Itacaramby.",
        name: "Dr(a). Nome (A CONFIRMAR)",
        role: "Cirurgião-dentista",
      },
      {
        quote: "O que mais me chama atenção é a pontualidade. O paciente nunca fica esperando.",
        name: "Dr(a). Nome (A CONFIRMAR)",
        role: "Implantodontista",
      },
      {
        quote: "Comunicação rápida pelo WhatsApp e acabamento de altíssimo nível.",
        name: "Dr(a). Nome (A CONFIRMAR)",
        role: "Protesista",
      },
    ],
  },
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
