// DATA layer: storage, seeding and domain constants

const STORAGE_KEY = 'amarea_os_v0_1';

export const PROJECT_STATUSES = [
  'IDEA',
  'PREPRODUCCIÓN',
  'CONFIRMADO',
  'EN PRODUCCIÓN',
  'EVENTO',
  'CIERRE',
  'FINALIZADO'
];

export const PIPELINE_STAGES = [
  'PROSPECTO',
  'CONTACTADO',
  'REUNIÓN',
  'PROPUESTA',
  'NEGOCIACIÓN',
  'GANADO',
  'PERDIDO'
];

export const CONTACT_CATEGORIES = [
  'Clientes',
  'Venues',
  'Artistas',
  'Técnicos',
  'Proveedores',
  'Sponsors',
  'Medios',
  'Colaboradores',
  'Staff'
];

export const DOC_TYPES = [
  'Contrato',
  'Cotización',
  'Presupuesto',
  'Rider',
  'Permiso',
  'Factura',
  'Presentación',
  'Material de marketing',
  'Otro'
];

export const INCOME_TYPES = ['Tickets', 'Patrocinios', 'Clientes', 'Otros'];
export const COST_TYPES = [
  'Artistas', 'Venue', 'Producción', 'Técnica', 'Staff',
  'Marketing', 'Transporte', 'Hospitality', 'Permisos', 'Otros'
];

export const CHECKLIST_BASE = [
  'Confirmar fecha y venue',
  'Firmar contrato con venue',
  'Recibir riders y ficha técnica',
  'Definir plan de seguridad',
  'Gestionar permisos y licencias',
  'Lanzar campaña de marketing',
  'Configurar ticketing',
  'Contratar staff',
  'Organizar transporte y hospitality',
  'Hacer prueba de sonido / pase',
  'Checklist final 24h antes',
  'Cierre financiero y postmortem'
];

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildChecklist(project) {
  return CHECKLIST_BASE.map((text, i) => ({
    id: `${project.id}-c${i}`,
    text,
    done: project.status === 'FINALIZADO',
    notes: ''
  }));
}

export function newProject(id = makeId(), overrides = {}) {
  const now = today();
  const base = {
    id,
    name: '',
    concept: '',
    status: 'IDEA',
    date: daysFromNow(60),
    venue: '',
    capacity: '',
    responsible: '',
    client: '',
    clientId: '',
    venueId: '',
    projectedIncome: 0,
    realIncome: 0,
    projectedCost: 0,
    realCost: 0,
    artists: [],
    production: '',
    technical: '',
    marketing: '',
    staff: [],
    permits: '',
    ticketing: '',
    hospitality: '',
    suppliers: [],
    documents: [],
    timeline: [],
    notes: '',
    postmortem: '',
    income: [],
    costs: [],
    checklist: [],
    createdAt: now,
    updatedAt: now
  };
  const p = { ...base, ...overrides };
  if (!p.checklist || p.checklist.length === 0) p.checklist = buildChecklist(p);
  return p;
}

export function newContact(overrides = {}) {
  return {
    id: makeId(),
    name: '',
    category: 'Clientes',
    email: '',
    phone: '',
    company: '',
    role: '',
    notes: '',
    projects: [],
    opportunities: [],
    ...overrides
  };
}

export function newOpportunity(overrides = {}) {
  return {
    id: makeId(),
    company: '',
    contact: '',
    contactId: '',
    type: '',
    value: 0,
    estimatedDate: daysFromNow(90),
    nextAction: '',
    nextActionDate: daysFromNow(3),
    stage: 'PROSPECTO',
    responsible: '',
    notes: '',
    history: [],
    createdAt: today(),
    ...overrides
  };
}

export function newDocument(overrides = {}) {
  return {
    id: makeId(),
    projectId: '',
    name: '',
    type: 'Otro',
    url: '',
    notes: '',
    createdAt: today(),
    ...overrides
  };
}

