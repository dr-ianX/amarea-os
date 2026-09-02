import { html } from 'htm/preact';
import { SectionHeader } from './components.js';

const body = `
<blockquote class="border-l-4 border-pink-500 pl-4 italic text-pink-500 font-bold mb-4">
  Para MIKE — Hecho con purpurina, rosa y amor desde AMAREA OS v0.1.
</blockquote>
<p class="mb-4">Esta guía es un plan práctico para atacar el mercado de Los Cabos (Cabo San Lucas + San José del Cabo) durante lo que resta del año.</p>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Diagnóstico rápido del destino</h2>
<p class="mb-2">Los Cabos es un hub de bodas de destino, retiros corporativos, eventos de incentivo y experiencias de lujo. La temporada alta corre de <strong>noviembre a mayo</strong>, con picos de demanda por Thanksgiving, diciembre, San Valentín y primavera. El cierre de año es la ventana ideal para una <strong>precampaña de captación</strong> que posicione a AMAREA para Q1.</p>
<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">Momentos clave restantes del año</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
  <li><strong>Septiembre:</strong> Independencia de México (15–16 sep), cierre de verano, bajas tarifas de hotel.</li>
  <li><strong>Octubre:</strong> Precalentamiento de temporada alta, pesca, Festival de Cine de Los Cabos, Día de Muertos.</li>
  <li><strong>Noviembre:</strong> Temporada alta inicia, Día de Muertos, Bisbee’s, inicio de avistamiento de ballenas, Acción de Gracias.</li>
  <li><strong>Diciembre:</strong> Bodas de fin de año, cenas corporativas, Navidad, Nochevieja.</li>
</ul>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Venues estratégicos a contactar</h2>
<div class="overflow-x-auto mb-4">
<table class="w-full text-sm text-left">
<thead><tr class="bg-slate-100 dark:bg-slate-800"><th class="p-2">Venue</th><th class="p-2">Tipo</th><th class="p-2">Capacidad / Destaque</th><th class="p-2">Oportunidad</th></tr></thead>
<tbody>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Hacienda del Mar Los Cabos</td><td class="p-2">Resort / Convenciones</td><td class="p-2">Gran ballroom, 360 pax, playa</td><td class="p-2">Bodas, corporativos, conferencias</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Hilton Los Cabos</td><td class="p-2">Resort / MICE</td><td class="p-2">11,000+ sq ft, playa, 13 venues</td><td class="p-2">Incentivos, convenciones, cenas</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Nobu Hotel Los Cabos</td><td class="p-2">Lifestyle / Lujo</td><td class="p-2">Tsuki Ballroom, terrazas, jardín</td><td class="p-2">Bodas íntimas, experiencias VIP</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Zadún, a Ritz-Carlton Reserve</td><td class="p-2">Ultra-lujo</td><td class="p-2">2 ballrooms, playa, jardines</td><td class="p-2">Eventos de alto nivel, retiros</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Sunset Monalisa</td><td class="p-2">Restaurante / Vista</td><td class="p-2">Vistas al Arco, bodas, corporativos</td><td class="p-2">Cenas, propuestas, after parties</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Waldorf Astoria Los Cabos Pedregal</td><td class="p-2">Ultra-lujo</td><td class="p-2">Terrazas, playa privada</td><td class="p-2">Bodas de élite, eventos privados</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Hotel El Ganzo</td><td class="p-2">Boutique / Artístico</td><td class="p-2">Cultural, film, art events</td><td class="p-2">Eventos creativos, lanzamientos</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Acre, Flora Farms, Los Tamarindos</td><td class="p-2">Experiencias / Granja</td><td class="p-2">Fincas, gastronomía</td><td class="p-2">Bodas boho, experiencias de marca</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Cabo Sports Complex</td><td class="p-2">Deportivo / Eventos</td><td class="p-2">Torneos, conciertos</td><td class="p-2">Activaciones masivas</td></tr>
</tbody>
</table>
</div>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">3. Prospectos y contactos por segmento</h2>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">A. Wedding planners (aliados / intermediarios)</h3>
<ul class="list-disc pl-5 space-y-1 mb-2">
  <li>Cabo Wedding Services</li>
  <li>Momentos Weddings & Events</li>
  <li>Näbia Wedding Planner</li>
  <li>Cabo Weddings & Events</li>
  <li>Del Cabo Weddings (Del Cabo Events)</li>
</ul>
<p class="mb-4"><strong>Pitch:</strong> productora de eventos + OS para coordinación, budget, checklists y pagos.</p>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">B. DMCs / agencias de eventos locales</h3>
<ul class="list-disc pl-5 space-y-1 mb-2">
  <li><strong>Del Cabo Events</strong> — líder en diseño corporativo.</li>
  <li><strong>The Main Event</strong> — rentals + producción.</li>
  <li><strong>SESCABO</strong> — design + AV + entretenimiento.</li>
  <li><strong>VVR Pro</strong> — production house con 30 años de experiencia.</li>
  <li><strong>Del Mar Events</strong> — rentals, florals, iluminación.</li>
</ul>
<p class="mb-4"><strong>Pitch:</strong> ofrecer AMAREA como capa digital para gestión de múltiples campañas, contactos y presupuestos.</p>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">C. Hoteles y venues</h3>
<p class="mb-4">Directores de eventos, catering sales managers y wedding specialists de los resorts listados arriba.</p>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">D. Marcas y empresas internacionales</h3>
<p class="mb-4">Empresas de tecnología, pharma, automotriz y bebidas que ya programan incentivos en Los Cabos (ej. históricos clientes de VVR y Del Cabo: Toyota, Herbalife, Citi, etc.).</p>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">E. Organizadores de eventos deportivos/culturales</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
  <li><strong>Bisbee’s Black & Blue</strong> — pesca</li>
  <li><strong>PGA Tour / World Wide Technology Championship</strong> — golf</li>
  <li><strong>Los Cabos Jazz Festival</strong> — música</li>
  <li><strong>Los Cabos Open of Surf</strong> — surf</li>
  <li><strong>Los Cabos Film Festival</strong> — cine</li>
</ul>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">4. Competencia observada</h2>
<div class="overflow-x-auto mb-4">
<table class="w-full text-sm text-left">
<thead><tr class="bg-slate-100 dark:bg-slate-800"><th class="p-2">Competidor</th><th class="p-2">Fortaleza</th><th class="p-2">Oportunidad de diferenciación</th></tr></thead>
<tbody>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Del Cabo Events</td><td class="p-2">Diseño corporativo, experiencia</td><td class="p-2">Integración digital con planificación + budgeting en tiempo real</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">The Main Event</td><td class="p-2">Rentals y logística</td><td class="p-2">Productora + OS para trazabilidad de inventario</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">SESCABO</td><td class="p-2">AV, entretenimiento, diseño</td><td class="p-2">Plataforma unificada: producción + comercial + post-evento</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">VVR Pro</td><td class="p-2">Producción de gran escala</td><td class="p-2">Herramienta de gestión para múltiples proveedores</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Momentos / Näbia / Cabo Wedding Services</td><td class="p-2">Bodas boutique</td><td class="p-2">AMAREA como productora aliada con sistema de gestión</td></tr>
</tbody>
</table>
</div>
<p class="mb-4"><strong>Posicionamiento:</strong> no competimos contra las productoras; somos el <strong>sistema operativo que las hace más eficientes, visuales y rentables</strong>.</p>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">5. Estrategias a implementar</h2>
<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">5.1 Precampaña: “Los Cabos Brilla”</h3>
<p class="mb-2">Idea central: posicionar a AMAREA como la productora / plataforma que <strong>hace brillar los eventos en Los Cabos</strong> (juego de palabras con glitter/purpurina — MIKE aprueba).</p>
<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">5.2 Líneas de estrategia</h3>
<ol class="list-decimal pl-5 space-y-2 mb-4">
  <li><strong>Contenido de destino + case studies demo</strong>
    <ul class="list-disc pl-5 mt-1">
      <li>Crear campañas demo en el módulo Marketing de AMAREA para 4 verticales: bodas, corporativos, culturales, deportivos.</li>
      <li>Publicar reels / carruseles con “5 venues de Los Cabos que debes conocer” y “Cómo producir un evento sin perder dinero”.</li>
    </ul>
  </li>
  <li><strong>Alianzas con wedding planners</strong>
    <ul class="list-disc pl-5 mt-1">
      <li>Ofrecer comisión o co-branding para bodas que gestionen con AMAREA.</li>
      <li>Crear checklist digital de bodas de destino en la plataforma.</li>
    </ul>
  </li>
  <li><strong>Roadshow / open house virtual</strong>
    <ul class="list-disc pl-5 mt-1">
      <li>Webinar “Producción de eventos en Los Cabos 2025” con venues + planner invitado.</li>
      <li>Demo en vivo del OS para DMCs.</li>
    </ul>
  </li>
  <li><strong>Lead magnet: guía 2025</strong>
    <ul class="list-disc pl-5 mt-1">
      <li>Descargable: <em>“Calendario estratégico de eventos en Los Cabos 2025”</em>.</li>
      <li>Captura de correos de planners y DMCs.</li>
    </ul>
  </li>
  <li><strong>Paquetes comerciales por temporada</strong>
    <ul class="list-disc pl-5 mt-1">
      <li><strong>Pack Otoño (oct–nov):</strong> bodas íntimas y cenas corporativas.</li>
      <li><strong>Pack Invierno (dic–ene):</strong> fin de año + propuestas San Valentín.</li>
      <li><strong>Pack Primavera (feb–may):</strong> bodas + Spring Break + torneos.</li>
    </ul>
  </li>
  <li><strong>Competencia observada convertida en aliada</strong>
    <ul class="list-disc pl-5 mt-1">
      <li>Contactar a VVR, SESCABO, The Main Event para ofrecer AMAREA como capa de gestión.</li>
      <li>No competir por producción física; vender eficiencia.</li>
    </ul>
  </li>
</ol>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">6. Precampaña Q4 — cronograma sugerido</h2>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">Septiembre: Preparación + Contenido</h3>
<ul class="list-disc pl-5 space-y-1 mb-2">
  <li>Definir 5 prospectos top y 3 alianzas clave.</li>
  <li>Crear campaña demo en AMAREA: <em>“Los Cabos Brilla 2024/25”</em>.</li>
  <li>Grabar 2 reels / carruseles de venues.</li>
  <li>Lanzar landing / descargable calendario 2025.</li>
</ul>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">Octubre: Activación comercial</h3>
<ul class="list-disc pl-5 space-y-1 mb-2">
  <li>Enviar 15 propuestas personalizadas a venues y planners.</li>
  <li>Webinar “Producción sin caos en Los Cabos”.</li>
  <li>Push de email a contactos en base de datos.</li>
</ul>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">Noviembre: Cierre + Onsite</h3>
<ul class="list-disc pl-5 space-y-1 mb-2">
  <li>Visitas a 4 venues clave con demo en tableta.</li>
  <li>Oferta early-bird para eventos de diciembre y enero.</li>
  <li>Case study del primer evento piloto si se concreta.</li>
</ul>

<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">Diciembre: Cierre de año</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
  <li>Campaña de cenas de fin de año y Nochevieja.</li>
  <li>Recopilar testimonios y preparar push de San Valentín.</li>
  <li>Planear content calendar para Q1 2025.</li>
</ul>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">7. Tácticas específicas por módulo de AMAREA</h2>
<div class="overflow-x-auto mb-4">
<table class="w-full text-sm text-left">
<thead><tr class="bg-slate-100 dark:bg-slate-800"><th class="p-2">Módulo</th><th class="p-2">Uso para Los Cabos</th></tr></thead>
<tbody>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Pipeline</td><td class="p-2">Funnel de prospects por segmento (bodas, corporativo, cultural, deportivo).</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Contacts</td><td class="p-2">Directorio de venues, planners, DMCs, hoteles y proveedores clave.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Calendar</td><td class="p-2">Temporada alta, fechas de torneos, ferias y eventos municipales.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Finances</td><td class="p-2">Presupuestos por evento, costos de traslado/permisos, moneda USD/MXN.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Documents</td><td class="p-2">Contratos, permits, riders, propuestas de venues.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Marketing</td><td class="p-2">Campañas de “Los Cabos Brilla”, mailing y contenido.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Multimedia</td><td class="p-2">Galería de venues, renders y videos de eventos.</td></tr>
<tr class="border-b border-slate-200 dark:border-slate-700"><td class="p-2 font-semibold">Chat</td><td class="p-2">Coordinación interna del equipo en producciones.</td></tr>
</tbody>
</table>
</div>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">8. Métricas de éxito</h2>
<ul class="list-disc pl-5 space-y-1 mb-4">
  <li><strong>30 leads calificados</strong> (planners, venues, DMCs) antes de diciembre.</li>
  <li><strong>5 reuniones</strong> con venues top o planners clave.</li>
  <li><strong>2 alianzas</strong> firmadas o en prueba antes de fin de año.</li>
  <li><strong>1 evento piloto</strong> producido con AMAREA en Q4.</li>
  <li><strong>500 descargas/vistas</strong> del calendario 2025.</li>
</ul>

<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">9. Mensaje clave</h2>
<blockquote class="border-l-4 border-pink-500 pl-4 italic mb-4">
  <strong>AMAREA no es una más. Es el sistema operativo para productoras, venues y planners que quieren que Los Cabos brille en cada evento.</strong>
</blockquote>
<p class="font-bold text-pink-500">Nota para MIKE: esto es tuyo. Cuando lo abras, todo brilla, todo es rosa y todo es felicidad. 💖✨🌈</p>
`;

export const LosCabosMarketing = () => html`
  <div class="animate-fade-in">
    <${SectionHeader} title="Campaña Los Cabos 2024/25" />
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed hover-gay" dangerouslySetInnerHTML=${{ __html: body }} />
  </div>
`;
