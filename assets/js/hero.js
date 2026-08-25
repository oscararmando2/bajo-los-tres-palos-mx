/* ==========================================================================
   BAJO LOS TRES PALOS MX · hero con scroll-driven video scrubbing
   --------------------------------------------------------------------------
   La sección mide varias pantallas y el pin (position:sticky) se queda fijo
   mientras dura el recorrido. El video no se reproduce solo: su currentTime
   está atado a la posición del scroll, así que avanza cuadro a cuadro cuando
   bajas y retrocede cuando subes.

   Son dos clips encadenados: el primero ocupa la mitad del recorrido y el
   segundo aparece encima (revelado monótono, nunca se asoma el póster entre
   los dos). Cada clip interpola su currentTime en un bucle de rAF para que el
   barrido salga suave y no a tirones.

   Sticky nativo + rAF. Sin librerías.
   ========================================================================== */
(function () {
  var sec = document.getElementById('inicio');
  if (!sec) return;

  var clips = [].slice.call(sec.querySelectorAll('.cine-clip'));
  var copy  = sec.querySelector('.cine-copy');
  var prog  = sec.querySelector('.cine-prog');
  var cue   = sec.querySelector('.cine-cue');
  var hud   = sec.querySelector('.cine-hud-idx');
  if (!clips.length) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  /* ---- Fuente según la forma de la pantalla ----------------------------
     En vertical el `object-fit:cover` de un video 16:9 recorta casi dos
     tercios del ancho, así que lo que se ve queda con muy pocos píxeles
     reales. Para eso existe la variante vertical: ya viene recortada al
     centro y codificada a 720×1280, de modo que todos sus píxeles son
     píxeles visibles. La elección se hace una sola vez al cargar; cambiarla
     al rotar obligaría a recargar el video a media animación. */
  var vertical = window.innerHeight > window.innerWidth && window.innerWidth <= 820;
  clips.forEach(function (v) {
    v.src = vertical ? v.dataset.srcV : v.dataset.srcH;
  });

  /* ---- Ventanas de cada clip sobre el progreso de la sección ------------
     El clip 0 barre de 0 a 0.47 y el 1 de 0.53 a 1. Entre 0.44 y 0.56 el
     segundo se revela encima del primero, que se queda debajo a opacidad 1. */
  var SCRUB   = [[0.00, 0.47], [0.53, 1.00]];
  var REVELAR = [[0.00, 0.00], [0.44, 0.56]];

  var dur   = clips.map(function () { return 0; });
  var listo = clips.map(function () { return false; });
  var meta  = clips.map(function () { return false; });
  var obj   = clips.map(function () { return 0; });   // segundo objetivo
  var act   = clips.map(function () { return 0; });   // segundo interpolado
  var vis   = clips.map(function () { return 0; });   // opacidad actual

  clips.forEach(function (v, i) {
    function medirDur() {
      if (v.duration && isFinite(v.duration)) { dur[i] = v.duration; meta[i] = true; }
    }
    v.addEventListener('loadedmetadata', medirDur);
    v.addEventListener('loadeddata', medirDur);
    v.addEventListener('canplay', function () { medirDur(); if (v.readyState >= 3) marcar(i); });
    v.addEventListener('canplaythrough', function () { medirDur(); marcar(i); });
  });

  function marcar(i) {
    if (listo[i]) return;
    listo[i] = true;
    if (i === 0) { sec.classList.add('is-playing'); cargarSiguiente(1); }
    medir();
  }

  /* El clip 1 se descarga en segundo plano mientras el usuario ve el 0, así la
     espera no se nota. Un tiempo de gracia evita que la cadena se atore. */
  function cargarSiguiente(i) {
    if (i >= clips.length) return;
    clips[i].preload = 'auto';
    try { clips[i].load(); } catch (e) {}
  }
  clips[0].preload = 'auto';
  try { clips[0].load(); } catch (e) {}
  setTimeout(function () { cargarSiguiente(1); }, 4000);

  sec.classList.add('is-ready');

  /* ---- Priming para iOS -------------------------------------------------
     Safari en iOS no permite hacer seek en un video que nunca se reprodujo.
     Al primer gesto lanzamos play() y pausamos de inmediato. */
  var cebado = false;
  function cebar() {
    if (cebado) return; cebado = true;
    clips.forEach(function (v) {
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
      else { try { v.pause(); } catch (e) {} }
    });
  }
  ['scroll', 'pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, cebar, { once: true, passive: true });
  });

  /* ---- Utilidades ------------------------------------------------------- */
  var clamp  = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  var suave  = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var tramo  = function (p, a, b) { return b === a ? (p >= b ? 1 : 0) : clamp((p - a) / (b - a), 0, 1); };

  var p = 0;
  var enVista = true;

  function medir() {
    var r = sec.getBoundingClientRect();
    enVista = r.bottom > 0 && r.top < window.innerHeight;
    var recorrido = sec.offsetHeight - window.innerHeight;
    p = recorrido <= 0 ? 0 : clamp(-r.top / recorrido, 0, 1);

    if (prog) prog.style.width = (p * 100).toFixed(2) + '%';
    if (hud)  hud.textContent = String(Math.round(p * 100)).padStart(3, '0') + ' %';
    if (cue)  cue.style.opacity = (1 - suave(p / 0.05)).toFixed(2);

    if (copy) {                                   // el texto se va pronto
      var f = 1 - suave(p / 0.22);
      copy.style.opacity = f.toFixed(3);
      copy.style.transform = 'translateY(' + ((1 - f) * -36).toFixed(1) + 'px)';
      copy.style.pointerEvents = f < 0.08 ? 'none' : '';
    }

    /* Revelado monótono: el clip de encima aparece sobre el de abajo, que se
       queda a opacidad 1. Si el segundo aún no está listo, no se revela y se
       sostiene el primero: la carga nunca se ve. */
    for (var i = 0; i < clips.length; i++) {
      var op = i === 0 ? 1 : suave(tramo(p, REVELAR[i][0], REVELAR[i][1]));
      if (i > 0 && !listo[i]) op = 0;
      vis[i] = op;
      clips[i].style.opacity = op;
      obj[i] = tramo(p, SCRUB[i][0], SCRUB[i][1]) * Math.max(dur[i] - 0.05, 0);
    }
  }

  var pendiente = false;
  function alScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; medir(); });
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  window.addEventListener('resize', medir);

  /* ---- Bucle de interpolación ------------------------------------------
     Acerca el tiempo mostrado al objetivo un 20 % por cuadro y sólo pide un
     seek si el salto lo amerita (~medio cuadro a 24 fps). Sin esto el scrub
     se siente escalonado con el scroll por rueda. */
  (function bucle() {
    requestAnimationFrame(bucle);
    if (!enVista) return;
    for (var i = 0; i < clips.length; i++) {
      // Ni el que no está listo, ni el que está tapado del todo por el de
      // encima: seguir moviendo su cabezal sería gastar seeks a ciegas.
      if (!listo[i] || vis[i] < 0.01) continue;
      if (i + 1 < clips.length && vis[i + 1] > 0.995) continue;
      act[i] += (obj[i] - act[i]) * 0.20;
      if (Math.abs(obj[i] - act[i]) < 0.004) act[i] = obj[i];
      var v = clips[i];
      if (v.seeking) continue;
      if (Math.abs(v.currentTime - act[i]) > 0.02) {
        try { v.currentTime = act[i]; } catch (e) {}
      }
    }
  })();

  medir();
})();
