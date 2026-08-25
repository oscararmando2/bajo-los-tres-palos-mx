/* ==========================================================================
   BAJO LOS TRES PALOS MX · interacciones del sitio
   Nav, reveals, catálogo con filtros y datos de contacto desde config.js
   ========================================================================== */
(function () {
  var cfg = window.BTP_CONFIG || {};

  /* ---------- Enlaces derivados de la configuración --------------------- */
  var waURL = cfg.whatsapp
    ? 'https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') +
      '?text=' + encodeURIComponent(cfg.mensajeWA || 'Hola, quiero información.')
    : null;

  function pedirWA(producto) {
    if (!cfg.whatsapp) return null;
    var txt = 'Hola, me interesa: ' + producto + '. ¿Qué tallas tienen disponibles?';
    return 'https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') +
           '?text=' + encodeURIComponent(txt);
  }

  /* Todo lo marcado data-wa apunta a WhatsApp; si no hay número, lleva a
     contacto y se anuncia como pendiente en vez de dejar un enlace roto. */
  [].forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    if (waURL) { a.href = waURL; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.href = '#contacto'; }
  });
  if (!waURL) {
    var flot = document.querySelector('.wa-float');
    if (flot) flot.remove();
  }

  /* Datos de contacto */
  function dato(id, valor, href) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!valor) { el.innerHTML = '<span class="pendiente">Por confirmar</span>'; return; }
    el.innerHTML = href
      ? '<a href="' + href + '" target="_blank" rel="noopener">' + valor + '</a>'
      : valor;
  }
  dato('dato-wa', cfg.whatsapp ? '+' + String(cfg.whatsapp).replace(/\D/g, '') : null, waURL);
  dato('dato-mail', cfg.email, cfg.email ? 'mailto:' + cfg.email : null);
  dato('dato-ciudad', cfg.ciudad, null);
  dato('dato-ig', cfg.instagram ? '@' + cfg.instagram : null,
       cfg.instagram ? 'https://instagram.com/' + cfg.instagram : null);

  var redes = document.getElementById('redes');
  if (redes) {
    var lista = [
      ['Instagram', cfg.instagram && 'https://instagram.com/' + cfg.instagram],
      ['TikTok', cfg.tiktok && 'https://tiktok.com/@' + cfg.tiktok],
      ['Facebook', cfg.facebook && 'https://facebook.com/' + cfg.facebook]
    ].filter(function (r) { return r[1]; });
    redes.innerHTML = lista.length
      ? lista.map(function (r) {
          return '<a class="red" href="' + r[1] + '" target="_blank" rel="noopener">' + r[0] + ' ↗</a>';
        }).join('')
      : '<span class="pendiente">Redes sociales por confirmar</span>';
  }

  /* ---------- Nav ------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  var menu = document.getElementById('nav-mobile');
  var burger = document.querySelector('.nav-burger');

  function alScroll() { if (nav) nav.classList.toggle('is-stuck', window.scrollY > 40); }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abierto = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    [].forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveals --------------------------------------------------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    [].forEach.call(rv, function (el, i) {
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    [].forEach.call(rv, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Catálogo -------------------------------------------------- */
  var grid = document.getElementById('grid-prod');
  var prods = window.BTP_PRODUCTOS || [];
  if (grid && prods.length) {
    var NOMBRE_CORTE = {
      negativo: 'Corte negativo', roll: 'Roll finger',
      plano: 'Corte plano', hibrido: 'Híbrido'
    };
    var NOMBRE_NIVEL = {
      pro: 'Pro', competencia: 'Competencia',
      entrenamiento: 'Entrenamiento', juvenil: 'Juvenil'
    };
    var GENERICA = 'assets/img/hero-poster.jpg';
    var mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function tarjeta(p) {
      var enlace = pedirWA(p.nombre);
      var precio = p.precio
        ? '<span class="card-precio">' + mxn.format(p.precio) + '</span>'
        : '<span class="card-precio consulta">Consultar precio</span>';
      var boton = enlace
        ? '<a class="card-link" href="' + enlace + '" target="_blank" rel="noopener">Preguntar ↗</a>'
        : '<a class="card-link" href="#contacto">Preguntar ↗</a>';
      return '' +
        '<article class="card rv" data-corte="' + esc(p.corte) + '" data-nivel="' + esc(p.nivel) + '">' +
          '<div class="card-img">' +
            '<span class="card-tag">' + esc(NOMBRE_NIVEL[p.nivel] || p.nivel) + '</span>' +
            '<img src="' + esc(p.img || GENERICA) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="600" height="450">' +
          '</div>' +
          '<div class="card-body">' +
            '<h3>' + esc(p.nombre) + '</h3>' +
            '<div class="card-meta">' +
              '<span>' + esc(NOMBRE_CORTE[p.corte] || p.corte) + '</span>' +
              '<span>' + esc(p.latex || '') + '</span>' +
              '<span>Tallas ' + esc((p.tallas || []).join(' · ')) + '</span>' +
            '</div>' +
            '<p class="card-desc">' + esc(p.desc || '') + '</p>' +
            '<div class="card-foot">' + precio + boton + '</div>' +
          '</div>' +
        '</article>';
    }

    function pintar(filtro) {
      var vis = filtro === 'todos' ? prods : prods.filter(function (p) { return p.corte === filtro; });
      grid.innerHTML = vis.length
        ? vis.map(tarjeta).join('')
        : '<p class="vacio">No hay modelos en esta categoría todavía.</p>';
      // los reveals de las tarjetas recién creadas se muestran de inmediato
      requestAnimationFrame(function () {
        [].forEach.call(grid.querySelectorAll('.rv'), function (el, i) {
          el.style.transitionDelay = ((i % 4) * 60) + 'ms';
          el.classList.add('is-in');
        });
      });
    }

    pintar('todos');

    [].forEach.call(document.querySelectorAll('.chip'), function (chip) {
      chip.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('.chip'), function (c) {
          c.classList.remove('is-on');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-on');
        chip.setAttribute('aria-pressed', 'true');
        pintar(chip.dataset.filtro);
      });
    });

    var aviso = document.getElementById('aviso-demo');
    if (aviso && !window.BTP_DEMO) aviso.remove();
  }

  /* ---------- Año del footer -------------------------------------------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
