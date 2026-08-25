# Bajo Los Tres Palos MX

Hero de una pantalla para **BAJO LOS TRES PALOS MX (BTP)** — guantes de portero.

**En vivo:** https://oscararmando2.github.io/bajo-los-tres-palos-mx/

## El efecto

Scroll-driven video scrubbing. La sección se fija en pantalla con un pin
(`position: sticky`) y el progreso del video queda ligado a la posición del
scroll: el video **no se reproduce solo**, avanza cuadro a cuadro conforme el
usuario baja y retrocede si sube. Al terminar el recorrido, la sección se
suelta.

Son **dos clips encadenados**. El primero barre la primera mitad del recorrido;
el segundo se revela encima entre el 44 % y el 56 % y barre la segunda mitad.
El revelado es monótono —el clip de abajo se queda a opacidad 1— para que el
póster nunca se asome en la transición. Si el segundo clip todavía no está
listo, no se revela y se sostiene el primero: la carga no se ve.

Técnica: sticky nativo + `requestAnimationFrame` controlando `currentTime`.
Sin GSAP ni ninguna otra librería.

### Detalles que hacen que no vaya a tirones

- **Keyframes densos.** Los clips se reencodearon con un keyframe cada 6
  cuadros (0.25 s a 24 fps). Sin eso el `seek` del scrub se atora.
  > Nota: el objetivo era `-g 3`, pero esta máquina no tiene ffmpeg y el
  > encoder de AVFoundation pierde el control de bitrate por debajo de GOP 6
  > (el mismo clip salía en 23 MB en vez de 3 MB). GOP 6 da 40 keyframes en
  > 10 s, de sobra para que el barrido se sienta continuo.
- **Interpolación.** El `currentTime` no salta al valor del scroll: se acerca
  un 20 % por cuadro. Con el scroll de rueda, sin esto se siente escalonado.
- **Priming para iOS.** Safari no permite hacer `seek` en un video que nunca se
  reprodujo, así que al primer gesto se lanza `play()` y se pausa de inmediato.
- Los videos van `muted`, `playsinline`, sin controles.

## Estructura

```
index.html
assets/
  css/style.css
  js/hero.js            ← todo el scrubbing
  js/audio.js           ← control de la música
  audio/btp-tema.m4a    ← tema original, 45 s en bucle
  img/                  ← logo, pósters e imagen de compartir
  media/hero-1.mp4      ← 1280×720 · 7 Mbps · 8.5 MB   (horizontal)
  media/hero-1-v.mp4    ←  720×1280 · 4.5 Mbps · 5.5 MB (vertical)
  media/hero-2.mp4      ← 1280×720 · 7 Mbps · 8.4 MB
  media/hero-2-v.mp4    ←  720×1280 · 4.5 Mbps · 5.5 MB
fuente/                 ← logo, videos originales y el script de la música
```

El clip 2 se descarga en segundo plano mientras el usuario ve el 1.

## Calidad de imagen

Dos decisiones cargan con casi toda la diferencia:

**Bitrate.** La fuente es H.264 a 8 Mbps. Medido contra ella, cuadro a cuadro:

| Bitrate | PSNR vs fuente | Peso |
|---|---|---|
| 2.5 Mbps | 36.0 dB | 3.1 MB |
| 5 Mbps | 41.1 dB | 6.1 MB |
| **7 Mbps** | **43.1 dB** | **8.5 MB** |
| 9 Mbps | 44.7 dB | 10.9 MB |

Se usa 7 Mbps: de ahí para arriba el retorno se aplana y el peso no.

**Variante vertical.** En una pantalla vertical, `object-fit: cover` sobre un
video 16:9 tira casi dos tercios del ancho. En un iPhone eso deja unos 333 px
reales estirados sobre 1170 px de pantalla — un aumento de 3.5×, y por eso se
veía suave por más bitrate que se le pusiera. La variante vertical ya viene
recortada al centro y codificada a 720×1280, así que todos sus píxeles son
píxeles visibles y el navegador sólo escala 1.6×.

`hero.js` elige la variante vertical cuando la pantalla es más alta que ancha
y mide 820 px o menos. La elección se hace una sola vez al cargar: cambiarla al
rotar obligaría a recargar el video a media animación.

> Techo real: la fuente es 1280×720. No hay forma de sacar detalle que no está
> en el original; lo que se puede es no perder el que sí está, y eso es lo que
> hacen estas dos decisiones. Si consigues los clips en 1080p o 4K, se
> reencodean con el mismo script y sube otro escalón.

## Música

`assets/audio/btp-tema.m4a` es un tema original, sintetizado desde cero con
`fuente/musica.py` — sin samples ni librerías de terceros, así que no hay
licencias de por medio. Re menor, 84 BPM, 16 compases (~45.7 s) pensados para
repetirse: sub-bajo, pad de cuerdas, ostinato de octavos, metales, taikos y
risers, con la mezcla abriendo de la intro al clímax y el último compás
despejándose para que el bucle respire.

Empieza **apagado** y se enciende con el botón del hero: ningún navegador deja
sonar audio sin un gesto, y tampoco está bien emboscar a quien llega con el
volumen arriba. La preferencia se guarda en `localStorage` y el tema se calla
solo al cambiar de pestaña.

Para cambiarlo por otra pista, basta reemplazar el archivo `.m4a` (o apuntar el
`<audio id="btp-audio">` de `index.html` a otro).

## Ajustes rápidos

| Qué | Dónde |
|---|---|
| Largo del recorrido del scroll | `.cine.is-ready { height: 640vh }` en `style.css` (520vh en móvil) |
| Dónde empieza y termina cada clip | `SCRUB` y `REVELAR` en `hero.js` |
| Qué tan suave es el barrido | el `0.20` del bucle de interpolación en `hero.js` |
| Cuándo se desvanece el texto | el `0.22` de `medir()` en `hero.js` |
| Volumen de la música | `VOL` en `audio.js` |
| Cuándo se usa el video vertical | el `820` de `hero.js` |

## Correr en local

```bash
python3 -m http.server 4173
```

Y abrir http://localhost:4173

## Degradado seguro

Sin JavaScript, sin soporte de video o con `prefers-reduced-motion: reduce`,
el hero se convierte en una portada normal de una pantalla con el póster fijo.
Nunca queda un pin roto.
