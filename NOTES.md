# 📝 NOTES — Estado del proyecto AndreaOS

> Contexto portátil del proyecto para retomar desde cualquier computadora.
> Última actualización: **2026-08-06** (v3 — galería en Supabase).

## ¿Qué es?
Portfolio interactivo **AndreaOS** con estética de escritorio/sistema operativo:
ventanas arrastrables, dock, apps, fondo aurora, glassmorphism.
HTML + CSS + JS vanilla, sin build. La galería usa **Supabase** (base + login).

- **Repo:** github.com/andreamperezp/portfolio-create
- **Contenido editable:** perfil/experiencia/skills en [`js/data.js`](js/data.js)
- **Galería (trabajos):** ahora vive en **Supabase** (tabla `portfolio_gallery` + bucket `portfolio`).
  `js/gallery.js` quedó solo como **respaldo** si no hay conexión.
- **Config Supabase:** [`js/supabase-config.js`](js/supabase-config.js) (URL + clave pública, son datos públicos por diseño).
- **Lógica:** `js/main.js` · **Estilos:** `css/style.css`

## Apps del escritorio
- **Acerca de**, **Experiencia**, **Skills**, **Galería**, **Notas**, **Contacto** (dock).
- **Ahorrandy** → ícono con el **logo real** (chanchito) en el escritorio, el widget promo y el **dock**.
  Abre la app en pestaña nueva → https://v0-ahorrandy-app.vercel.app/nuevo
- Ventanas: 🔴 cerrar · 🟡 minimizar (se recupera clickeando la app en el dock) · 🟢 maximizar (o doble clic en la barra).
- En **celular** las ventanas abren a pantalla completa y el dock se desliza.

## 🖼️ Galería + Backoffice (cómo cargar trabajos)
1. Abrí **Galería** → botón **⚙** (arriba a la derecha).
2. **Login real**: entrá con tu cuenta **andreamperezp31@gmail.com** (la misma de Ahorrandy, mismo Supabase).
   Solo ESA cuenta puede escribir; el resto solo puede mirar.
3. Cargá **título, descripción, tags e imágenes** (varias por obra) y **Guardar**.
   Las imágenes se suben al bucket `portfolio` y la obra se guarda en la tabla.
4. **Se publica al instante** para todos — no hay que exportar ni subir nada a GitHub. 🚀
5. Para editar/borrar: usá los botones ✏/🗑 de la lista "Obras publicadas".

### Detalles técnicos de Supabase (proyecto `ahorrandy`)
- Proyecto compartido con la app Ahorrandy, pero **aislado**: tabla y bucket propios.
- **RLS**: lectura pública; escritura restringida al uid admin (`e65df7a9-…`).
- La clave del frontend es la *publishable key* (pública a propósito; la seguridad la da RLS).

## ✅ Hecho
- Portfolio funcionando y verificado; título Product Designer; README interactivo.
- v2: mobile, Galería + backoffice, maximizar/minimizar, Skills animada, widget Ahorrandy.
- v3: **galería en Supabase** con **login real** (solo admin escribe), imágenes en Storage,
  logo real de Ahorrandy en escritorio/dock/promo, limpieza de archivos duplicados en la raíz.

## ⏳ Próximos pasos / ideas
- Reemplazar las imágenes de ejemplo de la galería por trabajos reales (desde el backoffice).
- (Opcional) Reordenar obras con drag & drop (hoy el orden es por `position`).
- Sumar Behance/Instagram si querés.

## Cómo correrlo localmente
Abrí `index.html` en el navegador, o serví la carpeta con `npx serve .`
