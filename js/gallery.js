/* ============================================================
   AndreaOS — Galería de trabajos (datos publicados)
   ------------------------------------------------------------
   Estos son los trabajos que ven TODOS los visitantes.
   No hace falta editar a mano: usá el backoffice (botón ⚙ dentro
   de la Galería), cargá tus obras y tocá "Exportar" para generar
   una versión nueva de este archivo y subirla a GitHub.
   ============================================================ */

// Imágenes de ejemplo (reemplazalas desde el backoffice)
const _ph = (c1, c2, txt) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='560'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='900' height='560' fill='url(#g)'/><text x='450' y='300' font-family='Inter,sans-serif' font-size='38' font-weight='600' fill='white' text-anchor='middle' opacity='0.92'>${txt}</text></svg>`
  );

window.GALLERY_SEED = [
  {
    id: "w1",
    title: "Design System — Delsud",
    desc: "Sistema de diseño escalable que unificó la identidad de producto y aceleró la entrega de features del equipo.",
    tags: ["Design System", "UX/UI", "Figma"],
    images: [_ph("#8b7bff", "#4fd6c9", "Design System"), _ph("#6f7bff", "#ff8fc7", "Componentes")]
  },
  {
    id: "w2",
    title: "Landing estratégica — Albanghu",
    desc: "Landing page que reforzó la identidad visual de la marca, con foco en conversión y una experiencia clara.",
    tags: ["Landing", "Branding", "Frontend"],
    images: [_ph("#4fd6c9", "#2f8f88", "Landing Page")]
  },
  {
    id: "w3",
    title: "App móvil — Caso UX",
    desc: "Rediseño de flujo con research, wireframes y prototipo de alta fidelidad. Mejoras medibles en usabilidad.",
    tags: ["Mobile", "Research", "Prototipo"],
    images: [_ph("#ff8fc7", "#8b7bff", "UX Case"), _ph("#ffb35c", "#ff6f91", "Prototipo")]
  }
];
