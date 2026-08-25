/* ==========================================================================
   BAJO LOS TRES PALOS MX · configuración del sitio
   --------------------------------------------------------------------------
   EDITA SOLO ESTE ARCHIVO para poner los datos reales de contacto y redes.
   Mientras un campo valga null, la web muestra "Por confirmar" y desactiva
   el botón correspondiente (nunca deja un enlace roto en producción).
   ========================================================================== */

window.BTP_CONFIG = {
  // WhatsApp en formato internacional SIN signos: 52 + 10 dígitos.
  // Ejemplo: "5215512345678"   ← cámbialo por el número real.
  whatsapp: null,

  // Usuario sin la @ (ej. "bajolostrespalosmx"). null = se oculta el enlace.
  instagram: null,
  tiktok: null,
  facebook: null,

  // Correo de contacto (ej. "hola@bajolostrespalos.mx")
  email: null,

  // Ciudad / zona de operación (ej. "Ciudad de México")
  ciudad: null,

  // Texto que se precarga en el mensaje de WhatsApp
  mensajeWA: 'Hola, vengo de la página web y quiero información sobre los guantes.'
};
