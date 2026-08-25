# Bajo Los Tres Palos MX

Sitio web de **BAJO LOS TRES PALOS MX (BTP)** — guantes de portero en México.

**En vivo:** https://oscararmando2.github.io/bajo-los-tres-palos-mx/

## Qué tiene

- **Hero cinemático con scroll-scrub.** El video no se reproduce solo: el scroll
  mueve el cabezal. La sección mide varias pantallas, el pin se queda fijo y
  `currentTime` se interpola hacia el punto que marca el scroll, así el barrido
  queda suave y no a tirones. Mismo patrón que el hero de CTD.
- **Catálogo con filtros** por corte (negativo, roll finger, plano, híbrido).
- **Guía de tallas** con el método de contorno de palma (pulgadas + 1).
- **Explicación de cortes** de guante.
- Todo en una sola página, sin framework ni build: HTML, CSS y JS plano.

## Cómo editar

### Datos de contacto y redes → `assets/js/config.js`

Es el único archivo que hay que tocar para poner los datos reales:

```js
window.BTP_CONFIG = {
  whatsapp: "5215512345678",   // 52 + 10 dígitos, sin signos
  instagram: "bajolostrespalosmx",
  tiktok: null,
  facebook: null,
  email: "hola@ejemplo.mx",
  ciudad: "Ciudad de México"
};
```

Mientras un campo valga `null`, el sitio muestra **"Por confirmar"** y manda el
botón a la sección de contacto en vez de dejar un enlace roto.

### Catálogo → `assets/js/productos.js`

Cada objeto del arreglo `BTP_PRODUCTOS` es una tarjeta:

| Campo | Qué es |
|---|---|
| `nombre` | Título de la tarjeta |
| `corte` | `negativo` · `roll` · `plano` · `hibrido` (son los filtros) |
| `nivel` | `pro` · `competencia` · `entrenamiento` · `juvenil` |
| `latex` | Texto libre, ej. `"Látex alemán 4 mm"` |
| `tallas` | Arreglo, ej. `[8, 9, 10, 11]` |
| `precio` | Número en MXN, o `null` para mostrar *"Consultar precio"* |
| `img` | Ruta de la foto; `""` usa la imagen genérica |
| `desc` | Una o dos líneas |

Las fotos van en `assets/img/productos/`.

Cuando cargues los modelos reales, pon `window.BTP_DEMO = false` para que
desaparezca el aviso de "catálogo de muestra".

## Estructura

```
index.html
assets/
  css/style.css
  js/config.js       ← contacto y redes
  js/productos.js    ← catálogo
  js/hero.js         ← scroll-scrub del video
  js/main.js         ← nav, filtros, reveals
  img/               ← logos, stills y póster
  media/hero.mp4     ← 720p, 2.5 MB (escritorio)
  media/hero-540.mp4 ← 540p, 1.4 MB (móvil y datos limitados)
fuente/              ← logo y video originales sin comprimir
```

El video se re-comprimió del original de 9.7 MB con keyframes cada 0.5 s para
que el barrido por scroll no se atore. `hero.js` elige la versión de 540p si el
ancho es menor a 768 px o si el navegador reporta ahorro de datos.

## Correr en local

```bash
python3 -m http.server 4173
```

Y abrir http://localhost:4173

## Degradado seguro

Sin JavaScript, sin soporte de video o con `prefers-reduced-motion: reduce`, el
hero se convierte en una portada normal de una pantalla con el póster fijo.
Nunca queda un pin roto.
