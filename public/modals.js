// MODALS FORMS

import { html } from 'htm/preact';
import { useState, useMemo } from 'preact/hooks';
import {
  PROJECT_STATUSES, PIPELINE_STAGES, CONTACT_CATEGORIES, DOC_TYPES,
  INCOME_TYPES, COST_TYPES, newProject, newOpportunity, newContact,
  newDocument, newMarketingCampaign
} from './data.js';
import { financials } from './logic.js';
import { Button, Input, Select, TextArea, Field, Modal, Tabs, StatusBadge, StageBadge, Currency } from './components.js';

const today = () => new Date().toISOString().slice(0, 10);
const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const arrFromText = (text) => text.split('\n').map(x => x.trim()).filter(Boolean);
const arrToText = (arr) => (arr || []).join('\n');
const yes = (v) => window.confirm(v);

const ModalFooter = ({ onSave, onClose, saveText = 'Guardar' }) =>
  html`<div class="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
    <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
    <${Button} onClick=${onSave}>${saveText}<//>
  </div>`;

const ContactPicker = ({ value, contacts, onChange, label, category }) => {
  const options = useMemo(() =>
    [{ name: '— Ninguno / manual —', id: '' }].concat(contacts.filter(c => !category || c.category === category)),
  [contacts, category]);
  return html`<${Field} label=${label}>
    <${Select} value=${value || ''} onChange=${e => onChange(e.target.value)} options=${options.map(o => o.name)} />
  <//>`;
};

