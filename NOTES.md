# 📝 NOTES — Estado del proyecto AndreaOS

> Contexto portátil del proyecto para retomar desde cualquier computadora.
> Última actualización: **2026-08-04** (v2).

## ¿Qué es?
Portfolio interactivo **AndreaOS** con estética de escritorio/sistema operativo:
ventanas arrastrables, dock, apps, fondo aurora, glassmorphism.
HTML + CSS + JS vanilla, sin build ni dependencias.

- **Repo:** github.com/andreamperezp/portfolio-create
- **Contenido editable:** perfil/experiencia/skills en [`js/data.js`](js/data.js)
- **Galería (trabajos):** [`js/gallery.js`](js/gallery.js) (se genera desde el backoffice)
- **Lógica:** `js/main.js` · **Estilos:** `css/style.css`

## Apps del escritorio
- **Acerca de**, **Experiencia**, **Skills**, **Galería**, **Notas**, **Contacto** (dock).
- **Ahorrandy** (ícono + widget en el escritorio) → https://v0-ahorrandy-app.vercel.app/nuevo
- Ventanas: 🔴 cerrar · 🟡 minimizar (se recupera clickeando la app en el dock) · 🟢 maximizar (o doble clic en la barra).
- En **celular** las ventanas abren a pantalla completa y el dock se desliza.

## 🖼️ Galería + Backoffice (cómo cargar trabajos)
1. Abrí **Galería** → botón **⚙** (arriba a la derecha).
2. Clave de acceso: **`andrea`** (se puede cambiar en `js/main.js`, const `ADMIN_PASS`).
3. Cargá **título, descripción, tags e imágenes** (varias por obra). Se guarda en tu navegador.
4. Botón **⬇ Exportar gallery.js** → descarga el archivo.
5. Subí ese `gallery.js` a la carpeta `js/` en GitHub → se publica para todos.
   *(Las imágenes se guardan como datos dentro del archivo; mantenelas livianas. Para carga
   automática sin re-subir, se puede migrar a Supabase más adelante.)*

## ✅ Hecho
- Portfolio funcionando y verificado; título Product Designer; README interactivo.
- v2: mobile, Galería + backoffice, maximizar/minimizar, Skills animada, widget Ahorrandy.

## ⏳ Próximos pasos / ideas
- (Opcional) Migrar la galería a Supabase para carga 100% automática y multi-dispositivo.
- Reemplazar las imágenes de ejemplo de la galería por trabajos reales.
- Sumar Behance/Instagram si querés.

## Cómo correrlo localmente
Abrí `index.html` en el navegador, o serví la carpeta con `npx serve .`