export function newMarketingCampaign(overrides = {}) {
  return {
    id: makeId(),
    projectId: '',
    name: '',
    objective: '',
    audience: '',
    launchDate: daysFromNow(30),
    channels: '',
    pieces: '',
    status: 'Borrador',
    copy: '',
    cta: '',
    assets: '',
    results: '',
    ...overrides
  };
}

export function newUpload(overrides = {}) {
  return {
    id: makeId(),
    name: '',
    type: 'other',
    mime: '',
    size: 0,
    url: '',
    uploadedBy: '',
    date: new Date().toISOString(),
    ...overrides
  };
}

export function newMessage(overrides = {}) {
  return {
    id: makeId(),
    text: '',
    author: '',
    authorId: '',
    date: new Date().toISOString(),
    ...overrides
  };
}

export function newUser(overrides = {}) {
  return {
    id: makeId(),
    name: '',
    role: '',
    avatar: '',
    ...overrides
  };
}

function seedLosCabos() {
  const cHacienda = newContact({ id: 'lc_hacienda', name: 'Hacienda del Mar Los Cabos', category: 'Venues', email: 'eventos@haciendadelmarloscabos.com', phone: '', company: 'Marriott Autograph', notes: 'Ballroom 360 pax, playa. Datos de contacto por confirmar.' });
  const cHilton = newContact({ id: 'lc_hilton', name: 'Hilton Los Cabos', category: 'Venues', email: 'SJDLC-Sales@hilton.com', phone: '', company: 'Hilton', notes: '13 venues, 11,000+ sq ft, playa.' });
  const cNobu = newContact({ id: 'lc_nobu', name: 'Nobu Hotel Los Cabos', category: 'Venues', email: 'ventas@nobuhotelloscabos.com', phone: '+52 624 689 0160', company: 'Nobu', notes: 'Tsuki Ballroom, terrazas, jardín.' });
  const cZadun = newContact({ id: 'lc_zadun', name: 'Zadún, a Ritz-Carlton Reserve', category: 'Venues', email: 'reservas@zadunloscabos.com', phone: '', company: 'Ritz-Carlton Reserve', notes: 'Nido Ballroom, playa hasta 250 pax.' });
  const cSunset = newContact({ id: 'lc_sunset', name: 'Sunset Monalisa', category: 'Venues', email: 'info@sunsetmonalisa.com', phone: '', company: 'Sunset Monalisa', notes: 'Vista al Arco, bodas y cenas.' });
  const cWaldorf = newContact({ id: 'lc_waldorf', name: 'Waldorf Astoria Los Cabos Pedregal', category: 'Venues', email: 'eventos@waldorfastorialoscabos.com', phone: '', company: 'Waldorf Astoria', notes: 'Terrazas, playa privada.' });
  const cMarquis = newContact({ id: 'lc_marquis', name: 'Marquis Los Cabos', category: 'Venues', email: 'groupsales@marquisloscabos.com', phone: '+52 (624) 144 2000', company: 'Marquis', notes: 'Groups sales ext. 6146.' });
  const cElGanzo = newContact({ id: 'lc_elganzo', name: 'Hotel El Ganzo', category: 'Venues', email: 'info@hotelelganzo.com', phone: '', company: 'El Ganzo', notes: 'Cultural, film, art events.' });

  const cDelCaboEvents = newContact({ id: 'lc_delcaboevents', name: 'Del Cabo Events', category: 'Proveedores', email: 'info@delcaboevents.com', phone: '', company: 'Del Cabo Events', notes: 'Diseño corporativo, bodas, producción.' });
  const cMainEvent = newContact({ id: 'lc_mainevent', name: 'The Main Event', category: 'Proveedores', email: 'info@maineventcabo.com', phone: '', company: 'The Main Event', notes: 'Rentals + producción Los Cabos.' });
  const cSescabo = newContact({ id: 'lc_sescabo', name: 'SESCABO', category: 'Proveedores', email: 'info@sescabo.mx', phone: '', company: 'SESCABO', notes: 'AV, diseño, entretenimiento.' });
  const cVvr = newContact({ id: 'lc_vvr', name: 'VVR Pro', category: 'Proveedores', email: 'info@vvrpro.com', phone: '', company: 'VVR Pro', notes: 'Production house 30 años.' });

  const cCaboWeddingServices = newContact({ id: 'lc_caboweddingservices', name: 'Cabo Wedding Services', category: 'Colaboradores', email: 'jessica@caboweddings.mx', phone: '+52 624 157 5257', company: 'Cabo Wedding Services', notes: 'Wedding planners US/Canada.' });
  const cMomentos = newContact({ id: 'lc_momentos', name: 'Momentos Weddings & Events', category: 'Colaboradores', email: 'hola@momentosloscabos.com', phone: '+52 624 157 4897', company: 'Momentos', notes: 'Boutique weddings Los Cabos.' });
  const cDelCaboWeddings = newContact({ id: 'lc_delcaboweddings', name: 'Del Cabo Weddings', category: 'Colaboradores', email: 'info@delcaboweddings.com', phone: '', company: 'Del Cabo Weddings', notes: 'Luxury destination weddings.' });

  const cBisbee = newContact({ id: 'lc_bisbee', name: "Bisbee's Black & Blue", category: 'Colaboradores', email: 'info@bisbee.com', phone: '', company: 'Bisbee\'s', notes: 'Torneo de pesca, octubre.' });
  const cPga = newContact({ id: 'lc_pga', name: 'PGA Tour Los Cabos', category: 'Colaboradores', email: 'info@pgatour.com', phone: '', company: 'PGA Tour', notes: 'Golf, noviembre.' });
  const cHerbalife = newContact({ id: 'lc_herbalife', name: 'Herbalife', category: 'Clientes', email: 'events@herbalife.com', phone: '', company: 'Herbalife', notes: 'Eventos de incentivo históricos.' });

  const contacts = [cHacienda, cHilton, cNobu, cZadun, cSunset, cWaldorf, cMarquis, cElGanzo, cDelCaboEvents, cMainEvent, cSescabo, cVvr, cCaboWeddingServices, cMomentos, cDelCaboWeddings, cBisbee, cPga, cHerbalife];

  const pBrilla = newProject('lc_proy_brilla', {
    name: 'Los Cabos Brilla 2024/25',
    concept: 'Precampaña de captación de bodas, corporativos e incentivos en Los Cabos.',
    status: 'PREPRODUCCIÓN',
    date: daysFromNow(150),
    venue: 'Los Cabos',
    capacity: 0,
    responsible: 'Prod. Los Cabos',
    client: 'AMAREA',
    clientId: '',
    projectedIncome: 0,
    realIncome: 0,
    projectedCost: 15000,
    realCost: 0,
    notes: 'Campaña Q4: 30 leads, 2 alianzas, 1 evento piloto.'
  });

  const pBisbee = newProject('lc_proy_bisbee', {
    name: "Bisbee's Black & Blue 2025",
    concept: 'Producción audiovisual e infraestructura para torneo de pesca.',
    status: 'IDEA',
    date: daysFromNow(210),
    venue: 'Cabo San Lucas Marina',
    capacity: 5000,
    responsible: 'Prod. Los Cabos',
    client: "Bisbee's",
    clientId: cBisbee.id,
    projectedIncome: 250000,
    realIncome: 0,
    projectedCost: 180000,
    realCost: 0,
    notes: 'Oportunidad de alto valor. Necesita RFP.'
  });

  const pCine = newProject('lc_proy_cine', {
    name: 'Festival Internacional de Cine Los Cabos 2025',
    concept: 'Producción de gala, proyecciones y after parties.',
    status: 'IDEA',
    date: daysFromNow(180),
    venue: 'San José del Cabo / Cabo San Lucas',
    capacity: 2000,
    responsible: 'Prod. Los Cabos',
    client: 'FIC Los Cabos',
    clientId: '',
    projectedIncome: 120000,
    realIncome: 0,
    projectedCost: 85000,
    realCost: 0,
    notes: 'Evento cultural con potencial de patrocinios.'
  });

  const projects = [pBrilla, pBisbee, pCine];

  const oppHilton = newOpportunity({
    id: 'lc_opp_hilton',
    company: 'Hilton Los Cabos',
    contact: 'Director de Eventos',
    contactId: cHilton.id,
    type: 'Incentivo corporativo',
    value: 120000,
    estimatedDate: daysFromNow(90),
    nextAction: 'Enviar RFP inicial y disponibilidad',
    nextActionDate: daysFromNow(2),
    stage: 'PROSPECTO',
    responsible: 'Comercial Los Cabos',
    notes: 'Lead de alto valor, temporada alta.'
  });

  const oppNobu = newOpportunity({
    id: 'lc_opp_nobu',
    company: 'Nobu Hotel Los Cabos',
    contact: 'Sales Manager',
    contactId: cNobu.id,
    type: 'Boda destino VIP',
    value: 45000,
    estimatedDate: daysFromNow(120),
    nextAction: 'Llamada de exploración con wedding planner',
    nextActionDate: daysFromNow(3),
    stage: 'PROSPECTO',
    responsible: 'Comercial Los Cabos',
    notes: 'Bodas íntimas, experiencia de lujo.'
  });

  const oppMarquis = newOpportunity({
    id: 'lc_opp_marquis',
    company: 'Marquis Los Cabos',
    contact: 'Group Sales',
    contactId: cMarquis.id,
    type: 'Boda privada / grupo',
    value: 60000,
    estimatedDate: daysFromNow(100),
    nextAction: 'Solicitar tarifa de grupo y fechas',
    nextActionDate: daysFromNow(4),
    stage: 'PROSPECTO',
    responsible: 'Comercial Los Cabos',
    notes: 'Resort adults-only, ideal bodas.'
  });

  const oppDelCabo = newOpportunity({
    id: 'lc_opp_delcabo',
    company: 'Del Cabo Events',
    contact: 'Directora Comercial',
    contactId: cDelCaboEvents.id,
    type: 'Alianza DMC',
    value: 30000,
    estimatedDate: daysFromNow(60),
    nextAction: 'Reunión de co-branding y demo OS',
    nextActionDate: daysFromNow(5),
    stage: 'CONTACTADO',
    responsible: 'Dirección',
    notes: 'Convertir competencia en aliado.'
  });

  const oppWeddingServices = newOpportunity({
    id: 'lc_opp_weddingservices',
    company: 'Cabo Wedding Services',
    contact: 'Jessica / Tammy',
    contactId: cCaboWeddingServices.id,
    type: 'Alianza wedding planner',
    value: 20000,
    estimatedDate: daysFromNow(75),
    nextAction: 'Propuesta de comisión y checklist digital',
    nextActionDate: daysFromNow(3),
    stage: 'PROSPECTO',
    responsible: 'Comercial Los Cabos',
    notes: 'Planner con tráfico US/Canada.'
  });

  const oppBisbee = newOpportunity({
    id: 'lc_opp_bisbee',
    company: "Bisbee's Black & Blue",
    contact: 'Productor del torneo',
    contactId: cBisbee.id,
    type: 'Producción torneo pesca',
    value: 250000,
    estimatedDate: daysFromNow(180),
    nextAction: 'Enviar propuesta de producción AV + estructuras',
    nextActionDate: daysFromNow(7),
    stage: 'PROSPECTO',
    responsible: 'Prod. Los Cabos',
    notes: 'Evento deportivo de gran escala.'
  });

  const oppPga = newOpportunity({
    id: 'lc_opp_pga',
    company: 'PGA Tour Los Cabos',
    contact: 'Event Manager',
    contactId: cPga.id,
    type: 'Producción torneo golf',
    value: 300000,
    estimatedDate: daysFromNow(200),
    nextAction: 'Contactar sponsor y hospitality manager',
    nextActionDate: daysFromNow(10),
    stage: 'PROSPECTO',
    responsible: 'Dirección',
    notes: 'World Wide Technology Championship.'
  });

  const opportunities = [oppHilton, oppNobu, oppMarquis, oppDelCabo, oppWeddingServices, oppBisbee, oppPga];

  const docs = [
    newDocument({ id: 'lc_doc_plan', projectId: pBrilla.id, name: 'Plan de Campaña Los Cabos 2024/25', type: 'Material de marketing', url: '#loscabos-plan', notes: 'Base de la precampaña con venues, prospectos y competencia.' }),
    newDocument({ id: 'lc_doc_calendario', projectId: pBrilla.id, name: 'Calendario Estratégico Los Cabos 2025', type: 'Presentación', url: '#loscabos-calendario', notes: 'Eventos clave del año para planificación.' })
  ];

  const campaigns = [
    newMarketingCampaign({
      id: 'lc_camp_brilla',
      projectId: pBrilla.id,
      name: 'Los Cabos Brilla 2024/25',
      objective: 'Generar 30 leads calificados y 2 alianzas antes de enero.',
      audience: 'Wedding planners, DMCs, venues y marcas corporativas.',
      launchDate: daysFromNow(5),
      channels: 'Email, Instagram, LinkedIn, webinar',
      pieces: 'Landing, reels, carruseles, webinar, calendario 2025',
      status: 'Activa',
      copy: 'Haz que Los Cabos brille con AMAREA.',
      cta: 'Agenda una demo',
      assets: 'Calendario 2025, case studies, galería de venues',
      results: 'Pendiente de arranque'
    })
  ];

  const activities = [
    { id: makeId(), text: 'Base de datos Los Cabos importada', date: today() },
    { id: makeId(), text: 'Contactar Hilton Los Cabos para RFP', date: daysFromNow(2) },
    { id: makeId(), text: 'Reunión con Del Cabo Events', date: daysFromNow(5) }
  ];

  return { contacts, projects, opportunities, documents: docs, marketingCampaigns: campaigns, activities };
}

