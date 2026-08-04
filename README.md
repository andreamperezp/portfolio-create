# AndreaOS — Portfolio interactivo

Portfolio de **Andrea Pérez** (Directora de Producto y Tecnología) construido como un
**escritorio / sistema operativo** interactivo. Todo a un clic: ventanas arrastrables estilo
macOS, dock con accesos directos (LinkedIn, GitHub, web, CV), una app de **Notas** con lo más
interesante del perfil, y un fondo *aurora* animado con estética *glassmorphism / frost*.

> Sin librerías, sin build, sin 3D. HTML + CSS + JS vanilla.

## ✨ Características

- **Boot screen** animado → escritorio con wallpaper aurora.
- **Menu bar** con reloj en vivo y estado "Disponible".
- **Ventanas** (Acerca de, Experiencia, Notas, Contacto) que se abren, arrastran, enfocan,
  minimizan y cierran — con botones tipo semáforo.
- **Dock** con magnificación al hover, tooltips e indicador de app abierta.
- **App de Notas** con Perfil / Logros / Competencias y descarga de CV.
- Responsive y respeta `prefers-reduced-motion`.

## 🗂 Estructura

```
portfolio-create/
├── index.html          # Estructura + templates de ventanas
├── css/style.css       # Aurora, glass, dock, ventanas
├── js/
│   ├── data.js         # ⬅️ TODO tu contenido (editá acá)
│   └── main.js         # Window manager, dock, boot, reloj
└── assets/
    ├── favicon.svg
    └── CV_Andrea_Perez.pdf
```

## ✏️ Cómo editar el contenido

Todo el texto vive en [`js/data.js`](js/data.js): perfil, experiencia, skills, logros,
contacto y links. Cambiá ahí y recargá — no hace falta tocar el HTML.

## ▶️ Cómo verlo

Abrí `index.html` en el navegador, o serví la carpeta:

```bash
npx serve .
```

## 🚀 Deploy

Es un sitio estático: funciona directo en **GitHub Pages**, **Vercel** o **Netlify**
apuntando a la raíz del repo.

---
Hecho con 💜 — *"No hago cosas increíbles. Solo optimizo procesos."*
