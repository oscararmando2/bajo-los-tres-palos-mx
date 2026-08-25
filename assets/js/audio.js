/* ==========================================================================
   BAJO LOS TRES PALOS MX · música del hero
   Ningún navegador deja arrancar audio sin un gesto del usuario, así que el
   tema empieza apagado y se enciende con el botón. La preferencia se recuerda
   entre visitas, pero aun así hace falta un gesto para reanudarlo.
   ========================================================================== */
(function () {
  var audio = document.getElementById('btp-audio');
  var boton = document.getElementById('btp-son');
  if (!audio || !boton) return;

  var VOL = 0.55;
  var CLAVE = 'btp-son';
  var sonando = false;
  var fundido = null;

  function recordar(v) { try { localStorage.setItem(CLAVE, v ? '1' : '0'); } catch (e) {} }
  function recordado() { try { return localStorage.getItem(CLAVE) === '1'; } catch (e) { return false; } }

  /* Subir o bajar el volumen a mano: un corte seco se oye como un golpe. */
  function fundir(destino, ms, alTerminar) {
    clearInterval(fundido);
    var desde = audio.volume, t0 = Date.now();
    fundido = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / ms);
      audio.volume = desde + (destino - desde) * k;
      if (k >= 1) { clearInterval(fundido); if (alTerminar) alTerminar(); }
    }, 30);
  }

  function pintar() {
    boton.classList.toggle('is-on', sonando);
    boton.setAttribute('aria-pressed', sonando ? 'true' : 'false');
    boton.setAttribute('aria-label', sonando ? 'Silenciar la música' : 'Poner la música');
  }

  function encender() {
    audio.volume = 0;
    var pr = audio.play();
    if (pr && pr.then) {
      pr.then(function () {
        sonando = true; recordar(true); pintar();
        fundir(VOL, 900);
      }).catch(function () {           // el navegador lo bloqueó: se queda apagado
        sonando = false; pintar();
      });
    } else {
      sonando = true; recordar(true); pintar(); fundir(VOL, 900);
    }
  }

  function apagar(persistir) {
    fundir(0, 350, function () { audio.pause(); });
    sonando = false;
    if (persistir !== false) recordar(false);
    pintar();
  }

  boton.addEventListener('click', function () {
    if (sonando) apagar(); else encender();
  });

  /* Si el usuario cambia de pestaña, el tema se calla y vuelve al regresar. */
  document.addEventListener('visibilitychange', function () {
    if (!sonando) return;
    if (document.hidden) { audio.pause(); }
    else { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); }
  });

  /* Preferencia guardada: no podemos arrancar solos, pero sí dejar listo el
     audio para que el primer gesto del usuario lo encienda sin espera. */
  if (recordado()) {
    audio.preload = 'auto';
    var alGesto = function () { encender(); };
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, alGesto, { once: true, passive: true });
    });
  }

  pintar();
})();
