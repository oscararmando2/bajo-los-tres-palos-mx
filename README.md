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
  img/                  ← logo, pósters e imagen de compartir
  media/hero-1.mp4      ← 720p · 3.1 MB   (escritorio)
  media/hero-1-540.mp4  ← 540p · 1.8 MB   (móvil / ahorro de datos)
  media/hero-2.mp4      ← 720p · 3.0 MB
  media/hero-2-540.mp4  ← 540p · 1.7 MB
fuente/                 ← logo y videos originales sin comprimir
```

`hero.js` elige la versión de 540p si el ancho es menor a 768 px o si el
navegador reporta ahorro de datos. El clip 2 se descarga en segundo plano
mientras el usuario ve el 1.

## Ajustes rápidos

| Qué | Dónde |
|---|---|
| Largo del recorrido del scroll | `.cine.is-ready { height: 640vh }` en `style.css` (520vh en móvil) |
| Dónde empieza y termina cada clip | `SCRUB` y `REVELAR` en `hero.js` |
| Qué tan suave es el barrido | el `0.20` del bucle de interpolación en `hero.js` |
| Cuándo se desvanece el texto | el `0.22` de `medir()` en `hero.js` |

## Correr en local

```bash
python3 -m http.server 4173
```

Y abrir http://localhost:4173

## Degradado seguro

Sin JavaScript, sin soporte de video o con `prefers-reduced-motion: reduce`,
el hero se convierte en una portada normal de una pantalla con el póster fijo.
Nunca queda un pin roto.
