# AMAREA OS v0.1

Sistema operativo web para productoras de eventos, culturales y experiencias.

## Stack

- **Frontend:** HTML5 + Preact + HTM
- **Estilos:** Tailwind CSS (CDN) + CSS personalizado
- **Estado:** LocalStorage del navegador
- **Deploy:** Netlify (gratuito)

## Estructura

- `index.html` — punto de entrada
- `app.js` — orquestación y rutas
- `components.js` — componentes reutilizables
- `pages.js` — vistas principales
- `modals.js` — modales de edición
- `data.js` — almacenamiento, seed y helpers
- `logic.js` — lógica de negocio
- `styles.css` — estilos, glitter, dark mode
- `los_cabos_marketing.js` — página estática de Campaña Los Cabos

## Despliegue en Netlify (gratis)

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Elige **GitHub** y selecciona el repositorio `amarea-os`.
3. Netlify detecta `netlify.toml` automáticamente:
   - **Build command:** vacío
   - **Publish directory:** `.`
4. Haz clic en **Deploy site**.
5. Netlify te dará una URL tipo `https://amarea-os.netlify.app` (puedes cambiar el nombre en **Site settings** → **Change site name**).

Cada `git push` a `main` redespliega el sitio automáticamente.

## Notas

- Es una aplicación 100 % cliente. No necesita backend.
- Los datos se guardan en `localStorage` del navegador.
- Para resetear los datos de demo, limpia el almacenamiento local o usa el botón de reset en Configuración.
