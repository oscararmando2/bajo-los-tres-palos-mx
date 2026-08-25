/* ==========================================================================
   BAJO LOS TRES PALOS MX · catálogo
   --------------------------------------------------------------------------
   Cada objeto de PRODUCTOS es una tarjeta del catálogo.
     nombre   : título de la tarjeta
     corte    : "negativo" | "roll" | "plano" | "hibrido"   (filtros del sitio)
     nivel    : "pro" | "competencia" | "entrenamiento" | "juvenil"
     latex    : texto libre (ej. "Látex alemán 4 mm")
     tallas   : arreglo de tallas disponibles
     precio   : número en MXN, o null para mostrar "Consultar precio"
     img      : ruta de la foto (deja "" para usar la imagen genérica)
     desc     : una o dos líneas de descripción
   --------------------------------------------------------------------------
   DEMO: en true el sitio muestra un aviso de "catálogo de muestra".
   Ponlo en false cuando cargues los modelos y fotos reales.
   ========================================================================== */

window.BTP_DEMO = true;

window.BTP_PRODUCTOS = [
  {
    nombre: 'Línea Pro · Corte Negativo',
    corte: 'negativo',
    nivel: 'pro',
    latex: 'Látex 4 mm alto agarre',
    tallas: [8, 9, 10, 11],
    precio: null,
    img: 'assets/img/still-detalle.jpg',
    desc: 'Ajuste ceñido con costura interior. Para el portero que quiere sentir el balón sin sobrantes de látex.'
  },
  {
    nombre: 'Línea Pro · Roll Finger',
    corte: 'roll',
    nivel: 'pro',
    latex: 'Látex 4 mm alto agarre',
    tallas: [8, 9, 10, 11],
    precio: null,
    img: 'assets/img/still-par.jpg',
    desc: 'Látex enrollado sobre el dedo, sin costura lateral: máxima superficie de contacto en el blocaje.'
  },
  {
    nombre: 'Edición Tricolor',
    corte: 'hibrido',
    nivel: 'competencia',
    latex: 'Látex 4 mm mixto',
    tallas: [7, 8, 9, 10],
    precio: null,
    img: 'assets/img/still-rayos.jpg',
    desc: 'Corte híbrido con detalles en verde, blanco y rojo. La edición con más personalidad del arco mexicano.'
  },
  {
    nombre: 'Modelo Competencia · Plano',
    corte: 'plano',
    nivel: 'competencia',
    latex: 'Látex 3.5 mm todo terreno',
    tallas: [7, 8, 9, 10, 11],
    precio: null,
    img: '',
    desc: 'Corte clásico de costura externa. Cómodo, holgado y noble en cancha dura y pasto sintético.'
  },
  {
    nombre: 'Modelo Entrenamiento',
    corte: 'plano',
    nivel: 'entrenamiento',
    latex: 'Látex 3 mm resistente',
    tallas: [7, 8, 9, 10],
    precio: null,
    img: '',
    desc: 'Pensado para aguantar sesión tras sesión sobre superficie abrasiva sin comerse el látex en dos semanas.'
  },
  {
    nombre: 'Juvenil · Con varillas',
    corte: 'negativo',
    nivel: 'juvenil',
    latex: 'Látex 3 mm + protección de dedos',
    tallas: [5, 6, 7, 8],
    precio: null,
    img: '',
    desc: 'Tallas chicas con varillas removibles: protección real para el portero que va empezando bajo los tres palos.'
  }
];
