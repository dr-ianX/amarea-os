// PAGES / VIEWS

import { html } from 'htm/preact';
import { useState, useMemo } from 'preact/hooks';
import { resetToDemo, newProject, newOpportunity, newContact, newDocument, newMarketingCampaign, newUpload, newMessage, PROJECT_STATUSES, PIPELINE_STAGES } from './data.js';
import { summary, alertList, calendarEvents, financials, convertOpportunityToProject } from './logic.js';
import { Button, Card, Input, Select, Field, StatusBadge, StageBadge, LevelBadge, Currency, Empty, SectionHeader, daysUntil } from './components.js';

const today = () => new Date().toISOString().slice(0, 10);
const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const yes = (v) => window.confirm(v);
const projectName = (state, id) => (state.projects.find(p => p.id === id) || {}).name || '—';

const projectOptions = (state) => [{ name: 'Todos los proyectos', id: '' }].concat(state.projects);
const contactOptions = (state, category) => [{ name: 'Todas', id: '' }].concat(state.contacts.filter(c => !category || c.category === category));

const Table = ({ children }) => html`<div class="table-wrap"><table class="w-full text-sm"><tbody>${children}</tbody></table></div>`;

export const Dashboard = ({ state, setView, setModal }) => {
  const totals = useMemo(() => summary(state), [state]);
  const alerts = useMemo(() => alertList(state), [state]);
  const upcoming = useMemo(() => state.projects
    .filter(p => p.status !== 'FINALIZADO')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5), [state.projects]);
  const leads = state.opportunities.filter(o => o.stage !== 'GANADO' && o.stage !== 'PERDIDO').slice(0, 5);
  const proposals = state.opportunities.filter(o => o.stage === 'PROPUESTA' || o.stage === 'NEGOCIACIÓN');

  return html`<div class="space-y-5 animate-fade-in">
    <div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-slate-900">Dashboard</h1><span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">DEMO</span></div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <${Card} title="Proyectos activos"><div class="text-3xl font-bold text-amarea-700">${totals.activeProjects}</div><div class="text-xs text-slate-500">${totals.finalizedProjects} finalizados</div><//>
      <${Card} title="Leads activos"><div class="text-3xl font-bold text-blue-700">${totals.activeLeads}</div><${Button} small variant="ghost" onClick=${() => setView('pipeline')}>Ver pipeline<//><//>
      <${Card} title="Propuestas pendientes"><div class="text-3xl font-bold text-amber-700">${totals.pendingProposals}</div><div class="text-xs text-slate-500">negociaciones incluidas</div><//>
      <${Card} title="Ingresos proyectados"><div class="text-2xl font-bold text-emerald-700"><${Currency} value=${totals.projectedIncome} currency=${state.org.currency} /></div><div class="text-xs text-slate-500">vs real ${totals.realIncome.toLocaleString('es-ES')}</div><//>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <${Card} title="Resultado proyectado" className="md:col-span-2">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><div class="text-slate-500">Proyectado</div><div class="text-lg font-bold ${totals.projectedResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${totals.projectedResult} currency=${state.org.currency} /></div></div>
          <div><div class="text-slate-500">Real</div><div class="text-lg font-bold ${totals.realResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${totals.realResult} currency=${state.org.currency} /></div></div>
          <div><div class="text-slate-500">Costos proyectados</div><div class="text-lg font-bold text-rose-700"><${Currency} value=${totals.projectedCost} currency=${state.org.currency} /></div></div>
          <div><div class="text-slate-500">Margen proyectado</div><div class="text-lg font-bold ${totals.projectedMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}">${totals.projectedMargin.toFixed(1)}%</div></div>
        </div>
      <//>
      <${Card} title="Acciones rápidas">
        <div class="space-y-2">
          <${Button} small onClick=${() => setModal({ type: 'project' })}>+ Nuevo proyecto<//>
          <${Button} small onClick=${() => setModal({ type: 'opportunity' })}>+ Nuevo lead<//>
          <${Button} small onClick=${() => setModal({ type: 'contact' })}>+ Nuevo contacto<//>
        </div>
      <//>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <${Card} title="Alertas y tareas críticas">
        ${alerts.length === 0 ? html`<${Empty} text="No hay alertas activas" />` : html`<div class="space-y-2 max-h-64 overflow-y-auto">
          ${alerts.slice(0, 20).map(a => html`<div key=${a.id} class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <${LevelBadge} level=${a.level} />
            <div class="flex-1 text-sm text-slate-700">${a.text}</div>
            <div class="text-xs text-slate-500 whitespace-nowrap">${a.date}</div>
          </div>`)}
        </div>`}
      <//>
      <${Card} title="Próximos eventos">
        ${upcoming.length === 0 ? html`<${Empty} text="Sin eventos próximos" />` : html`<div class="space-y-2">
          ${upcoming.map(p => {
            const d = daysUntil(p.date);
            const f = financials(p);
            return html`<div key=${p.id} onClick=${() => setModal({ type: 'project', id: p.id })} class="cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div>
                <div class="font-medium text-slate-900">${p.name}</div>
                <div class="text-xs text-slate-500">${p.date} · ${p.venue}</div>
              </div>
              <div class="text-right">
                <div class="text-xs ${d <= 7 ? 'text-red-600 font-bold' : 'text-slate-500'}">${d === 0 ? 'Hoy' : d < 0 ? `Hace ${-d} días` : `En ${d} días`}</div>
                <div class="text-xs text-slate-500"><${Currency} value=${f.projectedIncome} currency=${state.org.currency} /></div>
              </div>
            </div>`;
          })}
        </div>`}
      <//>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <${Card} title="Leads activos">
        ${leads.length === 0 ? html`<${Empty} text="No hay leads" />` : html`<div class="space-y-2">
          ${leads.map(o => html`<div key=${o.id} onClick=${() => setModal({ type: 'opportunity', id: o.id })} class="cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-slate-100">
            <div class="flex items-center justify-between"><span class="font-medium text-slate-900">${o.company}</span><${StageBadge} value=${o.stage} /></div>
            <div class="text-xs text-slate-500">${o.nextAction} · ${o.nextActionDate}</div>
          </div>`)}
        </div>`}
      <//>
      <${Card} title="Propuestas pendientes">
        ${proposals.length === 0 ? html`<${Empty} text="Sin propuestas pendientes" />` : html`<div class="space-y-2">
          ${proposals.map(o => html`<div key=${o.id} onClick=${() => setModal({ type: 'opportunity', id: o.id })} class="cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-slate-100">
            <div class="flex items-center justify-between"><span class="font-medium text-slate-900">${o.company}</span><span class="text-sm font-semibold text-emerald-700"><${Currency} value=${o.value} currency=${state.org.currency} /></span></div>
            <div class="text-xs text-slate-500">${o.nextAction} · ${o.nextActionDate}</div>
          </div>`)}
        </div>`}
      <//>
    </div>
  </div>`;
};

