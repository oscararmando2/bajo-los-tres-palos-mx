/* ==========================================================================
   BAJO LOS TRES PALOS MX · catálogo
   --------------------------------------------------------------------------
   Modelos y descripciones tal como los pasó Jose Álvarez por WhatsApp el
   24 de agosto de 2026. Las características (corte, látex, zonas) están
   leídas de las infografías que venían con cada set de fotos, no inventadas.
   Donde el dato no venía en la fuente, el campo va en null y el sitio
   simplemente no lo muestra.

   precio: null  ->  la tarjeta dice "Consultar precio"
   ========================================================================== */

window.BTP_PRODUCTOS = [
  {
    slug: "asimetrik-pro-future-multicolor",
    nombre: "Asimetrik PRO Future",
    color: "Multicolor / Negro",
    gama: "pro",
    corte: "hyper",
    tallas: [8, 9, 10],
    precio: null,
    fotos: 3,
    specs: ["AXG Future", "Palma extendida", "Punching zone",
            "Ventana personalizable", "Cintillo elástico"],
    desc: "Uno de los modelos emblemáticos de Rinat regresa para celebrar un " +
          "guante que ha formado parte de la evolución del portero y sus " +
          "herramientas. Presenta una construcción robusta y definida, " +
          "característica esencial de esta línea, que ofrece una sensación de " +
          "seguridad y comodidad extrema en cada intervención."
  },
  {
    slug: "asimetrik-pro-future-azul",
    nombre: "Asimetrik PRO Future",
    color: "Azul / Morado",
    gama: "pro",
    corte: "hyper",
    tallas: [10],
    precio: null,
    fotos: 3,
    specs: ["AXG Future", "Palma extendida", "Punching zone",
            "Ventana personalizable", "Cintillo elástico"],
    desc: "Uno de los modelos emblemáticos de Rinat regresa para celebrar un " +
          "guante que ha formado parte de la evolución del portero y sus " +
          "herramientas. Presenta una construcción robusta y definida, " +
          "característica esencial de esta línea, que ofrece una sensación de " +
          "seguridad y comodidad extrema en cada intervención."
  },
  {
    slug: "asimetrik-aero-pro-blanco-azul",
    nombre: "Asimetrik Aero PRO",
    color: "Blanco / Azul",
    gama: "pro",
    corte: "evo",
    tallas: [8, 10],
    precio: null,
    fotos: 3,
    specs: ["Traxion Grip", "Látex PRM T", "Punching zone",
            "Ventana personalizable", "Cintillo elástico"],
    desc: "El modelo Asimetrik se presenta en su versión “Aero”, ultra ligera. " +
          "Diseñado a la altura de las exigencias del futbol moderno, presenta " +
          "construcción, materiales y diseño orientados al portero que busca " +
          "comodidad, agilidad y ligereza sin sacrificar desempeño."
  },
  {
    slug: "asimetrik-aero-prime-blanco",
    nombre: "Asimetrik Aero Prime",
    color: "Multicolor / Blanco",
    gama: "prime",
    corte: "negativo",
    tallas: [8, 9, 10],
    precio: null,
    fotos: 3,
    specs: ["Látex NFT", "Super Softy XP", "Hard Ground Plus Next",
            "Punching zone", "Cintillo elástico"],
    desc: "Asimetrik Aero en su gama Prime no solo presenta un concepto ultra " +
          "ligero y minimalista que garantiza comodidad: gracias a sus " +
          "materiales, diseñados para ofrecer gran durabilidad, se convierte " +
          "en un guante ideal para entrenamientos o partidos en terrenos de " +
          "alto desgaste."
  },
  {
    slug: "meta-tactik-alpha-amarillo",
    nombre: "Meta Tactik Alpha",
    color: "Amarillo / Negro",
    gama: "alpha",
    corte: null,                 // el set de fotos no traía infografía
    tallas: [10],
    precio: null,
    fotos: 3,
    specs: [],
    desc: "Con el nuevo Meta Tactik GK estarás listo para la batalla y para " +
          "afrontar lo que se venga al defender tu territorio. La versión " +
          "Alpha es un guante ligero, técnico, cómodo y funcional que, por sus " +
          "características y materiales, bien podría pasar por uno de gama alta."
  },
  {
    slug: "asimetrik-prime-negro-azul",
    nombre: "Asimetrik Prime",
    color: "Negro / Azul",
    gama: "prime",
    corte: "hyper",
    tallas: [8, 9, 10],
    precio: null,
    fotos: 3,
    specs: ["Látex NFT", "Super Softy XP", "PRM T", "Punching zone",
            "Cintillo elástico"],
    desc: "¿Buscas un guante que combine innovación, rendimiento y un diseño " +
          "que transmita energía en cada atajada? Los Asimetrik Prime están " +
          "hechos para porteros exigentes. Esta versión semi profesional " +
          "ofrece un corte de última generación que se adapta anatómicamente " +
          "a la mano, con ajuste preciso y libertad de movimiento superior."
  }
];

/* Nombres visibles de cada corte, con la nomenclatura de Rinat */
window.BTP_CORTES = {
  hyper:    "Hyper Cut",
  evo:      "Evo Cut",
  negativo: "Negative Cut"
};

window.BTP_GAMAS = {
  pro:   "PRO",
  prime: "Prime",
  alpha: "Alpha"
};
