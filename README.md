# Portfolio · Andrea Pérez

Product Design Lead · CRMs & SaaS

Portfolio interactivo de una sola página con escenas 3D en three.js, versión ES/EN y recorrido guiado.
Es un sitio estático: no necesita build.

## Estructura

```
index.html            Markup, estilos y lógica del sitio (textos ES/EN en el objeto COPY)
favicon.svg
assets/img/           Foto de perfil
assets/fonts/         Manrope, JetBrains Mono, Nunito y Outfit (woff2, self-hosted)
vendor/three.min.js   three.js
vendor/dc-runtime.js  Runtime de componentes (<x-dc>, sc-for, sc-if, {{ }})
vendor/react*.js      React 18.3.1 (lo usa el runtime)
```

Para editar textos, buscá `const COPY` en `index.html`.

## CV

`cv/cv-es.html` y `cv/cv-en.html` son la fuente del CV (estilos en `cv/cv.css`). Formato pensado para ATS:
una sola columna, texto seleccionable, encabezados estándar y palabras clave integradas en la experiencia.
Después de editarlos, regenerá los PDF que descarga el botón "Descargar CV":

```bash
node cv/build.mjs
```

## Desarrollo local

```bash
npx http-server . -p 5174 -c-1
```

## Publicar en Vercel
1. En vercel.com → **Add New → Project** → importar `andreamperezp/portfolio`.
2. Framework preset: **Other**. Build command: vacío. Output directory: `./`.
3. Deploy.

Las demos de Filo y Ahorrandy se cargan desde sus sitios en producción (requieren conexión).
