/* ============================================================
   AndreaOS — Lógica del escritorio
   ============================================================ */
(function () {
  "use strict";
  const D = window.ANDREA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isMobile = () => window.matchMedia("(max-width: 720px)").matches;

  /* ---------- SUPABASE CLIENT ---------- */
  const SUPA = window.SUPA || null;
  const SB = (SUPA && window.supabase && window.supabase.createClient)
    ? window.supabase.createClient(SUPA.url, SUPA.key)
    : null;

  /* ---------- BOOT ---------- */
  function boot() {
    const b = $("#boot");
    const desk = $("#desktop");
    setTimeout(() => {
      b.classList.add("is-hidden");
      desk.classList.add("is-on");
      desk.setAttribute("aria-hidden", "false");
    }, 2000);
    setTimeout(() => openWindow("acerca"), 2700);
  }

  /* ---------- CLOCK ---------- */
  function tickClock() {
    const el = $("#clock");
    const now = new Date();
    el.textContent = now
      .toLocaleString("es-AR", { weekday: "short", hour: "2-digit", minute: "2-digit" })
      .replace(".", "")
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  /* ---------- WINDOW MANAGER ---------- */
  const WIN = {
    acerca:      { title: "Acerca de Andrea", tpl: "tpl-acerca", w: 560, h: 560, build: buildAbout },
    experiencia: { title: "Experiencia — Trayectoria", tpl: "tpl-experiencia", w: 620, h: 560, build: buildTimeline },
    skills:      { title: "Skills — Competencias", tpl: "tpl-skills", w: 560, h: 580, build: buildSkills },
    galeria:     { title: "Galería de trabajos", tpl: "tpl-galeria", w: 760, h: 580, build: buildGallery },
    notas:       { title: "Notas — Léeme", tpl: "tpl-notas", w: 640, h: 480, build: buildNotes },
    contacto:    { title: "Contacto", tpl: "tpl-contacto", w: 520, h: 420, build: buildContact },
    admin:       { title: "Backoffice — Galería", tpl: "tpl-admin", w: 760, h: 600, build: buildAdmin, noDock: true },
  };

  let zTop = 100;
  const openWins = new Map();

  function openWindow(key) {
    const cfg = WIN[key];
    if (!cfg) return;
    if (openWins.has(key)) {
      restoreWindow(key);
      focusWindow(key);
      return;
    }

    const win = document.createElement("section");
    win.className = "window is-front";
    win.dataset.key = key;
    win.style.width = cfg.w + "px";
    win.style.height = cfg.h + "px";

    const idx = openWins.size;
    const cx = Math.max(16, (window.innerWidth - cfg.w) / 2 + idx * 28 - 40);
    const cy = Math.max(46, (window.innerHeight - cfg.h) / 2 + idx * 24 - 30);
    win.style.left = cx + "px";
    win.style.top = cy + "px";
    win.style.zIndex = ++zTop;

    win.innerHTML = `
      <div class="window__bar">
        <div class="traffic">
          <span class="c" data-act="close" title="Cerrar"></span>
          <span class="m" data-act="min" title="Minimizar"></span>
          <span class="g" data-act="max" title="Maximizar"></span>
        </div>
        <span class="window__title">${cfg.title}</span>
      </div>
      <div class="window__body"></div>`;

    const body = $(".window__body", win);
    body.appendChild($("#" + cfg.tpl).content.cloneNode(true));

    $("#windows").appendChild(win);
    openWins.set(key, win);
    cfg.build(body, win);
    if (isMobile()) win.classList.add("is-max"); // en celular: pantalla completa
    focusWindow(key);
    markDock();

    makeDraggable(win);
    const bar = $(".window__bar", win);
    $(".traffic .c", win).addEventListener("click", (e) => { e.stopPropagation(); closeWindow(key); });
    $(".traffic .m", win).addEventListener("click", (e) => { e.stopPropagation(); minimizeWindow(key); });
    $(".traffic .g", win).addEventListener("click", (e) => { e.stopPropagation(); toggleMax(win); });
    bar.addEventListener("dblclick", (e) => { if (!e.target.closest(".traffic")) toggleMax(win); });
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

  function minimizeWindow(key) {
    const win = openWins.get(key);
    if (!win) return;
    win.classList.add("is-min");
    setTimeout(() => { win.classList.remove("is-min"); win.classList.add("is-minimized"); }, 320);
  }

  function restoreWindow(key) {
    const win = openWins.get(key);
    if (!win) return;
    if (win.classList.contains("is-minimized")) {
      win.classList.remove("is-minimized");
      win.classList.add("is-restoring");
      setTimeout(() => win.classList.remove("is-restoring"), 320);
    }
  }

  function toggleMax(win) {
    win.classList.toggle("is-max");
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
      if (isMobile() || win.classList.contains("is-max")) return; // no drag maximizado / mobile
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      document.body.style.userSelect = "none";
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      win.style.left = ox + e.clientX - sx + "px";
      win.style.top = Math.max(34, oy + e.clientY - sy) + "px";
    });
    window.addEventListener("mouseup", () => { dragging = false; document.body.style.userSelect = ""; });
  }

  /* ---------- BUILDERS: ABOUT ---------- */
  function buildAbout(body) {
    const chips = $("[data-chips]", body);
    D.keywords.forEach((k) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = k;
      chips.appendChild(c);
    });
  }

  /* ---------- BUILDERS: TIMELINE ---------- */
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

  /* ---------- BUILDERS: SKILLS (carga animada) ---------- */
  function buildSkills(body) {
    const list = $("[data-skills]", body);
    D.skills.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "skill";
      row.innerHTML = `
        <div class="skill__top">
          <span class="skill__icon">${s.icon || "✦"}</span>
          <span class="skill__label">${s.label}</span>
          <span class="skill__pct" data-pct>0%</span>
        </div>
        <div class="skill__track"><span class="skill__fill"></span></div>
        <div class="skill__detail">${s.detail}</div>`;
      list.appendChild(row);

      const fill = $(".skill__fill", row);
      const pct = $("[data-pct]", row);
      const delay = 250 + i * 160;
      setTimeout(() => {
        fill.style.width = s.level + "%";
        countUp(pct, s.level, 900);
        row.classList.add("is-in");
      }, delay);
    });

    // Formación como chips en el pie
    const foot = $("[data-skills-foot]", body);
    if (foot && D.education) {
      foot.innerHTML =
        '<h4>Formación</h4><div class="skills__edu">' +
        D.education.map((e) => `<span>${e}</span>`).join("") +
        "</div>";
    }
  }

  function countUp(el, target, dur) {
    const start = performance.now();
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + "%";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- GALLERY DATA (Supabase + fallback local) ---------- */
  // Convierte una fila de la base al formato que usa el frontend.
  function rowToItem(r) {
    return {
      id: r.id,
      title: r.title || "",
      desc: r.description || "",
      tags: r.tags || [],
      images: r.images || [],
      position: r.position || 0,
    };
  }

  // Lee la galería desde Supabase; si no hay conexión, usa el seed de gallery.js.
  async function fetchGallery() {
    if (!SB) return (window.GALLERY_SEED || []).slice();
    const { data, error } = await SB
      .from(SUPA.table)
      .select("id,title,description,tags,images,position,created_at")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("No se pudo cargar la galería desde Supabase:", error.message);
      return (window.GALLERY_SEED || []).slice();
    }
    return (data || []).map(rowToItem);
  }

  /* ---------- BUILDERS: GALLERY ---------- */
  function buildGallery(body) {
    const grid = $("[data-gallery]", body);
    grid.innerHTML = '<p class="gallery__empty">Cargando galería…</p>';
    fetchGallery().then((items) => renderGalleryGrid(grid, items));
    $("[data-admin]", body).addEventListener("click", openAdmin);
  }

  function renderGalleryGrid(grid, items) {
    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = '<p class="gallery__empty">Todavía no hay trabajos. Abrí el backoffice ⚙ para cargar el primero.</p>';
      return;
    }
    items.forEach((it) => {
      const cover = (it.images && it.images[0]) || "";
      const card = document.createElement("button");
      card.className = "gcard";
      card.innerHTML = `
        <span class="gcard__img" style="background-image:url('${cover}')">
          ${it.images && it.images.length > 1 ? `<span class="gcard__count">🖼 ${it.images.length}</span>` : ""}
        </span>
        <span class="gcard__meta">
          <strong>${it.title || "Sin título"}</strong>
          <small>${(it.tags || []).join(" · ")}</small>
        </span>`;
      card.addEventListener("click", () => openLightbox(it, 0));
      grid.appendChild(card);
    });
  }

  function refreshGallery() {
    const win = openWins.get("galeria");
    if (win) fetchGallery().then((items) => renderGalleryGrid($("[data-gallery]", win), items));
  }

  /* ---------- LIGHTBOX ---------- */
  const LB = { item: null, i: 0 };
  function openLightbox(item, i) {
    LB.item = item; LB.i = i;
    const lb = $("#lightbox");
    lb.hidden = false;
    renderLightbox();
  }
  function renderLightbox() {
    const it = LB.item; if (!it) return;
    const imgs = it.images || [];
    $("[data-lb-img]").src = imgs[LB.i] || "";
    $("[data-lb-title]").textContent = it.title || "";
    $("[data-lb-desc]").textContent = it.desc || "";
    $("[data-lb-count]").textContent = imgs.length > 1 ? `${LB.i + 1} / ${imgs.length}` : "";
    const multi = imgs.length > 1;
    $("[data-lb-prev]").style.display = multi ? "" : "none";
    $("[data-lb-next]").style.display = multi ? "" : "none";
  }
  function lbNav(d) {
    const n = (LB.item.images || []).length;
    if (!n) return;
    LB.i = (LB.i + d + n) % n;
    renderLightbox();
  }
  function closeLightbox() { $("#lightbox").hidden = true; LB.item = null; }

  /* ---------- BACKOFFICE (login real con Supabase) ---------- */
  function openAdmin() {
    openWindow("admin");
  }

  function traducirError(msg) {
    if (/invalid login credentials/i.test(msg)) return "Email o contraseña incorrectos.";
    if (/email not confirmed/i.test(msg)) return "Falta confirmar el email de esa cuenta.";
    if (/failed to fetch|network/i.test(msg)) return "Sin conexión con el servidor. Reintentá.";
    return msg;
  }

  async function buildAdmin(body) {
    const loadingView = $("[data-admin-loading]", body);
    const loginView = $("[data-admin-login]", body);
    const panelView = $("[data-admin-panel]", body);
    const loginForm = $("[data-login-form]", body);
    const loginMsg = $("[data-login-msg]", body);
    const loginBtn = $("[data-login-btn]", body);

    function show(state) {
      loadingView.hidden = state !== "loading";
      loginView.hidden = state !== "login";
      panelView.hidden = state !== "panel";
    }
    function setMsg(el, text, kind) {
      el.textContent = text || "";
      el.className = "admin__msg" + (kind ? " is-" + kind : "");
    }

    if (!SB) {
      show("login");
      loginBtn.disabled = true;
      setMsg(loginMsg, "Supabase no está disponible. Revisá tu conexión y recargá.", "err");
      return;
    }

    async function refresh() {
      show("loading");
      const { data: { session } } = await SB.auth.getSession();
      const user = session && session.user;
      if (user && user.id === SUPA.adminId) {
        $("[data-admin-who]", body).textContent = user.email || "Sesión activa";
        show("panel");
        initPanel(body);
      } else if (user) {
        await SB.auth.signOut();
        show("login");
        setMsg(loginMsg, "Esa cuenta no tiene permisos de administradora.", "err");
      } else {
        show("login");
      }
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $("[data-login-email]", body).value.trim();
      const password = $("[data-login-pass]", body).value;
      setMsg(loginMsg, "Entrando…");
      loginBtn.disabled = true;
      const { data, error } = await SB.auth.signInWithPassword({ email, password });
      loginBtn.disabled = false;
      if (error) { setMsg(loginMsg, traducirError(error.message), "err"); return; }
      if (!data.user || data.user.id !== SUPA.adminId) {
        await SB.auth.signOut();
        setMsg(loginMsg, "Esa cuenta no tiene permisos de administradora.", "err");
        return;
      }
      setMsg(loginMsg, "");
      refresh();
    });

    $("[data-admin-logout]", body).addEventListener("click", async () => {
      await SB.auth.signOut();
      setMsg(loginMsg, "");
      refresh();
    });

    refresh();
  }

  // Inicializa el panel CRUD (una sola vez por ventana).
  function initPanel(body) {
    if (body.dataset.panelReady === "1") return;
    body.dataset.panelReady = "1";

    const form = $("[data-admin-form]", body);
    const fId = $("[data-f-id]", body);
    const fTitle = $("[data-f-title]", body);
    const fDesc = $("[data-f-desc]", body);
    const fTags = $("[data-f-tags]", body);
    const fImages = $("[data-f-images]", body);
    const thumbs = $("[data-f-thumbs]", body);
    const itemsWrap = $("[data-admin-items]", body);
    const saveBtn = $("[data-admin-save]", body);
    const msg = $("[data-admin-msg]", body);
    // pending: { url } (imagen ya publicada) o { file, preview } (nueva por subir)
    let pending = [];

    function setMsg(text, kind) {
      msg.textContent = text || "";
      msg.className = "admin__msg" + (kind ? " is-" + kind : "");
    }

    function renderThumbs() {
      thumbs.innerHTML = "";
      pending.forEach((p, i) => {
        const src = p.url || p.preview;
        const t = document.createElement("span");
        t.className = "admin__thumb";
        t.style.backgroundImage = `url('${src}')`;
        t.innerHTML = `<button type="button" aria-label="Quitar">×</button>`;
        t.querySelector("button").addEventListener("click", () => { pending.splice(i, 1); renderThumbs(); });
        thumbs.appendChild(t);
      });
    }

    async function renderItems() {
      itemsWrap.innerHTML = '<p class="admin__empty">Cargando…</p>';
      const items = await fetchGallery();
      itemsWrap.innerHTML = "";
      if (!items.length) { itemsWrap.innerHTML = '<p class="admin__empty">Sin obras aún.</p>'; return; }
      items.forEach((it) => {
        const row = document.createElement("div");
        row.className = "admin__item";
        row.innerHTML = `
          <span class="admin__item-img" style="background-image:url('${(it.images || [])[0] || ""}')"></span>
          <span class="admin__item-txt"><strong>${it.title || "Sin título"}</strong><small>${(it.images || []).length} img</small></span>
          <span class="admin__item-acts">
            <button data-edit title="Editar">✏</button>
            <button data-del title="Eliminar">🗑</button>
          </span>`;
        row.querySelector("[data-edit]").addEventListener("click", () => loadIntoForm(it));
        row.querySelector("[data-del]").addEventListener("click", () => removeItem(it));
        itemsWrap.appendChild(row);
      });
    }

    function loadIntoForm(it) {
      fId.value = it.id;
      fTitle.value = it.title || "";
      fDesc.value = it.desc || "";
      fTags.value = (it.tags || []).join(", ");
      pending = (it.images || []).map((url) => ({ url }));
      renderThumbs();
      setMsg("Editando: " + (it.title || "obra"));
      fTitle.focus();
    }

    function resetForm() {
      form.reset(); fId.value = ""; pending = []; renderThumbs(); setMsg("");
    }

    async function removeItem(it) {
      if (!confirm(`¿Eliminar "${it.title}"?`)) return;
      const { error } = await SB.from(SUPA.table).delete().eq("id", it.id);
      if (error) { setMsg("No se pudo eliminar: " + error.message, "err"); return; }
      removeStorageImages(it.images);
      setMsg("Obra eliminada.", "ok");
      renderItems(); refreshGallery();
    }

    fImages.addEventListener("change", (e) => {
      [...e.target.files].forEach((file) => {
        const r = new FileReader();
        r.onload = () => { pending.push({ file, preview: r.result }); renderThumbs(); };
        r.readAsDataURL(file);
      });
      fImages.value = "";
    });

    async function uploadImage(file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `works/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await SB.storage.from(SUPA.bucket).upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      return SB.storage.from(SUPA.bucket).getPublicUrl(path).data.publicUrl;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = fTitle.value.trim();
      if (!title) { setMsg("Poné un título.", "err"); return; }
      saveBtn.disabled = true;
      setMsg("Guardando…");
      try {
        // Sube las imágenes nuevas respetando el orden elegido.
        const images = [];
        for (const p of pending) {
          images.push(p.url ? p.url : await uploadImage(p.file));
        }
        const payload = {
          title,
          description: fDesc.value.trim(),
          tags: fTags.value.split(",").map((t) => t.trim()).filter(Boolean),
          images,
        };
        let error;
        if (fId.value) {
          ({ error } = await SB.from(SUPA.table).update(payload).eq("id", fId.value));
        } else {
          payload.position = Date.now(); // se agrega al final
          ({ error } = await SB.from(SUPA.table).insert(payload));
        }
        if (error) throw error;
        setMsg("¡Guardado y publicado! 🚀", "ok");
        resetForm(); renderItems(); refreshGallery();
      } catch (err) {
        setMsg("No se pudo guardar: " + traducirError(err.message || String(err)), "err");
      } finally {
        saveBtn.disabled = false;
      }
    });

    $("[data-admin-reset]", body).addEventListener("click", resetForm);
    renderItems();
  }

  // Borra del bucket las imágenes cuyo URL apunta a nuestro storage.
  function removeStorageImages(images) {
    if (!SB || !images || !images.length) return;
    const marker = `/storage/v1/object/public/${SUPA.bucket}/`;
    const paths = images
      .filter((u) => typeof u === "string" && u.includes(marker))
      .map((u) => u.split(marker)[1])
      .filter(Boolean);
    if (paths.length) SB.storage.from(SUPA.bucket).remove(paths);
  }

  /* ---------- BUILDERS: NOTES ---------- */
  function buildNotes(body) {
    const notesBody = $("[data-note-body]", body);
    const today = new Date().toLocaleDateString("es-AR");
    const views = {
      perfil: () => `
        <div class="note-date">${today} · Perfil</div>
        <h3>Quién soy</h3>
        <p>Soy <b>${D.meta.name}</b>, ${D.meta.role.toLowerCase()}.</p>
        <p>Con más de <b>5 años</b> liderando equipos multidisciplinarios de diseño, desarrollo y
        producto, alineo la estrategia de negocio con la experiencia del usuario. Optimizo procesos
        con metodologías ágiles e integración de agentes de IA.</p>
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
      $$(".notes__item", body).forEach((i) => i.classList.toggle("is-active", i.dataset.note === note));
    }
    $$(".notes__item[data-note]", body).forEach((item) =>
      item.addEventListener("click", () => show(item.dataset.note)));
    show("perfil");
  }

  /* ---------- BUILDERS: CONTACT ---------- */
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

    // Promo (Ahorrandy) cerrar
    const promoClose = $(".promo__close");
    if (promoClose) promoClose.addEventListener("click", () => $("#promo").classList.add("is-gone"));

    // Lightbox
    $("[data-lb-close]").addEventListener("click", closeLightbox);
    $("[data-lb-prev]").addEventListener("click", () => lbNav(-1));
    $("[data-lb-next]").addEventListener("click", () => lbNav(1));
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });

    document.addEventListener("keydown", (e) => {
      if (!$("#lightbox").hidden) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") lbNav(-1);
        if (e.key === "ArrowRight") lbNav(1);
        return;
      }
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
