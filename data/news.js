/*
  Noticias y anuncios de la empresa (alianzas, certificaciones, eventos).

  Cada elemento de `content` es un bloque. Ademas de { heading, body }, un
  bloque puede traer:
    - image: { src, alt, caption, w, h } con layout "wide" | "full" |
      "split-right" | "split-left" (las dos ultimas van junto al texto del
      mismo bloque)
    - quote: "frase destacada" (sin atribucion)
    - stats: [{ value, label }] (franja de cifras)
  `theme: "celebration"` activa el diseno festivo del articulo y `kicker`
  agrega la etiqueta especial sobre el titulo.
*/

const PHOTOS = "/assets/images/novedades/cumpleanos-5";

export const news = [
  {
    slug: "aniversario",
    category: "Aniversario",
    kicker: "Especial · 5 años",
    date: "Septiembre 2026",
    title:
      "Spectrum cumple cinco años: una historia que comenzó con una amistad",
    excerpt:
      "Cinco años de trayectoria, más de 20 aliados tecnológicos y una amistad que dio origen a todo: así se vivió la celebración del quinto aniversario de Spectrum.",
    bg: `${PHOTOS}/pastel.jpg`,
    theme: "celebration",
    content: [
      {
        body: "Hay aniversarios que marcan una fecha y otros que permiten mirar el camino recorrido. El quinto aniversario de Spectrum fue de los segundos: una noche para agradecer a quienes hicieron posible esta trayectoria (el equipo, los aliados, los clientes y los amigos de la casa) y para reconocer lo construido en cinco años.",
      },
      {
        image: {
          src: `${PHOTOS}/discurso.jpg`,
          alt: "Edison Hernandez, director comercial de Spectrum, habla frente a una pantalla con el logo del quinto aniversario",
          caption:
            "Edison Hernandez, director comercial de Spectrum, da apertura a las palabras de agradecimiento de la noche.",
          w: 2200,
          h: 1467,
        },
        layout: "wide",
      },
      {
        heading: "Una noche para agradecer",
        body: "La celebración reunió al equipo, a aliados y a amigos de Spectrum en un espacio ambientado con los colores de la marca: iluminación roja, brindis y una pantalla que fue recorriendo los momentos vividos junto a las personas que han acompañado a la compañía. Fue, ante todo, una noche de gratitud.",
      },
      {
        stats: [
          { value: "5", label: "años de historia" },
          { value: "+20", label: "aliados tecnológicos" },
          { value: "6", label: "frentes de soluciones" },
        ],
      },
      {
        heading: "Una empresa joven con un respaldo sólido",
        body: "A los cinco años, Spectrum combina el dinamismo de una empresa joven con una madurez empresarial que se refleja en su red de alianzas. Más de veinte aliados tecnológicos, entre ellos Microsoft, AWS, IBM, Fortinet, CrowdStrike, Nutanix y Google Cloud, respaldan cada solución que Spectrum diseña, implementa y opera.",
        image: {
          src: `${PHOTOS}/brindis.jpg`,
          alt: "Tres personas sonríen y levantan sus copas para brindar durante la celebración",
          caption: "Un brindis por cinco años de trabajo compartido.",
          w: 2000,
          h: 1333,
        },
        layout: "split-right",
      },
      {
        quote: "Cinco años. Una idea. Dos grandes amigos.",
      },
      {
        heading: "Dos amigos, una idea",
        body: "Antes de las alianzas, los proyectos y los aniversarios, hubo una idea. Nació de la amistad entre Edison Hernandez y Cristian Valencia, quienes decidieron construir juntos una empresa propia. Cinco años después, son reconocidos como los fundadores de Spectrum; pero antes de eso, y por encima de todo, fueron amigos.",
      },
      {
        body: "Toda empresa se sostiene sobre procesos, alianzas y personas, pero se funda sobre algo más simple y más difícil de conseguir: la confianza. Saber que al otro lado hay alguien que cree en la misma idea. Esa confianza compartida es el cimiento sobre el que se ha construido Spectrum y un valor que la compañía quiere seguir cuidando con su equipo, sus aliados y sus clientes.",
      },
      {
        image: {
          src: `${PHOTOS}/abrazo.jpg`,
          alt: "Cristian Valencia, CEO de Spectrum, en un abrazo durante la celebración",
          caption:
            "Cristian Valencia, CEO de Spectrum, en un abrazo que resume la amistad y la confianza que dieron origen a la compañía.",
          w: 2200,
          h: 1467,
        },
        layout: "full",
      },
      {
        heading: "El cuidado en cada detalle",
        body: "La celebración reflejó la misma atención al detalle con la que la compañía aborda sus proyectos: una mesa dispuesta con esmero, brindis con copas en alto y una torta coronada con una vela dorada en forma de 5, símbolo de una trayectoria que se celebra con orgullo.",
        image: {
          src: `${PHOTOS}/pasabocas.jpg`,
          alt: "Bandeja con brochetas, salsa y una flor morada, con la torta al fondo",
          caption: "Cada detalle cuenta.",
          w: 1600,
          h: 1067,
        },
        layout: "split-left",
      },
      {
        heading: "Hacia adelante",
        body: "Cinco años después, Spectrum mantiene el propósito con el que nació, Future Powered, y renueva su compromiso de seguir conectando, protegiendo y potenciando la operación tecnológica de sus clientes. Gracias a los aliados que confían, a los clientes que nos eligen, al equipo que lo hace posible y, sobre todo, a dos amigos que se atrevieron a construir esta empresa. Por muchos años más.",
      },
    ],
  },
];