export const Projects = ({ state, setState, setModal }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => state.projects.filter(p => {
    const m = search.toLowerCase();
    const matches = !m || p.name.toLowerCase().includes(m) || (p.client || '').toLowerCase().includes(m) || (p.venue || '').toLowerCase().includes(m);
    return matches && (!statusFilter || p.status === statusFilter);
  }).sort((a, b) => a.date.localeCompare(b.date)), [state.projects, search, statusFilter]);

  const remove = (id) => {
    if (!yes('¿Eliminar este proyecto?')) return;
    setState(s => ({ ...s, projects: s.projects.filter(p => p.id !== id) }));
  };

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Proyectos / Eventos">
      <${Input} value=${search} onInput=${e => setSearch(e.target.value)} placeholder="Buscar..." className="w-48" />
      <${Select} value=${statusFilter} onChange=${e => setStatusFilter(e.target.value)} options=${[ {value:'', label:'Todos'} ].concat(PROJECT_STATUSES.map(s => ({value:s, label:s})))} />
      <${Button} onClick=${() => setModal({ type: 'project' })}>+ Nuevo<//>
    <//>
    <${Card} noPad>
      <table class="w-full text-sm">
        <thead class="bg-slate-100"><tr><th class="p-3 text-left">Nombre</th><th class="p-3 text-left">Fecha</th><th class="p-3 text-left">Estado</th><th class="p-3 text-left">Cliente</th><th class="p-3 text-left">Venue</th><th class="p-3 text-right">Ingreso</th><th class="p-3 text-right">Coste</th><th class="p-3 text-right">Resultado</th><th class="p-3"></th></tr></thead>
        <tbody>
          ${filtered.map(p => {
            const f = financials(p);
            return html`<tr key=${p.id} class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-3"><button class="font-medium text-slate-900 hover:text-amarea-700" onClick=${() => setModal({ type: 'project', id: p.id })}>${p.name}</button></td>
              <td class="p-3 text-slate-600">${p.date}</td>
              <td class="p-3"><${StatusBadge} value=${p.status} /></td>
              <td class="p-3 text-slate-600">${p.client || '—'}</td>
              <td class="p-3 text-slate-600">${p.venue || '—'}</td>
              <td class="p-3 text-right font-medium text-emerald-700"><${Currency} value=${f.projectedIncome} currency=${state.org.currency} /></td>
              <td class="p-3 text-right font-medium text-rose-700"><${Currency} value=${f.projectedCost} currency=${state.org.currency} /></td>
              <td class="p-3 text-right font-bold ${f.projectedResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${f.projectedResult} currency=${state.org.currency} /></td>
              <td class="p-3"><button onClick=${() => remove(p.id)} class="text-red-600 text-sm hover:underline">Eliminar</button></td>
            </tr>`;
          })}
        </tbody>
      </table>
      ${filtered.length === 0 && html`<${Empty} text="No se encontraron proyectos" />`}
    <//>
  </div>`;
};

export const Pipeline = ({ state, setState, setModal }) => {
  const [stageFilter, setStageFilter] = useState('');

  const convert = (o) => {
    const project = convertOpportunityToProject(o, state);
    setState(s => ({
      ...s,
      projects: [...s.projects, project],
      opportunities: s.opportunities.map(x => x.id === o.id ? { ...x, stage: 'GANADO' } : x),
      activities: [{ id: makeId(), text: `Oportunidad ganada y convertida a proyecto: ${project.name}`, date: today() }, ...s.activities]
    }));
  };

  const moveStage = (o, stage) => {
    setState(s => ({
      ...s,
      opportunities: s.opportunities.map(x => x.id === o.id ? { ...x, stage, history: [...x.history, `Cambio a ${stage} el ${today()}`] } : x),
      activities: [{ id: makeId(), text: `${o.company} → ${stage}`, date: today() }, ...s.activities]
    }));
    if (stage === 'GANADO') setTimeout(() => convert(o), 0);
  };

  const remove = (id) => {
    if (!yes('¿Eliminar oportunidad?')) return;
    setState(s => ({ ...s, opportunities: s.opportunities.filter(o => o.id !== id) }));
  };

  const columns = stageFilter ? [stageFilter] : PIPELINE_STAGES;

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Pipeline comercial">
      <${Select} value=${stageFilter} onChange=${e => setStageFilter(e.target.value)} options=${[ {value:'', label:'Todas'} ].concat(PIPELINE_STAGES.map(s => ({value:s, label:s})))} />
      <${Button} onClick=${() => setModal({ type: 'opportunity' })}>+ Nuevo lead<//>
    <//>
    <div class="flex gap-4 overflow-x-auto pb-2">
      ${columns.map(stage => {
        const opps = state.opportunities.filter(o => o.stage === stage);
        const total = opps.reduce((s, o) => s + (Number(o.value) || 0), 0);
        return html`<div key=${stage} class="min-w-[260px] flex-1 bg-slate-100 rounded-xl p-3">
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-slate-800">${stage}</span>
            <span class="text-xs font-bold text-slate-500">${opps.length} · <${Currency} value=${total} currency=${state.org.currency} /></span>
          </div>
          <div class="space-y-2">
            ${opps.map(o => html`<div key=${o.id} class="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
              <div class="flex items-center justify-between mb-1"><span class="font-medium text-slate-900">${o.company}</span><span class="text-sm font-bold text-emerald-700"><${Currency} value=${o.value} currency=${state.org.currency} /></span></div>
              <div class="text-xs text-slate-500 mb-2">${o.contact} · ${o.type}</div>
              <div class="text-xs text-slate-600 mb-2"><span class="font-semibold">Próxima acción:</span> ${o.nextAction}</div>
              <div class="text-xs text-slate-500 mb-3">${o.nextActionDate}</div>
              <div class="flex flex-wrap gap-2">
                <${Select} value=${o.stage} onChange=${e => moveStage(o, e.target.value)} options=${PIPELINE_STAGES} />
                <${Button} small onClick=${() => setModal({ type: 'opportunity', id: o.id })}>Editar<//>
                <${Button} small variant="danger" onClick=${() => remove(o.id)}>×<//>
              </div>
            </div>`)}
          </div>
        </div>`;
      })}
    </div>
  </div>`;
};