export const ProjectModal = ({ project, state, setState, onClose }) => {
  const isNew = !project;
  const [draft, setDraft] = useState(isNew ? newProject() : JSON.parse(JSON.stringify(project)));
  const [tab, setTab] = useState('General');
  const fin = useMemo(() => financials(draft), [draft]);
  const clients = state.contacts.filter(c => c.category === 'Clientes');
  const venues = state.contacts.filter(c => c.category === 'Venues');

  const set = (obj) => setDraft(d => ({ ...d, ...obj }));
  const setArr = (key, text) => set({ [key]: arrFromText(text) });
  const setSub = (key, id, obj) => setDraft(d => ({ ...d, [key]: d[key].map(x => x.id === id ? { ...x, ...obj } : x) }));
  const addSub = (key, tpl) => setDraft(d => ({ ...d, [key]: [...d[key], { id: makeId(), ...tpl }] }));
  const rmSub = (key, id) => setDraft(d => ({ ...d, [key]: d[key].filter(x => x.id !== id) }));
  const toggleTask = (id) => setDraft(d => ({ ...d, checklist: d.checklist.map(x => x.id === id ? { ...x, done: !x.done } : x) }));
  const setTaskNote = (id, notes) => setDraft(d => ({ ...d, checklist: d.checklist.map(x => x.id === id ? { ...x, notes } : x) }));

  const save = () => {
    const updated = { ...draft, updatedAt: today() };
    if (isNew) {
      setState(s => ({
        ...s,
        projects: [...s.projects, updated],
        activities: [{ id: makeId(), text: `Proyecto creado: ${updated.name}`, date: today() }, ...s.activities]
      }));
    } else {
      setState(s => ({
        ...s,
        projects: s.projects.map(p => p.id === updated.id ? updated : p),
        activities: [{ id: makeId(), text: `Proyecto actualizado: ${updated.name}`, date: today() }, ...s.activities]
      }));
    }
    onClose();
  };

  const remove = () => {
    if (!yes('¿Eliminar este proyecto?')) return;
    setState(s => ({ ...s, projects: s.projects.filter(p => p.id !== draft.id) }));
    onClose();
  };

  const clientChange = (id) => {
    const c = state.contacts.find(x => x.id === id);
    set({ clientId: id, client: c ? c.name : '' });
  };
  const venueChange = (id) => {
    const c = state.contacts.find(x => x.id === id);
    set({ venueId: id, venue: c ? c.name : '' });
  };

  const tabs = ['General', 'Equipo', 'Finanzas', 'Checklist'];

  return html`<${Modal} title=${isNew ? 'Nuevo proyecto / evento' : draft.name} onClose=${onClose}>
    <${Tabs} tabs=${tabs} active=${tab} onChange=${setTab} />
    ${tab === 'General' && html`
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2"><${Field} label="Nombre"><${Input} value=${draft.name} onInput=${e => set({ name: e.target.value })} /><//></div>
        <div class="md:col-span-2"><${Field} label="Concepto"><${TextArea} value=${draft.concept} onInput=${e => set({ concept: e.target.value })} rows="2" /><//></div>
        <${Field} label="Estado"><${Select} value=${draft.status} onChange=${e => set({ status: e.target.value })} options=${PROJECT_STATUSES} /><//>
        <${Field} label="Fecha del evento"><${Input} type="date" value=${draft.date} onInput=${e => set({ date: e.target.value })} /><//>
        <${Field} label="Responsable"><${Input} value=${draft.responsible} onInput=${e => set({ responsible: e.target.value })} /><//>
        <${Field} label="Capacidad"><${Input} type="number" value=${draft.capacity} onInput=${e => set({ capacity: e.target.value })} /><//>
        <${ContactPicker} label="Cliente" value=${draft.clientId} contacts=${clients} category="Clientes" onChange=${clientChange} />
        <${ContactPicker} label="Venue" value=${draft.venueId} contacts=${venues} category="Venues" onChange=${venueChange} />
        <${Field} label="Permisos"><${Input} value=${draft.permits} onInput=${e => set({ permits: e.target.value })} /><//>
        <${Field} label="Ticketing"><${Input} value=${draft.ticketing} onInput=${e => set({ ticketing: e.target.value })} /><//>
        <${Field} label="Hospitality"><${Input} value=${draft.hospitality} onInput=${e => set({ hospitality: e.target.value })} /><//>
        <div class="md:col-span-2"><${Field} label="Notas"><${TextArea} value=${draft.notes} onInput=${e => set({ notes: e.target.value })} rows="3" /><//></div>
        ${draft.status === 'FINALIZADO' && html`<div class="md:col-span-2"><${Field} label="Postmortem"><${TextArea} value=${draft.postmortem} onInput=${e => set({ postmortem: e.target.value })} rows="3" /><//></div>`}
      </div>
    `}
    ${tab === 'Equipo' && html`
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2"><${Field} label="Artistas (uno por línea)"><${TextArea} value=${arrToText(draft.artists)} onInput=${e => setArr('artists', e.target.value)} rows="3" /><//></div>
        <div class="md:col-span-2"><${Field} label="Producción"><${TextArea} value=${draft.production} onInput=${e => set({ production: e.target.value })} rows="2" /><//></div>
        <div class="md:col-span-2"><${Field} label="Técnica"><${TextArea} value=${draft.technical} onInput=${e => set({ technical: e.target.value })} rows="2" /><//></div>
        <div class="md:col-span-2"><${Field} label="Staff (uno por línea)"><${TextArea} value=${arrToText(draft.staff)} onInput=${e => setArr('staff', e.target.value)} rows="3" /><//></div>
        <div class="md:col-span-2"><${Field} label="Proveedores (uno por línea)"><${TextArea} value=${arrToText(draft.suppliers)} onInput=${e => setArr('suppliers', e.target.value)} rows="3" /><//></div>
      </div>
    `}
    ${tab === 'Finanzas' && html`
      <div class="mb-4 p-4 bg-slate-50 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><div class="text-slate-500">Ingreso proyectado</div><div class="text-lg font-bold text-emerald-700"><${Currency} value=${fin.projectedIncome} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Ingreso real</div><div class="text-lg font-bold text-emerald-700"><${Currency} value=${fin.realIncome} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Costo proyectado</div><div class="text-lg font-bold text-rose-700"><${Currency} value=${fin.projectedCost} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Costo real</div><div class="text-lg font-bold text-rose-700"><${Currency} value=${fin.realCost} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Resultado proyectado</div><div class="text-lg font-bold ${fin.projectedResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${fin.projectedResult} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Resultado real</div><div class="text-lg font-bold ${fin.realResult >= 0 ? 'text-emerald-700' : 'text-red-700'}"><${Currency} value=${fin.realResult} currency=${state.org.currency} /></div></div>
        <div><div class="text-slate-500">Margen proyectado</div><div class="text-lg font-bold ${fin.projectedMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}">${fin.projectedMargin.toFixed(1)}%</div></div>
        <div><div class="text-slate-500">Margen real</div><div class="text-lg font-bold ${fin.realMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}">${fin.realMargin.toFixed(1)}%</div></div>
      </div>
      <div class="font-semibold text-slate-800 mb-2">Ingresos</div>
      <table class="w-full text-sm mb-4">
        <thead class="bg-slate-100"><tr><th class="text-left p-2">Tipo</th><th class="text-left p-2">Concepto</th><th class="text-right p-2">Proy.</th><th class="text-right p-2">Real</th><th class="p-2"></th></tr></thead>
        <tbody>${draft.income.map(i => html`<tr key=${i.id}>
          <td class="p-2"><${Select} small value=${i.type} onChange=${e => setSub('income', i.id, { type: e.target.value })} options=${INCOME_TYPES} /></td>
          <td class="p-2"><${Input} small value=${i.concept} onInput=${e => setSub('income', i.id, { concept: e.target.value })} /></td>
          <td class="p-2"><${Input} small type="number" value=${i.projected} onInput=${e => setSub('income', i.id, { projected: Number(e.target.value) })} /></td>
          <td class="p-2"><${Input} small type="number" value=${i.real} onInput=${e => setSub('income', i.id, { real: Number(e.target.value) })} /></td>
          <td class="p-2"><button onClick=${() => rmSub('income', i.id)} class="text-red-600 text-sm">×</button></td>
        </tr>`)}</tbody>
      </table>
      <${Button} small variant="secondary" onClick=${() => addSub('income', { type: 'Tickets', concept: '', projected: 0, real: 0 })}>+ Añadir ingreso<//>
      <div class="font-semibold text-slate-800 mb-2 mt-6">Costos</div>
      <table class="w-full text-sm mb-4">
        <thead class="bg-slate-100"><tr><th class="text-left p-2">Tipo</th><th class="text-left p-2">Concepto</th><th class="text-right p-2">Proy.</th><th class="text-right p-2">Real</th><th class="p-2"></th></tr></thead>
        <tbody>${draft.costs.map(c => html`<tr key=${c.id}>
          <td class="p-2"><${Select} value=${c.type} onChange=${e => setSub('costs', c.id, { type: e.target.value })} options=${COST_TYPES} /></td>
          <td class="p-2"><${Input} value=${c.concept} onInput=${e => setSub('costs', c.id, { concept: e.target.value })} /></td>
          <td class="p-2"><${Input} type="number" value=${c.projected} onInput=${e => setSub('costs', c.id, { projected: Number(e.target.value) })} /></td>
          <td class="p-2"><${Input} type="number" value=${c.real} onInput=${e => setSub('costs', c.id, { real: Number(e.target.value) })} /></td>
          <td class="p-2"><button onClick=${() => rmSub('costs', c.id)} class="text-red-600 text-sm">×</button></td>
        </tr>`)}</tbody>
      </table>
      <${Button} small variant="secondary" onClick=${() => addSub('costs', { type: 'Otros', concept: '', projected: 0, real: 0 })}>+ Añadir costo<//>
    `}
    ${tab === 'Checklist' && html`
      <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
        ${draft.checklist.map(item => html`<div key=${item.id} class="flex items-start gap-3 p-3 border border-slate-200 rounded-lg ${item.done ? 'bg-slate-50' : 'bg-white'}">
          <input type="checkbox" checked=${item.done} onChange=${() => toggleTask(item.id)} class="mt-1" />
          <div class="flex-1">
            <div class="text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}">${item.text}</div>
            <${Input} small value=${item.notes || ''} onInput=${e => setTaskNote(item.id, e.target.value)} placeholder="Notas / responsable" />
          </div>
        </div>`)}
      </div>
    `}
    <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
      ${!isNew ? html`<${Button} variant="danger" small onClick=${remove}>Eliminar<//>` : html`<div></div>`}
      <div class="flex gap-2">
        <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
        <${Button} onClick=${save}>${isNew ? 'Crear proyecto' : 'Guardar'}<//>
      </div>
    </div>
  <//>`;
};

export const OpportunityModal = ({ opportunity, state, setState, onClose }) => {
  const isNew = !opportunity;
  const [draft, setDraft] = useState(isNew ? newOpportunity() : JSON.parse(JSON.stringify(opportunity)));
  const set = (obj) => setDraft(d => ({ ...d, ...obj }));

  const save = () => {
    const updated = { ...draft, updatedAt: today() };
    if (isNew) {
      setState(s => ({
        ...s,
        opportunities: [...s.opportunities, updated],
        activities: [{ id: makeId(), text: `Lead creado: ${updated.company}`, date: today() }, ...s.activities]
      }));
    } else {
      setState(s => ({
        ...s,
        opportunities: s.opportunities.map(o => o.id === updated.id ? updated : o),
        activities: [{ id: makeId(), text: `Oportunidad actualizada: ${updated.company}`, date: today() }, ...s.activities]
      }));
    }
    onClose();
  };

  const remove = () => {
    if (!yes('¿Eliminar esta oportunidad?')) return;
    setState(s => ({ ...s, opportunities: s.opportunities.filter(o => o.id !== draft.id) }));
    onClose();
  };

  const contactChange = (id) => {
    const c = state.contacts.find(x => x.id === id);
    set({ contactId: id, contact: c ? c.name : '' });
  };

  return html`<${Modal} title=${isNew ? 'Nueva oportunidad' : draft.company} onClose=${onClose} size="max-w-2xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <${Field} label="Empresa"><${Input} value=${draft.company} onInput=${e => set({ company: e.target.value })} /><//>
      <${ContactPicker} label="Contacto" value=${draft.contactId} contacts=${state.contacts} onChange=${contactChange} />
      <${Field} label="Tipo de oportunidad"><${Input} value=${draft.type} onInput=${e => set({ type: e.target.value })} /><//>
      <${Field} label="Valor estimado"><${Input} type="number" value=${draft.value} onInput=${e => set({ value: Number(e.target.value) })} /><//>
      <${Field} label="Fecha estimada"><${Input} type="date" value=${draft.estimatedDate} onInput=${e => set({ estimatedDate: e.target.value })} /><//>
      <${Field} label="Etapa"><${Select} value=${draft.stage} onChange=${e => set({ stage: e.target.value })} options=${PIPELINE_STAGES} /><//>
      <${Field} label="Responsable"><${Input} value=${draft.responsible} onInput=${e => set({ responsible: e.target.value })} /><//>
      <${Field} label="Próxima acción"><${Input} value=${draft.nextAction} onInput=${e => set({ nextAction: e.target.value })} /><//>
      <${Field} label="Fecha próxima acción"><${Input} type="date" value=${draft.nextActionDate} onInput=${e => set({ nextActionDate: e.target.value })} /><//>
      <div class="md:col-span-2"><${Field} label="Notas"><${TextArea} value=${draft.notes} onInput=${e => set({ notes: e.target.value })} rows="3" /><//></div>
      <div class="md:col-span-2"><${Field} label="Historial (líneas)"><${TextArea} value=${arrToText(draft.history)} onInput=${e => set({ history: arrFromText(e.target.value) })} rows="3" /><//></div>
    </div>
    <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
      ${!isNew ? html`<${Button} variant="danger" small onClick=${remove}>Eliminar<//>` : html`<div></div>`}
      <div class="flex gap-2">
        <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
        <${Button} onClick=${save}>${isNew ? 'Crear oportunidad' : 'Guardar'}<//>
      </div>
    </div>
  <//>`;
};

export const ContactModal = ({ contact, setState, onClose }) => {
  const isNew = !contact;
  const [draft, setDraft] = useState(isNew ? newContact() : JSON.parse(JSON.stringify(contact)));
  const set = (obj) => setDraft(d => ({ ...d, ...obj }));

  const save = () => {
    if (isNew) {
      setState(s => ({ ...s, contacts: [...s.contacts, draft], activities: [{ id: makeId(), text: `Contacto creado: ${draft.name}`, date: today() }, ...s.activities] }));
    } else {
      setState(s => ({ ...s, contacts: s.contacts.map(c => c.id === draft.id ? draft : c), activities: [{ id: makeId(), text: `Contacto actualizado: ${draft.name}`, date: today() }, ...s.activities] }));
    }
    onClose();
  };
  const remove = () => {
    if (!yes('¿Eliminar contacto?')) return;
    setState(s => ({ ...s, contacts: s.contacts.filter(c => c.id !== draft.id) }));
    onClose();
  };

  return html`<${Modal} title=${isNew ? 'Nuevo contacto' : draft.name} onClose=${onClose} size="max-w-2xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <${Field} label="Nombre"><${Input} value=${draft.name} onInput=${e => set({ name: e.target.value })} /><//>
      <${Field} label="Categoría"><${Select} value=${draft.category} onChange=${e => set({ category: e.target.value })} options=${CONTACT_CATEGORIES} /><//>
      <${Field} label="Email"><${Input} type="email" value=${draft.email} onInput=${e => set({ email: e.target.value })} /><//>
      <${Field} label="Teléfono"><${Input} value=${draft.phone} onInput=${e => set({ phone: e.target.value })} /><//>
      <${Field} label="Empresa"><${Input} value=${draft.company} onInput=${e => set({ company: e.target.value })} /><//>
      <${Field} label="Rol"><${Input} value=${draft.role} onInput=${e => set({ role: e.target.value })} /><//>
      <div class="md:col-span-2"><${Field} label="Notas"><${TextArea} value=${draft.notes} onInput=${e => set({ notes: e.target.value })} rows="3" /><//></div>
    </div>
    <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
      ${!isNew ? html`<${Button} variant="danger" small onClick=${remove}>Eliminar<//>` : html`<div></div>`}
      <div class="flex gap-2">
        <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
        <${Button} onClick=${save}>${isNew ? 'Crear contacto' : 'Guardar'}<//>
      </div>
    </div>
  <//>`;
};

export const DocumentModal = ({ document: doc, state, setState, onClose }) => {
  const isNew = !doc;
  const [draft, setDraft] = useState(isNew ? newDocument() : JSON.parse(JSON.stringify(doc)));
  const set = (obj) => setDraft(d => ({ ...d, ...obj }));

  const save = () => {
    if (isNew) {
      setState(s => ({ ...s, documents: [...s.documents, draft], activities: [{ id: makeId(), text: `Documento añadido: ${draft.name}`, date: today() }, ...s.activities] }));
    } else {
      setState(s => ({ ...s, documents: s.documents.map(d => d.id === draft.id ? draft : d), activities: [{ id: makeId(), text: `Documento actualizado: ${draft.name}`, date: today() }, ...s.activities] }));
    }
    onClose();
  };
  const remove = () => {
    if (!yes('¿Eliminar documento?')) return;
    setState(s => ({ ...s, documents: s.documents.filter(d => d.id !== draft.id) }));
    onClose();
  };

  const projectOptions = useMemo(() => [{ name: '— Sin proyecto —', id: '' }].concat(state.projects), [state.projects]);

  return html`<${Modal} title=${isNew ? 'Nuevo documento' : draft.name} onClose=${onClose} size="max-w-2xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <${Field} label="Nombre"><${Input} value=${draft.name} onInput=${e => set({ name: e.target.value })} /><//>
      <${Field} label="Proyecto"><${Select} value=${draft.projectId} onChange=${e => set({ projectId: e.target.value })} options=${projectOptions.map(p => p.name)} />
      <//>
      <${Field} label="Tipo"><${Select} value=${draft.type} onChange=${e => set({ type: e.target.value })} options=${DOC_TYPES} /><//>
      <${Field} label="URL / referencia"><${Input} value=${draft.url} onInput=${e => set({ url: e.target.value })} placeholder="Enlace, carpeta, ID..." /><//>
      <div class="md:col-span-2"><${Field} label="Notas"><${TextArea} value=${draft.notes} onInput=${e => set({ notes: e.target.value })} rows="3" /><//></div>
    </div>
    <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
      ${!isNew ? html`<${Button} variant="danger" small onClick=${remove}>Eliminar<//>` : html`<div></div>`}
      <div class="flex gap-2">
        <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
        <${Button} onClick=${save}>${isNew ? 'Crear documento' : 'Guardar'}<//>
      </div>
    </div>
  <//>`;
};

export const MarketingModal = ({ campaign, state, setState, onClose }) => {
  const isNew = !campaign;
  const [draft, setDraft] = useState(isNew ? newMarketingCampaign() : JSON.parse(JSON.stringify(campaign)));
  const set = (obj) => setDraft(d => ({ ...d, ...obj }));

  const save = () => {
    if (isNew) {
      setState(s => ({ ...s, marketingCampaigns: [...s.marketingCampaigns, draft], activities: [{ id: makeId(), text: `Campaña creada: ${draft.name}`, date: today() }, ...s.activities] }));
    } else {
      setState(s => ({ ...s, marketingCampaigns: s.marketingCampaigns.map(c => c.id === draft.id ? draft : c), activities: [{ id: makeId(), text: `Campaña actualizada: ${draft.name}`, date: today() }, ...s.activities] }));
    }
    onClose();
  };
  const remove = () => {
    if (!yes('¿Eliminar campaña?')) return;
    setState(s => ({ ...s, marketingCampaigns: s.marketingCampaigns.filter(c => c.id !== draft.id) }));
    onClose();
  };

  const projectOptions = useMemo(() => [{ name: '— Sin proyecto —', id: '' }].concat(state.projects), [state.projects]);

  return html`<${Modal} title=${isNew ? 'Nueva campaña' : draft.name} onClose=${onClose} size="max-w-3xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <${Field} label="Nombre"><${Input} value=${draft.name} onInput=${e => set({ name: e.target.value })} /><//>
      <${Field} label="Proyecto"><${Select} value=${draft.projectId} onChange=${e => set({ projectId: e.target.value })} options=${projectOptions.map(p => p.name)} />
      <//>
      <div class="md:col-span-2"><${Field} label="Objetivo"><${Input} value=${draft.objective} onInput=${e => set({ objective: e.target.value })} /><//></div>
      <${Field} label="Público"><${Input} value=${draft.audience} onInput=${e => set({ audience: e.target.value })} /><//>
      <${Field} label="Fecha de lanzamiento"><${Input} type="date" value=${draft.launchDate} onInput=${e => set({ launchDate: e.target.value })} /><//>
      <${Field} label="Canales"><${Input} value=${draft.channels} onInput=${e => set({ channels: e.target.value })} placeholder="Instagram, TikTok, email..." /><//>
      <${Field} label="Piezas necesarias"><${Input} value=${draft.pieces} onInput=${e => set({ pieces: e.target.value })} placeholder="Cartel, stories, reels..." /><//>
      <${Field} label="Estado"><${Input} value=${draft.status} onInput=${e => set({ status: e.target.value })} /><//>
      <div class="md:col-span-2"><${Field} label="Copy"><${TextArea} value=${draft.copy} onInput=${e => set({ copy: e.target.value })} rows="2" /><//></div>
      <${Field} label="CTA"><${Input} value=${draft.cta} onInput=${e => set({ cta: e.target.value })} /><//>
      <${Field} label="Assets"><${Input} value=${draft.assets} onInput=${e => set({ assets: e.target.value })} placeholder="Carteles, vídeos, fotos..." /><//>
      <div class="md:col-span-2"><${Field} label="Resultados"><${TextArea} value=${draft.results} onInput=${e => set({ results: e.target.value })} rows="2" /><//></div>
    </div>
    <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
      ${!isNew ? html`<${Button} variant="danger" small onClick=${remove}>Eliminar<//>` : html`<div></div>`}
      <div class="flex gap-2">
        <${Button} variant="ghost" onClick=${onClose}>Cancelar<//>
        <${Button} onClick=${save}>${isNew ? 'Crear campaña' : 'Guardar'}<//>
      </div>
    </div>
  <//>`;
};
