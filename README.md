<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b7bff,50:6f7bff,100:4fd6c9&height=220&section=header&text=AndreaOS&fontColor=ffffff&fontSize=70&fontAlignY=38&desc=Portfolio%20interactivo%20%C2%B7%20Product%20Designer&descAlignY=60&descSize=18" width="100%" alt="AndreaOS"/>

<a href="https://readme-typing-svg.demolab.com">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=24&pause=1000&color=8B7BFF&center=true&vCenter=true&width=650&height=44&lines=No+hago+cosas+incre%C3%ADbles.+Solo+optimizo+procesos.;Un+portfolio+que+se+usa+como+un+sistema+operativo.;Todo+tu+perfil+a+un+clic." alt="Typing SVG"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/Sin_dependencias-4fd6c9?style=for-the-badge" alt="Zero deps"/>
<img src="https://img.shields.io/badge/Sin_build-8b7bff?style=for-the-badge" alt="No build"/>

<br/><br/>

<a href="https://andreamperezp.github.io/portfolio-create/">
  <img src="https://img.shields.io/badge/🚀_Ver_demo_en_vivo-8B7BFF?style=for-the-badge" alt="Demo"/>
</a>
<a href="https://linkedin.com/in/andreamariange">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
</a>
<a href="assets/CV_Andrea_Perez.pdf">
  <img src="https://img.shields.io/badge/📄_Descargar_CV-E03C3C?style=for-the-badge" alt="CV"/>
</a>

</div>

<br/>

---

## 🖥️ ¿Qué es esto?

**AndreaOS** no es un portfolio que se *lee* — es uno que se **usa**. En vez de una página que
scrolleás, entrás a un **escritorio interactivo** inspirado en un sistema operativo: abrís
ventanas, las arrastrás, explorás una app de **Notas** con lo mejor de mi perfil y accedés a todo
—LinkedIn, GitHub, web, CV— desde un **dock**. Todo con un fondo *aurora* animado y estética
*glassmorphism / frost*.

> 🪶 **Sin librerías, sin frameworks, sin build, sin 3D.** Solo HTML + CSS + JavaScript vanilla.

<br/>

## ✨ Características

<table>
<tr>
<td width="50%" valign="top">

**🎬 Experiencia**
- Pantalla de **boot** animada → escritorio
- Fondo **aurora** con blobs en movimiento
- **Menu bar** con reloj en vivo y estado *"Disponible"*
- Efecto **glass / frost** en todo el sistema

</td>
<td width="50%" valign="top">

**🪟 Interacción real**
- Ventanas que **abren, arrastran, enfocan y cierran**
- Botones tipo **semáforo** (rojo/amarillo/verde)
- **Dock** con magnificación e indicador de app activa
- App de **Notas**: Perfil / Logros / Competencias

</td>
</tr>
</table>

<br/>

## 🏗️ Cómo funciona por dentro

El corazón es un **gestor de ventanas** liviano: cada app es un template HTML que se clona,
se vuelve una ventana arrastrable con su propio `z-index`, y se llena con contenido generado
desde un único archivo de datos.

```mermaid
flowchart LR
    A([Boot screen]) --> B[Escritorio + Aurora]
    B --> C{Clic en Dock<br/>o Menu bar}
    C -->|openWindow| D[Clona template]
    D --> E[Ventana arrastrable<br/>z-index + foco]
    E --> F[[data.js<br/>tu contenido]]
    F --> G[Acerca de]
    F --> H[Experiencia]
    F --> I[Notas]
    F --> J[Contacto]
    style A fill:#8b7bff,stroke:#fff,color:#fff
    style F fill:#4fd6c9,stroke:#fff,color:#0b0d1a
    style B fill:#181a2d,stroke:#8b7bff,color:#fff
```

<br/>

## 🗂️ Estructura del proyecto

<details>
<summary><b>📁 Click para ver el árbol de archivos</b></summary>

```
portfolio-create/
├── index.html          # Estructura + templates de cada ventana
├── css/
│   └── style.css       # Aurora, glass, dock, ventanas, animaciones
├── js/
│   ├── data.js         # ⬅️ TODO tu contenido vive acá (editá esto)
│   └── main.js         # Window manager · dock · boot · reloj
└── assets/
    ├── favicon.svg
    └── CV_Andrea_Perez.pdf
```

</details>

<br/>

## ✏️ Personalizarlo

<details>
<summary><b>💡 Click: cómo cambiar el contenido sin tocar código</b></summary>

<br/>

Todo el texto —perfil, experiencia, skills, logros, contacto y links— vive en un solo lugar:
[`js/data.js`](js/data.js). No hace falta tocar el HTML.

```js
window.ANDREA = {
  meta: {
    name: "Andrea Pérez",
    role: "Directora de Producto y Tecnología",
    tagline: "No hago cosas increíbles. Solo optimizo procesos.",
    // ...email, linkedin, web, cv
  },
  experience: [ /* tus trabajos */ ],
  skills:     [ /* tus competencias */ ],
  highlights: [ /* tus logros */ ],
};
```

Cambiás los valores, guardás, recargás. Listo. 🪄

</details>

<br/>

## ▶️ Correrlo localmente

<details>
<summary><b>🖥️ Click para ver cómo</b></summary>

<br/>

Abrí `index.html` directamente en el navegador, o serví la carpeta:

```bash
npx serve .
```

</details>

<br/>

## 🚀 Deploy

Es un sitio **100% estático**, se publica solo:

| Plataforma | Cómo |
|------------|------|
| **GitHub Pages** | Settings → Pages → Branch `main` / `root` → Save |
| **Vercel** | Import repo → deploy (sin configuración) |
| **Netlify** | Arrastrá la carpeta a netlify.com/drop |

Activo en GitHub Pages queda en: **`https://andreamperezp.github.io/portfolio-create/`**

<br/>

---

<div align="center">

### 💜 Hecho con dedicación

*"No hago cosas increíbles. Solo optimizo procesos."*

<a href="https://linkedin.com/in/andreamariange">LinkedIn</a> ·
<a href="https://github.com/andreamperezp">GitHub</a> ·
<a href="assets/CV_Andrea_Perez.pdf">CV</a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4fd6c9,100:8b7bff&height=100&section=footer" width="100%" alt=""/>

</div>
