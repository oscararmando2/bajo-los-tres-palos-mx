/* ==========================================================================
   BAJO LOS TRES PALOS MX · render del catálogo
   Los datos viven en productos.js; el número de WhatsApp en config.js.
   Si no hay número, el botón lleva al ancla de contacto en vez de dejar
   un enlace roto.
   ========================================================================== */
(function () {
  var grid = document.getElementById('grid-prod');
  var prods = window.BTP_PRODUCTOS || [];
  if (!grid || !prods.length) return;

  var CORTES = window.BTP_CORTES || {};
  var GAMAS = window.BTP_GAMAS || {};
  var cfg = window.BTP_CONFIG || {};

  function waPara(p) {
    if (!cfg.whatsapp) return null;
    var txt = 'Hola, me interesan los ' + p.nombre + ' ' + p.color +
              '. ¿Qué tallas tienen disponibles?';
    return 'https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') +
           '?text=' + encodeURIComponent(txt);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function tarjeta(p) {
    var enlace = waPara(p);
    var meta = [];
    if (p.corte && CORTES[p.corte]) meta.push(CORTES[p.corte]);
    meta.push('Tallas ' + p.tallas.join(' · '));
    meta = meta.concat((p.specs || []).slice(0, 2));

    return '' +
      '<article class="card" data-corte="' + esc(p.corte || '') + '" data-gama="' + esc(p.gama) + '">' +
        '<div class="card-img">' +
          '<span class="card-tag">' + esc(GAMAS[p.gama] || p.gama) + '</span>' +
          '<img src="assets/img/productos/' + esc(p.slug) + '.webp" ' +
               'alt="Guante de portero Rinat ' + esc(p.nombre + ' ' + p.color) + '" ' +
               'loading="lazy" width="800" height="800">' +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + esc(p.nombre) + '</h3>' +
          '<p class="card-color">' + esc(p.color) + '</p>' +
          '<p class="card-desc">' + esc(p.desc) + '</p>' +
          '<div class="card-meta">' +
            meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') +
          '</div>' +
          '<div class="card-foot">' +
            '<span class="card-precio">Consultar precio</span>' +
            (enlace
              ? '<a class="card-link" href="' + enlace + '" target="_blank" rel="noopener">Preguntar ↗</a>'
              : '<a class="card-link" href="#contacto">Preguntar ↗</a>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function pintar(filtro) {
    var vis = filtro === 'todos'
      ? prods
      : prods.filter(function (p) { return p.corte === filtro; });
    grid.innerHTML = vis.length
      ? vis.map(tarjeta).join('')
      : '<p class="vacio">No hay modelos con ese corte por ahora.</p>';
  }

  // Sólo se ofrecen los cortes que existen en el catálogo: un filtro que
  // siempre devuelve cero no es un filtro, es una decepción.
  var cortes = [];
  prods.forEach(function (p) {
    if (p.corte && cortes.indexOf(p.corte) < 0) cortes.push(p.corte);
  });

  var barra = document.getElementById('filtros');
  if (barra) {
    barra.innerHTML =
      '<button class="chip is-on" data-filtro="todos" aria-pressed="true">' +
        'Todos (' + prods.length + ')</button>' +
      cortes.map(function (c) {
        var n = prods.filter(function (p) { return p.corte === c; }).length;
        return '<button class="chip" data-filtro="' + esc(c) + '" aria-pressed="false">' +
               esc(CORTES[c] || c) + ' (' + n + ')</button>';
      }).join('');

    barra.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      [].forEach.call(barra.querySelectorAll('.chip'), function (c) {
        c.classList.remove('is-on');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-on');
      chip.setAttribute('aria-pressed', 'true');
      pintar(chip.dataset.filtro);
    });
  }

  pintar('todos');

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