export const Calendar = ({ state, setModal }) => {
  const [filter, setFilter] = useState('');
  const events = useMemo(() => calendarEvents(state).filter(e => !filter || e.type === filter), [state, filter]);
  const types = useMemo(() => [{value:'', label:'Todos'}, ...Array.from(new Set(calendarEvents(state).map(e => e.type))).map(t => ({value:t, label:t}))], [state]);

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Calendario">
      <${Select} value=${filter} onChange=${e => setFilter(e.target.value)} options=${types} />
    <//>
    <${Card} noPad>
      <table class="w-full text-sm">
        <thead class="bg-slate-100"><tr><th class="p-3 text-left">Fecha</th><th class="p-3 text-left">Tipo</th><th class="p-3 text-left">Título</th><th class="p-3 text-left">Días</th></tr></thead>
        <tbody>
          ${events.map(e => {
            const d = daysUntil(e.date);
            return html`<tr key=${e.id} class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-3">${e.date}</td>
              <td class="p-3"><span class="badge bg-slate-100 text-slate-700">${e.type}</span></td>
              <td class="p-3 font-medium text-slate-900">${e.title}</td>
              <td class="p-3 ${d <= 3 ? 'text-red-600 font-bold' : 'text-slate-500'}">${d === 0 ? 'Hoy' : d < 0 ? `Hace ${-d}` : `En ${d}`}</td>
            </tr>`;
          })}
        </tbody>
      </table>
      ${events.length === 0 && html`<${Empty} text="No hay eventos" />`}
    <//>
  </div>`;
};

export const Finance = ({ state, setModal }) => {
  const totals = useMemo(() => summary(state), [state]);
  const byProject = useMemo(() => state.projects.map(p => ({ ...p, fin: financials(p) })).sort((a, b) => a.date.localeCompare(b.date)), [state.projects]);

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Finanzas" />
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <${Card} title="Ingreso proyectado"><div class="text-2xl font-bold text-emerald-700"><${Currency} value=${totals.projectedIncome} currency=${state.org.currency} /></div><//>
      <${Card} title="Ingreso real"><div class="text-2xl font-bold text-emerald-700"><${Currency} value=${totals.realIncome} currency=${state.org.currency} /></div><//>
      <${Card} title="Costo proyectado"><div class="text-2xl font-bold text-rose-700"><${Currency} value=${totals.projectedCost} currency=${state.org.currency} /></div><//>
      <${Card} title="Costo real"><div class="text-2xl font-bold text-rose-700"><${Currency} value=${totals.realCost} currency=${state.org.currency} /></div><//>
      <${Card} title="Resultado proyectado"><div class="text-2xl font-bold ${totals.projectedResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${totals.projectedResult} currency=${state.org.currency} /></div><//>
      <${Card} title="Resultado real"><div class="text-2xl font-bold ${totals.realResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${totals.realResult} currency=${state.org.currency} /></div><//>
      <${Card} title="Margen proyectado"><div class="text-2xl font-bold ${totals.projectedMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}">${totals.projectedMargin.toFixed(1)}%</div><//>
      <${Card} title="Valor ganado (opp)"><div class="text-2xl font-bold text-emerald-700"><${Currency} value=${totals.wonValue} currency=${state.org.currency} /></div><//>
    </div>
    <${Card} title="Cierre por proyecto" noPad>
      <table class="w-full text-sm">
        <thead class="bg-slate-100"><tr><th class="p-3 text-left">Proyecto</th><th class="p-3 text-left">Estado</th><th class="p-3 text-right">Ing. proyectado</th><th class="p-3 text-right">Ing. real</th><th class="p-3 text-right">Coste proyectado</th><th class="p-3 text-right">Coste real</th><th class="p-3 text-right">Res. proyectado</th><th class="p-3 text-right">Res. real</th></tr></thead>
        <tbody>
          ${byProject.map(p => html`<tr key=${p.id} class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-3"><button class="font-medium text-slate-900 hover:text-amarea-700" onClick=${() => setModal({ type: 'project', id: p.id })}>${p.name}</button></td>
            <td class="p-3"><${StatusBadge} value=${p.status} /></td>
            <td class="p-3 text-right"><${Currency} value=${p.fin.projectedIncome} currency=${state.org.currency} /></td>
            <td class="p-3 text-right"><${Currency} value=${p.fin.realIncome} currency=${state.org.currency} /></td>
            <td class="p-3 text-right"><${Currency} value=${p.fin.projectedCost} currency=${state.org.currency} /></td>
            <td class="p-3 text-right"><${Currency} value=${p.fin.realCost} currency=${state.org.currency} /></td>
            <td class="p-3 text-right font-bold ${p.fin.projectedResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${p.fin.projectedResult} currency=${state.org.currency} /></td>
            <td class="p-3 text-right font-bold ${p.fin.realResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${p.fin.realResult} currency=${state.org.currency} /></td>
          </tr>`)}
        </tbody>
      </table>
    <//>
  </div>`;
};

