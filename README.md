# AMAREA OS v0.1

Sistema operativo web para productoras de eventos, culturales y experiencias.

## Stack

- **Frontend:** HTML5 + Preact + HTM
- **Estilos:** Tailwind CSS (CDN) + CSS personalizado
- **Estado:** LocalStorage del navegador
- **Deploy:** Render Static Site (gratuito)

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

## Despliegue en Render (gratis)

1. Crea un repositorio en GitHub y sube estos archivos.
2. Entra a [render.com](https://render.com) → **New** → **Static Site**.
3. Conecta tu repositorio de GitHub.
4. Configuración:
   - **Name:** `amarea-os` (o el que quieras)
   - **Branch:** `main`
   - **Build Command:** dejar vacío
   - **Publish directory:** `.`
5. Haz clic en **Create Static Site**.
6. Render te dará una URL tipo `https://amarea-os.onrender.com`.

Si usas `render.yaml`, Render detectará la configuración automáticamente al conectar el repo.

## Notas

- Es una aplicación 100 % cliente. No necesita backend.
- Los datos se guardan en `localStorage` del navegador.
- Para resetear los datos de demo, limpia el almacenamiento local o usa el botón de reset en Configuración.
