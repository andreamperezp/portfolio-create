/* ============================================================
   AndreaOS — Lógica del escritorio
   ============================================================ */
(function () {
  "use strict";
  const D = window.ANDREA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- BOOT ---------- */
  function boot() {
    const b = $("#boot");
    const desk = $("#desktop");
    setTimeout(() => {
      b.classList.add("is-hidden");
      desk.classList.add("is-on");
      desk.setAttribute("aria-hidden", "false");
    }, 2000);
    // Auto-abrir la ventana "Acerca de" como bienvenida
    setTimeout(() => openWindow("acerca"), 2700);
  }

  /* ---------- CLOCK ---------- */
  function tickClock() {
    const el = $("#clock");
    const now = new Date();
    const opts = { weekday: "short", hour: "2-digit", minute: "2-digit" };
    el.textContent = now
      .toLocaleString("es-AR", opts)
      .replace(".", "")
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  /* ---------- WINDOW MANAGER ---------- */
  const WIN = {
    acerca:      { title: "Acerca de Andrea", tpl: "tpl-acerca",      w: 560, h: 560, build: buildAbout },
    experiencia: { title: "Experiencia — Trayectoria", tpl: "tpl-experiencia", w: 620, h: 560, build: buildTimeline },
    notas:       { title: "Notas — Léeme", tpl: "tpl-notas",          w: 640, h: 480, build: buildNotes },
    contacto:    { title: "Contacto", tpl: "tpl-contacto",            w: 520, h: 420, build: buildContact },
  };

  let zTop = 100;
  const openWins = new Map();

  function openWindow(key) {
    const cfg = WIN[key];
    if (!cfg) return;
    if (openWins.has(key)) { focusWindow(key); return; }

    const win = document.createElement("section");
    win.className = "window is-front";
    win.dataset.key = key;
    win.style.width = cfg.w + "px";
    win.style.height = cfg.h + "px";

    // Cascade / center position
    const idx = openWins.size;
    const cx = Math.max(20, (window.innerWidth - cfg.w) / 2 + idx * 28 - 40);
    const cy = Math.max(48, (window.innerHeight - cfg.h) / 2 + idx * 24 - 30);
    win.style.left = cx + "px";
    win.style.top = cy + "px";
    win.style.zIndex = ++zTop;

    win.innerHTML = `
      <div class="window__bar">
        <div class="traffic">
          <span class="c" data-act="close"></span>
          <span class="m" data-act="min"></span>
          <span class="g"></span>
        </div>
        <span class="window__title">${cfg.title}</span>
      </div>
      <div class="window__body"></div>`;

    const body = $(".window__body", win);
    const tpl = $("#" + cfg.tpl);
    body.appendChild(tpl.content.cloneNode(true));

    $("#windows").appendChild(win);
    openWins.set(key, win);
    cfg.build(body);
    focusWindow(key);
    markDock();

    // Interactions
    makeDraggable(win);
    $(".traffic .c", win).addEventListener("click", () => closeWindow(key));
    $(".traffic .m", win).addEventListener("click", () => minWindow(key));
    win.addEventListener("mousedown", () => focusWindow(key));
  }

  function focusWindow(key) {
    const win = openWins.get(key);
    if (!win) return;
    win.style.zIndex = ++zTop;
    openWins.forEach((w) => w.classList.remove("is-front"));
    win.classList.add("is-front");
  }

  function closeWindow(key) {
    const win = openWins.get(key);
    if (!win) return;
    win.classList.add("is-closing");
    setTimeout(() => { win.remove(); openWins.delete(key); markDock(); }, 240);
  }

  function minWindow(key) {
    const win = openWins.get(key);
    if (!win) return;
    win.classList.add("is-min");
    setTimeout(() => { win.remove(); openWins.delete(key); markDock(); }, 340);
  }

  function markDock() {
    $$(".dock__app[data-open]").forEach((a) => {
      a.classList.toggle("is-running", openWins.has(a.dataset.open));
    });
  }

  /* ---------- DRAG ---------- */
  function makeDraggable(win) {
    const bar = $(".window__bar", win);
    let sx, sy, ox, oy, dragging = false;
    bar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".traffic")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      document.body.style.userSelect = "none";
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      let nx = ox + e.clientX - sx;
      let ny = Math.max(36, oy + e.clientY - sy); // no tapar la menubar
      win.style.left = nx + "px";
      win.style.top = ny + "px";
    });
    window.addEventListener("mouseup", () => { dragging = false; document.body.style.userSelect = ""; });
  }

  /* ---------- CONTENT BUILDERS ---------- */
  function buildAbout(body) {
    const chips = $("[data-chips]", body);
    D.keywords.forEach((k) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = k;
      chips.appendChild(c);
    });
  }

  function buildTimeline(body) {
    const wrap = $("[data-timeline]", body);
    D.experience.forEach((job) => {
      const item = document.createElement("div");
      item.className = "tl-item" + (job.current ? " is-current" : "");
      item.innerHTML = `
        <div class="tl-head">
          <div class="tl-role">${job.role} <span class="tl-company">· ${job.company}</span>
            ${job.current ? '<span class="tl-badge">Actual</span>' : ""}</div>
          <div class="tl-period">${job.period}</div>
        </div>
        <div class="tl-place">${job.place}</div>
        <ul class="tl-bullets">${job.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;
      wrap.appendChild(item);
    });
  }

  function buildNotes(body) {
    const sidebar = body;
    const notesBody = $("[data-note-body]", body);
    const today = new Date().toLocaleDateString("es-AR");

    const views = {
      perfil: () => `
        <div class="note-date">${today} · Perfil</div>
        <h3>Quién soy</h3>
        <p>Soy <b>${D.meta.name}</b>, ${D.meta.role.toLowerCase()}.</p>
        <p>Con más de <b>5 años</b> liderando equipos multidisciplinarios de diseño, desarrollo y
        producto, alineo la estrategia de negocio con la experiencia del usuario. Optimizo procesos
        con metodologías ágiles e integración de agentes de IA para maximizar la eficiencia y reducir
        tiempos de entrega.</p>
        <p style="font-style:italic;color:var(--teal)">"${D.meta.tagline}"</p>`,
      destacados: () => `
        <div class="note-date">${today} · Logros destacados</div>
        <h3>Lo destacado</h3>
        <ul>${D.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`,
      skills: () => `
        <div class="note-date">${today} · Competencias clave</div>
        <h3>Competencias</h3>
        <ul>${D.skills.map((s) => `<li><b>${s.label}:</b> ${s.detail}</li>`).join("")}</ul>`,
    };

    function show(note) {
      notesBody.innerHTML = views[note]();
      $$(".notes__item", sidebar).forEach((i) =>
        i.classList.toggle("is-active", i.dataset.note === note));
    }

    $$(".notes__item[data-note]", sidebar).forEach((item) =>
      item.addEventListener("click", () => show(item.dataset.note)));
    show("perfil");
  }

  function buildContact(body) {
    const grid = $("[data-contact]", body);
    const cards = [
      { i: "✉", t: "Email", s: D.meta.email, href: "mailto:" + D.meta.email },
      { i: "in", t: "LinkedIn", s: "andreamariange", href: D.meta.linkedin },
      { i: "◍", t: "Web", s: "andreaperez.dev", href: D.meta.web },
      { i: "☎", t: "Teléfono", s: D.meta.phone, href: "tel:" + D.meta.phone.replace(/\s/g, "") },
    ];
    cards.forEach((c) => {
      const a = document.createElement("a");
      a.className = "contact__card";
      a.href = c.href;
      if (c.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = `<span class="ci">${c.i}</span><span><small>${c.t}</small><strong>${c.s}</strong></span>`;
      grid.appendChild(a);
    });
  }

  /* ---------- CV DOWNLOAD ---------- */
  function downloadCV() {
    const a = document.createElement("a");
    a.href = D.meta.cv;
    a.download = "CV_Andrea_Perez.pdf";
    a.target = "_blank";
    a.click();
  }

  /* ---------- GLOBAL EVENTS ---------- */
  function wire() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) { openWindow(opener.dataset.open); return; }
      const dl = e.target.closest("[data-download]");
      if (dl) { downloadCV(); }
    });
    // Cerrar ventana enfocada con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const front = [...openWins.entries()].find(([, w]) => w.classList.contains("is-front"));
        if (front) closeWindow(front[0]);
      }
    });
  }

  /* ---------- INIT ---------- */
  tickClock();
  setInterval(tickClock, 15000);
  wire();
  boot();
})();