export const Contacts = ({ state, setModal, setState }) => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  const filtered = useMemo(() => state.contacts.filter(c => {
    const m = search.toLowerCase();
    return (!m || c.name.toLowerCase().includes(m) || c.company.toLowerCase().includes(m) || c.email.toLowerCase().includes(m)) &&
           (!cat || c.category === cat);
  }).sort((a, b) => a.name.localeCompare(b.name)), [state.contacts, search, cat]);

  const cats = [{value:'', label:'Todas'}, ...Array.from(new Set(state.contacts.map(c => c.category))).map(c => ({value:c, label:c}))];

  const remove = (id) => {
    if (!yes('¿Eliminar contacto?')) return;
    setState(s => ({ ...s, contacts: s.contacts.filter(c => c.id !== id) }));
  };

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Contactos">
      <${Input} value=${search} onInput=${e => setSearch(e.target.value)} placeholder="Buscar..." className="w-48" />
      <${Select} value=${cat} onChange=${e => setCat(e.target.value)} options=${cats} />
      <${Button} onClick=${() => setModal({ type: 'contact' })}>+ Nuevo<//>
    <//>
    <${Card} noPad>
      <table class="w-full text-sm">
        <thead class="bg-slate-100"><tr><th class="p-3 text-left">Nombre</th><th class="p-3 text-left">Categoría</th><th class="p-3 text-left">Empresa</th><th class="p-3 text-left">Email</th><th class="p-3 text-left">Teléfono</th><th class="p-3"></th></tr></thead>
        <tbody>
          ${filtered.map(c => html`<tr key=${c.id} class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-3"><button class="font-medium text-slate-900 hover:text-amarea-700" onClick=${() => setModal({ type: 'contact', id: c.id })}>${c.name}</button></td>
            <td class="p-3"><span class="badge bg-slate-100 text-slate-700">${c.category}</span></td>
            <td class="p-3 text-slate-600">${c.company || '—'}</td>
            <td class="p-3 text-slate-600">${c.email || '—'}</td>
            <td class="p-3 text-slate-600">${c.phone || '—'}</td>
            <td class="p-3"><button onClick=${() => remove(c.id)} class="text-red-600 text-sm hover:underline">Eliminar</button></td>
          </tr>`)}
        </tbody>
      </table>
      ${filtered.length === 0 && html`<${Empty} text="No se encontraron contactos" />`}
    <//>
  </div>`;
};

export const Documents = ({ state, setModal, setState }) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const filtered = useMemo(() => state.documents.filter(d => {
    const m = search.toLowerCase();
    return (!m || d.name.toLowerCase().includes(m) || d.type.toLowerCase().includes(m)) &&
           (!projectFilter || d.projectId === projectFilter);
  }).sort((a, b) => a.name.localeCompare(b.name)), [state.documents, search, projectFilter]);

  const remove = (id) => {
    if (!yes('¿Eliminar documento?')) return;
    setState(s => ({ ...s, documents: s.documents.filter(d => d.id !== id) }));
  };

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Documentos">
      <${Input} value=${search} onInput=${e => setSearch(e.target.value)} placeholder="Buscar..." className="w-48" />
      <${Select} value=${projectFilter} onChange=${e => setProjectFilter(e.target.value)} options=${projectOptions(state)} />
      <${Button} onClick=${() => setModal({ type: 'document' })}>+ Nuevo<//>
    <//>
    <${Card} noPad>
      <table class="w-full text-sm">
        <thead class="bg-slate-100"><tr><th class="p-3 text-left">Nombre</th><th class="p-3 text-left">Tipo</th><th class="p-3 text-left">Proyecto</th><th class="p-3 text-left">Referencia</th><th class="p-3"></th></tr></thead>
        <tbody>
          ${filtered.map(d => html`<tr key=${d.id} class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-3"><button class="font-medium text-slate-900 hover:text-amarea-700" onClick=${() => setModal({ type: 'document', id: d.id })}>${d.name}</button></td>
            <td class="p-3"><span class="badge bg-slate-100 text-slate-700">${d.type}</span></td>
            <td class="p-3 text-slate-600">${projectName(state, d.projectId)}</td>
            <td class="p-3 text-slate-600">${d.url || '—'}</td>
            <td class="p-3"><button onClick=${() => remove(d.id)} class="text-red-600 text-sm hover:underline">Eliminar</button></td>
          </tr>`)}
        </tbody>
      </table>
      ${filtered.length === 0 && html`<${Empty} text="No hay documentos" />`}
    <//>
  </div>`;
};

