/* ==========================================================================
   BAJO LOS TRES PALOS MX · hero cinemático
   El scroll no "hace scroll": mueve el cabezal del video. La sección mide
   varias pantallas, el pin se queda fijo y currentTime se interpola hacia el
   punto que marca el scroll, así el scrub queda suave y no a tirones.
   Degradado seguro: sin JS, sin video o con reduced-motion queda un hero
   normal de una pantalla con el póster.
   ========================================================================== */
(function () {
  var sec = document.getElementById('inicio');
  if (!sec) return;
  var video = sec.querySelector('.cine-clip');
  var copy = sec.querySelector('.cine-copy');
  var prog = sec.querySelector('.cine-prog');
  var cue = sec.querySelector('.cine-cue');
  var hud = sec.querySelector('.cine-hud-idx');
  if (!video) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Fuente según ancho y ahorro de datos: 540p en móvil, 720p en escritorio. */
  var conn = navigator.connection || {};
  var ligero = window.innerWidth < 768 || conn.saveData === true ||
               /2g/.test(conn.effectiveType || '');
  video.src = ligero ? video.dataset.srcSm : video.dataset.srcLg;

  if (reduce) { video.removeAttribute('src'); return; }   // se queda el póster

  var clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  var dur = 0;
  var listo = false;
  var objetivo = 0;      // segundo al que apunta el scroll
  var actual = 0;        // segundo mostrado (interpolado)
  var p = 0;             // progreso 0..1 de la sección
  var enVista = true;    // el pin está en pantalla

  function marcarListo() {
    if (listo) return;
    dur = video.duration || 0;
    if (!dur || !isFinite(dur)) return;
    listo = true;
    sec.classList.add('is-playing');
    medir();
  }
  video.addEventListener('loadedmetadata', function () { dur = video.duration || 0; });
  video.addEventListener('canplaythrough', marcarListo);
  video.addEventListener('canplay', marcarListo);
  video.addEventListener('error', function () { sec.classList.remove('is-ready'); });
  try { video.load(); } catch (e) {}

  /* Con JS activo la sección crece y el pin toma el control. */
  sec.classList.add('is-ready');

  /* iOS sólo permite hacer seek después de un play(); lo cebamos al primer
     gesto o scroll y lo pausamos de inmediato. */
  var cebado = false;
  function cebar() {
    if (cebado) return; cebado = true;
    var pr = video.play();
    if (pr && pr.then) pr.then(function () { video.pause(); }).catch(function () {});
    else { try { video.pause(); } catch (e) {} }
  }
  ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, cebar, { once: true, passive: true });
  });

  function medir() {
    var r = sec.getBoundingClientRect();
    enVista = r.bottom > 0 && r.top < window.innerHeight;
    var recorrido = sec.offsetHeight - window.innerHeight;
    p = recorrido <= 0 ? 0 : clamp(-r.top / recorrido, 0, 1);
    objetivo = p * Math.max(dur - 0.05, 0);

    if (prog) prog.style.width = (p * 100).toFixed(2) + '%';

    if (copy) {                       // el texto se va antes que el video
      var f = 1 - smooth(p / 0.30);
      copy.style.opacity = f.toFixed(3);
      copy.style.transform = 'translateY(' + ((1 - f) * -34).toFixed(1) + 'px)';
      copy.style.pointerEvents = f < 0.08 ? 'none' : '';
    }
    if (hud) hud.textContent = String(Math.round(p * 100)).padStart(3, '0') + ' %';
    if (cue) cue.style.opacity = smooth((p - 0.90) / 0.06).toFixed(2);
  }

  var pendiente = false;
  function alScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; medir(); });
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  window.addEventListener('resize', medir);

  /* Bucle de interpolación: acerca `actual` a `objetivo` un 18% por cuadro.
     Sólo pedimos un seek si el salto vale la pena (~medio cuadro a 24 fps). */
  (function bucle() {
    requestAnimationFrame(bucle);
    if (!listo || !enVista) return;   // fuera de pantalla no gastamos cuadros
    actual += (objetivo - actual) * 0.18;
    if (Math.abs(objetivo - actual) < 0.004) actual = objetivo;
    if (video.seeking) return;
    if (Math.abs(video.currentTime - actual) > 0.02) {
      try { video.currentTime = actual; } catch (e) {}
    }
  })();

  medir();
})();