export const newsEn = [
  {
    slug: "aniversario",
    category: "Anniversary",
    kicker: "Special · 5 years",
    date: "September 2026",
    title: "Spectrum turns five: a story that began with a friendship",
    excerpt:
      "Five years of track record, more than 20 technology partners and a friendship that started it all: this is how Spectrum's fifth anniversary was celebrated.",
    bg: `${PHOTOS}/pastel.jpg`,
    theme: "celebration",
    content: [
      {
        body: "Some anniversaries mark a date, and others invite us to look back at the road traveled. Spectrum's fifth anniversary was the second kind: a night to thank everyone who made this journey possible (the team, the partners, the clients and the friends of the house) and to recognize what has been built in five years.",
      },
      {
        image: {
          src: `${PHOTOS}/discurso.jpg`,
          alt: "Edison Hernandez, Spectrum's Chief Commercial Officer, speaks in front of a screen showing the fifth anniversary logo",
          caption:
            "Edison Hernandez, Spectrum's Chief Commercial Officer, opens the night's words of thanks.",
          w: 2200,
          h: 1467,
        },
        layout: "wide",
      },
      {
        heading: "A night to give thanks",
        body: "The celebration brought together Spectrum's team, partners and friends in a space set in the brand's colors: red lighting, toasts and a screen that walked through the moments lived alongside the people who have accompanied the company. It was, above all, a night of gratitude.",
      },
      {
        stats: [
          { value: "5", label: "years of history" },
          { value: "+20", label: "technology partners" },
          { value: "6", label: "solution fronts" },
        ],
      },
      {
        heading: "A young company with solid backing",
        body: "At five years, Spectrum combines the dynamism of a young company with a business maturity reflected in its network of partnerships. More than twenty technology partners, including Microsoft, AWS, IBM, Fortinet, CrowdStrike, Nutanix and Google Cloud, back every solution Spectrum designs, implements and operates.",
        image: {
          src: `${PHOTOS}/brindis.jpg`,
          alt: "Three people smile and raise their glasses for a toast during the celebration",
          caption: "A toast to five years of shared work.",
          w: 2000,
          h: 1333,
        },
        layout: "split-right",
      },
      {
        quote: "Five years. One idea. Two great friends.",
      },
      {
        heading: "Two friends, one idea",
        body: "Before the partnerships, the projects and the anniversaries, there was an idea. It was born from the friendship between Edison Hernandez and Cristian Valencia, who decided to build a company of their own together. Five years later, they are recognized as the founders of Spectrum; but before that, and above all, they were friends.",
      },
      {
        body: "Every company is sustained by processes, partnerships and people, but it is founded on something simpler and harder to come by: trust. Knowing that on the other side there is someone who believes in the same idea. That shared trust is the foundation on which Spectrum has been built and a value the company wants to keep nurturing with its team, its partners and its clients.",
      },
      {
        image: {
          src: `${PHOTOS}/abrazo.jpg`,
          alt: "Cristian Valencia, Spectrum's CEO, in an embrace during the celebration",
          caption:
            "Cristian Valencia, Spectrum's CEO, in an embrace that sums up the friendship and trust that gave rise to the company.",
          w: 2200,
          h: 1467,
        },
        layout: "full",
      },
      {
        heading: "Care in every detail",
        body: "The celebration reflected the same attention to detail with which the company approaches its projects: a carefully set table, raised glasses and a cake crowned with a golden candle shaped like a 5, a symbol of a journey celebrated with pride.",
        image: {
          src: `${PHOTOS}/pasabocas.jpg`,
          alt: "Tray with skewers, dip and a purple flower, with the cake in the background",
          caption: "Every detail counts.",
          w: 1600,
          h: 1067,
        },
        layout: "split-left",
      },
      {
        heading: "Looking ahead",
        body: "Five years later, Spectrum keeps the purpose it was born with, Future Powered, and renews its commitment to keep connecting, protecting and empowering its clients' technology operations. Thanks to the partners who trust us, the clients who choose us, the team that makes it possible and, above all, two friends who dared to build this company. Here's to many more years.",
      },
    ],
  },
];

export function getNews(locale = "es") {
  return locale === "en" ? newsEn : news;
}

export function getNewsItemBySlug(slug, locale = "es") {
  return getNews(locale).find((item) => item.slug === slug);
}