export const Marketing = ({ state, setModal, setState }) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const filtered = useMemo(() => state.marketingCampaigns.filter(c => {
    const m = search.toLowerCase();
    return (!m || c.name.toLowerCase().includes(m) || c.status.toLowerCase().includes(m)) &&
           (!projectFilter || c.projectId === projectFilter);
  }).sort((a, b) => a.launchDate.localeCompare(b.launchDate)), [state.marketingCampaigns, search, projectFilter]);

  const remove = (id) => {
    if (!yes('¿Eliminar campaña?')) return;
    setState(s => ({ ...s, marketingCampaigns: s.marketingCampaigns.filter(c => c.id !== id) }));
  };

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Marketing">
      <${Input} value=${search} onInput=${e => setSearch(e.target.value)} placeholder="Buscar..." className="w-48" />
      <${Select} value=${projectFilter} onChange=${e => setProjectFilter(e.target.value)} options=${projectOptions(state)} />
      <${Button} onClick=${() => setModal({ type: 'marketing' })}>+ Nueva<//>
    <//>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${filtered.map(c => html`<${Card} key=${c.id} className="hover:shadow-md transition">
        <div class="flex items-start justify-between mb-2">
          <div class="font-semibold text-slate-900">${c.name}</div>
          <span class="badge bg-slate-100 text-slate-700">${c.status}</span>
        </div>
        <div class="text-xs text-slate-500 mb-1">Proyecto: ${projectName(state, c.projectId)} · Lanzamiento ${c.launchDate}</div>
        <div class="text-sm text-slate-700 mb-2"><span class="font-semibold">Objetivo:</span> ${c.objective}</div>
        <div class="text-sm text-slate-700 mb-2"><span class="font-semibold">Público:</span> ${c.audience}</div>
        <div class="text-sm text-slate-700 mb-3 italic text-slate-500">“${c.copy || 'Sin copy'}”</div>
        <div class="flex gap-2">
          <${Button} small onClick=${() => setModal({ type: 'marketing', id: c.id })}>Editar<//>
          <${Button} small variant="danger" onClick=${() => remove(c.id)}>×<//>
        </div>
      <//>`)}
    </div>
    ${filtered.length === 0 && html`<${Empty} text="No hay campañas" />`}
  </div>`;
};

export const Settings = ({ state, setState, setModal }) => {
  const reset = () => {
    if (!yes('¿Restaurar datos de demostración? Se perderán los cambios.')) return;
    setState(resetToDemo());
  };

  const setOrg = (org) => setState(s => ({ ...s, org }));

  return html`<div class="animate-fade-in max-w-2xl">
    <${SectionHeader} title="Configuración" />
    <${Card} title="Organización">
      <${Field} label="Nombre"><${Input} value=${state.org.name} onInput=${e => setOrg({ ...state.org, name: e.target.value })} /><//>
      <${Field} label="Moneda"><${Input} value=${state.org.currency} onInput=${e => setOrg({ ...state.org, currency: e.target.value })} placeholder="€ / $" /><//>
    <//>
    <${Card} title="Apariencia" className="mt-4">
      <${Field} label="Tema"><${Select} value=${(state.ui || {}).theme || 'dark'} onChange=${e => setState(s => ({ ...s, ui: { ...(s.ui || {}), theme: e.target.value } }))} options=${[ {value:'dark', label:'Oscuro'}, {value:'light', label:'Claro'} ]} /><//>
    <//>
    <${Card} title="Datos" className="mt-4">
      <div class="space-y-3">
        <div><${Button} onClick=${reset} variant="danger">Restaurar datos DEMO<//></div>
        <div class="text-xs text-slate-500">Al restaurar se recargan datos ficticios claramente identificados como DEMO.</div>
      </div>
    <//>
    <${Card} title="Actividad reciente" className="mt-4">
      <div class="space-y-2 max-h-64 overflow-y-auto">
        ${state.activities.slice(0, 30).map(a => html`<div key=${a.id} class="text-sm text-slate-700"><span class="text-slate-400 text-xs">${a.date}</span> · ${a.text}</div>`)}
      </div>
    <//>
  </div>`;
};

export const Uploads = ({ state, setState, setModal }) => {
  const [filter, setFilter] = useState('');

  const handleFiles = (e) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const u = newUpload({
          name: file.name,
          mime: file.type,
          size: file.size,
          type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : (file.type.startsWith('audio/') ? 'audio' : 'document')),
          url: ev.target.result,
          uploadedBy: (state.users[0] || {}).name || 'Admin DEMO',
          date: new Date().toISOString()
        });
        setState(s => ({
          ...s,
          uploads: [...s.uploads, u],
          activities: [{ id: makeId(), text: `Subido: ${u.name}`, date: today() }, ...s.activities]
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const remove = (id) => {
    if (!yes('¿Eliminar este archivo?')) return;
    setState(s => ({ ...s, uploads: s.uploads.filter(u => u.id !== id) }));
  };

  const typeLabel = (t) => ({ image: 'Imagen', video: 'Vídeo', audio: 'Audio', document: 'Documento' }[t] || 'Otro');

  const filtered = useMemo(() => state.uploads.filter(u => {
    const m = filter.toLowerCase();
    return !m || u.name.toLowerCase().includes(m) || typeLabel(u.type).toLowerCase().includes(m);
  }).sort((a, b) => new Date(b.date) - new Date(a.date)), [state.uploads, filter]);

  const formatSize = (bytes) => bytes > 1048576 ? (bytes / 1048576).toFixed(2) + ' MB' : (bytes / 1024).toFixed(1) + ' KB';

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Multimedia">
      <${Input} value=${filter} onInput=${e => setFilter(e.target.value)} placeholder="Buscar..." className="w-48" />
      <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-amarea-600 hover:bg-amarea-700 transition">
        <span>+ Subir archivos</span>
        <input type="file" multiple class="hidden" onChange=${handleFiles} />
      </label>
    <//>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      ${filtered.length === 0 && html`<div class="col-span-full"><${Empty} text="Sin archivos. Sube fotos, documentos o vídeos." /></div>`}
      ${filtered.map(u => html`<${Card} key=${u.id} className="relative group overflow-hidden">
        <div class="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg mb-2">
          ${u.type === 'image'
            ? html`<img src=${u.url} alt=${u.name} class="h-full w-full object-cover" />`
            : html`<div class="text-3xl text-slate-400">${{ document: '▭', video: '▶', audio: '♪' }[u.type] || '◆'}</div>`
          }
        </div>
        <div class="text-xs font-medium truncate text-slate-900">${u.name}</div>
        <div class="text-xs text-slate-500">${typeLabel(u.type)} · ${formatSize(u.size)}</div>
        <div class="text-xs text-slate-400">${u.uploadedBy} · ${u.date.slice(0,10)}</div>
        <div class="flex gap-2 mt-2">
          <a href=${u.url} target="_blank" class="text-xs text-amarea-600 hover:underline">Abrir</a>
          <button onClick=${() => remove(u.id)} class="text-xs text-red-600 hover:underline">Eliminar</button>
        </div>
      <//>`)}
    </div>
  </div>`;
};

export const Chat = ({ state, setState }) => {
  const [text, setText] = useState('');

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const me = state.users[0] || { id: 'me', name: 'Admin DEMO' };
    const msg = newMessage({
      text: t,
      author: me.name,
      authorId: me.id,
      date: new Date().toISOString()
    });
    setState(s => ({ ...s, messages: [...s.messages, msg] }));
    setText('');
  };

  const sorted = useMemo(() => [...state.messages].sort((a, b) => new Date(a.date) - new Date(b.date)), [state.messages]);

  const formatTime = (d) => new Date(d).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

  return html`<div class="animate-fade-in flex flex-col h-[calc(100vh-120px)]">
    <${SectionHeader} title="Chat interno" />
    <${Card} className="flex-1 flex flex-col overflow-hidden" noPad>
      <div class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        ${sorted.map(m => html`<div key=${m.id} class="${m.authorId === (state.users[0] || {}).id ? 'ml-8 text-right' : 'mr-8'}">
          <div class="inline-block max-w-[80%] rounded-xl px-4 py-2 text-sm ${m.authorId === (state.users[0] || {}).id ? 'bg-amarea-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}">
            <div class="text-xs font-semibold mb-1 opacity-80">${m.author}</div>
            <div>${m.text}</div>
          </div>
          <div class="text-xs text-slate-400 mt-1">${formatTime(m.date)}</div>
        </div>`)}
      </div>
      <div class="border-t border-slate-200 p-3 flex gap-2">
        <${Input} value=${text} onInput=${e => setText(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') send(); }} placeholder="Escribe un mensaje..." />
        <${Button} onClick=${send}>Enviar<//>
      </div>
    <//>
  </div>`;
};

export const Analytics = ({ state }) => {
  const totals = summary(state);
  const projects = state.projects || [];
  const opportunities = state.opportunities || [];

  const statusCounts = useMemo(() => {
    const m = {};
    projects.forEach(p => { m[p.status] = (m[p.status] || 0) + 1; });
    return m;
  }, [projects]);

  const stageCounts = useMemo(() => {
    const m = {};
    opportunities.forEach(o => { m[o.stage] = (m[o.stage] || 0) + 1; });
    return m;
  }, [opportunities]);

  const clientIncome = useMemo(() => {
    const m = {};
    projects.forEach(p => {
      const fin = financials(p);
      const key = p.client || 'Sin cliente';
      m[key] = (m[key] || 0) + fin.projectedIncome;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [projects]);

  const maxIncome = clientIncome.length ? clientIncome[0][1] : 0;
  const maxBar = Math.max(totals.projectedIncome, totals.realIncome, totals.projectedCost, totals.realCost, 1);

  const Bar = ({ label, value, color }) => {
    const pct = Math.round((value / maxBar) * 100);
    return html`<div class="mb-3">
      <div class="flex justify-between text-xs mb-1"><span>${label}</span><span><${Currency} value=${value} currency=${state.org.currency} /></span></div>
      <div class="h-2 bg-slate-200 rounded-full overflow-hidden"><div class="h-full ${color}" style="width:${pct}%"></div></div>
    </div>`;
  };

  const DistBar = ({ label, count, total, color }) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return html`<div class="mb-2">
      <div class="flex justify-between text-xs mb-1"><span>${label}</span><span>${count} (${pct}%)</span></div>
      <div class="h-2 bg-slate-200 rounded-full overflow-hidden"><div class="h-full ${color}" style="width:${pct}%"></div></div>
    </div>`;
  };

  return html`<div class="animate-fade-in">
    <${SectionHeader} title="Análisis de datos" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <${Card} title="Proyectos activos"><div class="text-3xl font-bold text-slate-900">${totals.activeProjects}</div><//>
      <${Card} title="Proyectos finalizados"><div class="text-3xl font-bold text-slate-900">${totals.finalizedProjects}</div><//>
      <${Card} title="Leads activos"><div class="text-3xl font-bold text-slate-900">${totals.activeLeads}</div><//>
      <${Card} title="Propuestas pendientes"><div class="text-3xl font-bold text-slate-900">${totals.pendingProposals}</div><//>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <${Card} title="Finanzas globales">
        <${Bar} label="Ingreso proyectado" value=${totals.projectedIncome} color="bg-emerald-500" />
        <${Bar} label="Ingreso real" value=${totals.realIncome} color="bg-emerald-700" />
        <${Bar} label="Costo proyectado" value=${totals.projectedCost} color="bg-rose-500" />
        <${Bar} label="Costo real" value=${totals.realCost} color="bg-rose-700" />
        <div class="mt-4 pt-4 border-t border-slate-200">
          <div class="flex justify-between text-sm font-semibold"><span>Resultado proyectado</span><span class="${totals.projectedResult >= 0 ? 'text-emerald-600' : 'text-red-600'}"><${Currency} value=${totals.projectedResult} currency=${state.org.currency} /></span></div>
          <div class="flex justify-between text-sm font-semibold mt-1"><span>Resultado real</span><span class="${totals.realResult >= 0 ? 'text-emerald-600' : 'text-red-600'}"><${Currency} value=${totals.realResult} currency=${state.org.currency} /></span></div>
        </div>
      <//>
      <${Card} title="Distribución de estados de proyectos">
        ${Object.entries(statusCounts).map(([k, v]) => html`<${DistBar} key=${k} label=${k} count=${v} total=${projects.length} color="bg-amarea-600" />`)}
      <//>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <${Card} title="Pipeline de oportunidades">
        ${Object.entries(stageCounts).map(([k, v]) => html`<${DistBar} key=${k} label=${k} count=${v} total=${opportunities.length} color="bg-indigo-500" />`)}
      <//>
      <${Card} title="Top clientes por ingresos proyectados">
        ${clientIncome.length === 0 && html`<${Empty} text="Sin datos de clientes" />`}
        ${clientIncome.map(([client, amount]) => {
          const pct = maxIncome ? Math.round((amount / maxIncome) * 100) : 0;
          return html`<div class="mb-3" key=${client}>
            <div class="flex justify-between text-xs mb-1"><span>${client}</span><span><${Currency} value=${amount} currency=${state.org.currency} /></span></div>
            <div class="h-2 bg-slate-200 rounded-full overflow-hidden"><div class="h-full bg-amber-500" style="width:${pct}%"></div></div>
          </div>`;
        })}
      <//>
    </div>
  </div>`;
};