function seedDemo() {
  const venue = newContact({
    name: 'Sala DEMO Central',
    category: 'Venues',
    email: 'demo@sala.com',
    phone: '+34 000 000 001',
    company: 'Gestora DEMO'
  });
  const client = newContact({
    name: 'Cliente DEMO SL',
    category: 'Clientes',
    email: 'hola@cliente-demo.com',
    phone: '+34 000 000 002',
    company: 'Cliente DEMO SL'
  });
  const artist = newContact({
    name: 'Artista DEMO A',
    category: 'Artistas',
    email: 'artist@demo.com',
    company: ' management DEMO'
  });
  const tech = newContact({
    name: 'Técnico DEMO',
    category: 'Técnicos',
    email: 'tech@demo.com',
    phone: '+34 000 000 003'
  });
  const supplier = newContact({
    name: 'Proveedor DEMO Iluminación',
    category: 'Proveedores',
    email: 'luces@demo.com',
    company: 'Rig DEMO'
  });
  const media = newContact({
    name: 'Medio DEMO',
    category: 'Medios',
    email: 'redaccion@demo.com',
    company: 'Revista DEMO'
  });

  const lcb = seedLosCabos();
  const contacts = [venue, client, artist, tech, supplier, media, ...lcb.contacts];

  const future30 = daysFromNow(32);
  const future14 = daysFromNow(15);
  const pastClose = daysFromNow(-8);

  const project1 = newProject(undefined, {
    name: 'Evento DEMO Primavera',
    concept: 'Concierto showcase de artistas emergentes',
    status: 'CONFIRMADO',
    date: future30,
    venue: venue.name,
    venueId: venue.id,
    capacity: 800,
    responsible: 'Prod. DEMO',
    client: client.name,
    clientId: client.id,
    projectedIncome: 20000,
    realIncome: 0,
    projectedCost: 14000,
    realCost: 0,
    artists: [artist.name],
    production: 'Escenario 8x6, backline básico',
    technical: 'PA 8kW, luces LED, 2 técnicos',
    staff: ['Jefe de sala DEMO', 'Runner DEMO'],
    permits: 'En trámite',
    ticketing: 'Entradas DEMO',
    hospitality: 'Catering 50 pax',
    suppliers: [supplier.name],
    notes: 'Evento de demostración. Datos ficticios.',
    income: [
      { id: makeId(), type: 'Tickets', concept: 'Preventa DEMO', projected: 12000, real: 0 },
      { id: makeId(), type: 'Patrocinios', concept: 'Sponsor DEMO', projected: 8000, real: 0 }
    ],
    costs: [
      { id: makeId(), type: 'Artistas', concept: 'Artista DEMO A', projected: 5000, real: 0 },
      { id: makeId(), type: 'Venue', concept: 'Alquiler Sala DEMO', projected: 4000, real: 0 },
      { id: makeId(), type: 'Producción', concept: 'Iluminación DEMO', projected: 3000, real: 0 },
      { id: makeId(), type: 'Marketing', concept: 'Publicidad DEMO', projected: 2000, real: 0 }
    ]
  });

  const project2 = newProject(undefined, {
    name: 'Festival DEMO Verano',
    concept: 'Festival al aire libre',
    status: 'EN PRODUCCIÓN',
    date: future14,
    venue: 'Recinto DEMO',
    capacity: 5000,
    responsible: 'Dirección DEMO',
    client: '',
    projectedIncome: 120000,
    realIncome: 0,
    projectedCost: 95000,
    realCost: 0,
    artists: ['Artista DEMO A', 'Artista DEMO B'],
    production: '2 escenarios, zona de descanso',
    technical: 'PA line array, iluminación completa',
    staff: ['Coordinador DEMO', 'Voluntarios x10'],
    permits: 'Aprobados',
    ticketing: 'Venta DEMO',
    hospitality: 'Catering staff + artistas',
    suppliers: [supplier.name, 'Proveedor DEMO Sonido'],
    notes: 'Segundo evento de demostración.',
    income: [
      { id: makeId(), type: 'Tickets', concept: 'Abonos DEMO', projected: 90000, real: 0 },
      { id: makeId(), type: 'Patrocinios', concept: 'Sponsors DEMO', projected: 30000, real: 0 }
    ],
    costs: [
      { id: makeId(), type: 'Artistas', concept: 'Cachés DEMO', projected: 45000, real: 0 },
      { id: makeId(), type: 'Venue', concept: 'Recinto DEMO', projected: 25000, real: 0 },
      { id: makeId(), type: 'Producción', concept: 'Estructura DEMO', projected: 15000, real: 0 },
      { id: makeId(), type: 'Staff', concept: 'Equipo DEMO', projected: 10000, real: 0 }
    ]
  });

  const project3 = newProject(undefined, {
    name: 'Show DEMO Pasado',
    concept: 'Show para demostrar cierre',
    status: 'FINALIZADO',
    date: pastClose,
    venue: venue.name,
    venueId: venue.id,
    capacity: 500,
    responsible: 'Prod. DEMO',
    client: client.name,
    clientId: client.id,
    projectedIncome: 10000,
    realIncome: 9800,
    projectedCost: 7000,
    realCost: 7100,
    artists: [artist.name],
    production: 'Showcase íntimo',
    technical: 'PA compacto',
    staff: ['Técnico DEMO'],
    permits: 'Aprobados',
    ticketing: 'Sold out DEMO',
    hospitality: 'Catering artista',
    suppliers: [supplier.name],
    notes: 'Evento cerrado. Datos de demostración.',
    income: [
      { id: makeId(), type: 'Tickets', concept: 'Entradas DEMO', projected: 8000, real: 7800 },
      { id: makeId(), type: 'Clientes', concept: 'Cliente DEMO', projected: 2000, real: 2000 }
    ],
    costs: [
      { id: makeId(), type: 'Artistas', concept: 'Artista DEMO', projected: 3000, real: 3000 },
      { id: makeId(), type: 'Venue', concept: 'Sala DEMO', projected: 2500, real: 2600 },
      { id: makeId(), type: 'Producción', concept: 'Luces DEMO', projected: 1500, real: 1500 }
    ]
  });

  const projects = [project1, project2, project3, ...lcb.projects];

  const opp1 = newOpportunity({
    company: 'Empresa DEMO',
    contact: 'Contacto DEMO',
    contactId: client.id,
    type: 'Evento corporativo',
    value: 15000,
    estimatedDate: daysFromNow(90),
    nextAction: 'Enviar propuesta formal',
    nextActionDate: daysFromNow(2),
    stage: 'PROPUESTA',
    responsible: 'Comercial DEMO',
    notes: 'Oportunidad de demostración',
    history: ['Creada como demo']
  });

  const opp2 = newOpportunity({
    company: 'Marca DEMO',
    contact: 'Sponsor DEMO',
    contactId: media.id,
    type: 'Patrocinio',
    value: 5000,
    estimatedDate: daysFromNow(120),
    nextAction: 'Primera llamada de contacto',
    nextActionDate: daysFromNow(4),
    stage: 'PROSPECTO',
    responsible: 'Partners DEMO',
    notes: 'Lead demo sin contactar',
    history: ['Creada como demo']
  });

  const opportunities = [opp1, opp2, ...lcb.opportunities];

  const docs = [
    ...lcb.documents,
    newDocument({
      projectId: project1.id,
      name: 'Contrato Sala DEMO',
      type: 'Contrato',
      url: '#demo-contrato',
      notes: 'Documento de demostración'
    }),
    newDocument({
      projectId: project1.id,
      name: 'Rider Artista DEMO',
      type: 'Rider',
      url: '#demo-rider',
      notes: 'Rider ficticio'
    })
  ];

  const campaigns = [
    ...lcb.marketingCampaigns,
    newMarketingCampaign({
      projectId: project1.id,
      name: 'Campaña DEMO Primavera',
      objective: 'Vender 500 entradas',
      audience: 'Jóvenes 18-35',
      launchDate: daysFromNow(20),
      channels: 'Instagram, TikTok',
      pieces: 'Cartel, Stories, Reels',
      status: 'Activa',
      copy: 'No te pierdas el Evento DEMO Primavera.',
      cta: 'Compra tu entrada',
      assets: 'Cartel DEMO',
      results: 'Impresiones: 0'
    })
  ];

  const users = [
    newUser({ name: 'Admin DEMO', role: 'Dirección' }),
    newUser({ name: 'Comercial DEMO', role: 'Ventas' }),
    newUser({ name: 'Producción DEMO', role: 'Producción' })
  ];

  const demoMessage = newMessage({
    text: 'Bienvenidos al chat interno de AMAREA.',
    author: users[0].name,
    authorId: users[0].id
  });

  return {
    org: { name: 'AMAREA', currency: '€' },
    ui: { theme: 'dark' },
    contacts,
    projects,
    opportunities,
    documents: docs,
    marketingCampaigns: campaigns,
    users,
    uploads: [],
    messages: [demoMessage],
    activities: [
      { id: makeId(), text: 'Datos de demostración cargados', date: today() },
      ...lcb.activities
    ]
  };
}

const mergeById = (baseArr = [], storedArr = []) => {
  const map = new Map(baseArr.map(x => [x.id, x]));
  (storedArr || []).forEach(x => {
    map.set(x.id, { ...(map.get(x.id) || {}), ...x });
  });
  return [...map.values()];
};

export function loadState() {
  const base = seedDemo();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      return {
        ...base,
        ...stored,
        org: { ...base.org, ...stored.org },
        ui: { ...base.ui, ...stored.ui },
        users: stored.users || base.users,
        uploads: stored.uploads || base.uploads,
        messages: stored.messages || base.messages,
        contacts: mergeById(base.contacts, stored.contacts),
        projects: mergeById(base.projects, stored.projects),
        opportunities: mergeById(base.opportunities, stored.opportunities),
        documents: mergeById(base.documents, stored.documents),
        marketingCampaigns: mergeById(base.marketingCampaigns, stored.marketingCampaigns),
        activities: mergeById(base.activities, stored.activities)
      };
    }
  } catch (e) {
    // Fall through to seed
  }
  return base;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore storage errors
  }
}

export function resetToDemo() {
  return seedDemo();
}
