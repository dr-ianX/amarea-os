// UI COMPONENTS

import { html } from 'htm/preact';
import { useState, useMemo } from 'preact/hooks';
import { formatCurrency } from './logic.js';

export const Button = ({ children, onClick, variant = 'primary', small = false, className = '' }) => {
  const colors = {
    primary: 'bg-amarea-600 hover:bg-amarea-700 text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600'
  };
  const size = small ? 'px-2 py-1 text-xs rounded' : 'px-4 py-2 rounded-lg text-sm font-medium';
  return html`<button onClick=${onClick} class="${colors[variant]} ${size} transition ${className}">${children}</button>`;
};

export const Input = ({ value, onInput, onKeyDown, type = 'text', placeholder = '', className = '' }) =>
  html`<input type=${type} value=${value == null ? '' : value} onInput=${onInput} onKeyDown=${onKeyDown} placeholder=${placeholder} class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amarea-500 focus:outline-none focus:ring-1 focus:ring-amarea-500 ${className}" />`;

export const Select = ({ value, onChange, options, className = '' }) =>
  html`<select value=${value == null ? '' : value} onChange=${onChange} class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amarea-500 focus:outline-none focus:ring-1 focus:ring-amarea-500 ${className}">${options.map(o => {
    const isString = typeof o === 'string';
    const v = isString ? o : (o.id || o.name || '');
    const label = isString ? o : (o.name || o.label || o.value || o.id || o);
    return html`<option value=${v}>${label}</option>`;
  })}</select>`;

export const ContactPicker = ({ value, contacts, onChange, label, category }) => {
  const options = useMemo(() =>
    [{ name: '— Ninguno / manual —', id: '' }].concat(contacts.filter(c => !category || c.category === category)),
  [contacts, category]);
  return html`<${Field} label=${label}>
    <${Select} value=${value || ''} onChange=${e => onChange(e.target.value)} options=${options} />
  <//>`;
};

export const TextArea = ({ value, onInput, placeholder = '', rows = 3 }) =>
  html`<textarea value=${value == null ? '' : value} onInput=${onInput} placeholder=${placeholder} rows=${rows} class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amarea-500 focus:outline-none focus:ring-1 focus:ring-amarea-500" />`;

export const Field = ({ label, children, className = '' }) =>
  html`<div class="mb-4 ${className}"><label class="mb-1 block text-sm font-medium text-slate-700">${label}</label>${children}</div>`;

export const Card = ({ title, children, className = '', noPad }) =>
  html`<div class="bg-white rounded-xl shadow-sm border border-slate-200 hover-gay ${noPad ? '' : 'p-5'} ${className}">${title && html`<div class="mb-3 text-base font-semibold text-slate-800">${title}</div>`}${children}</div>`;

export const Modal = ({ title, onClose, children, size = 'max-w-4xl' }) =>
  html`<div class="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick=${onClose}>
    <div class="bg-white w-full ${size} rounded-2xl shadow-2xl mt-6 p-6 animate-fade-in" onClick=${e => e.stopPropagation()}>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-slate-900">${title}</h2>
        <button onClick=${onClose} class="text-2xl text-slate-400 hover:text-slate-700">×</button>
      </div>
      ${children}
    </div>
  </div>`;

const STATUS_COLORS = {
  IDEA: 'bg-slate-100 text-slate-700',
  PREPRODUCCIÓN: 'bg-blue-100 text-blue-700',
  CONFIRMADO: 'bg-emerald-100 text-emerald-700',
  'EN PRODUCCIÓN': 'bg-amber-100 text-amber-700',
  EVENTO: 'bg-purple-100 text-purple-700',
  CIERRE: 'bg-rose-100 text-rose-700',
  FINALIZADO: 'bg-green-100 text-green-700'
};

const STAGE_COLORS = {
  PROSPECTO: 'bg-slate-100 text-slate-700',
  CONTACTADO: 'bg-blue-100 text-blue-700',
  REUNIÓN: 'bg-indigo-100 text-indigo-700',
  PROPUESTA: 'bg-amber-100 text-amber-700',
  NEGOCIACIÓN: 'bg-orange-100 text-orange-700',
  GANADO: 'bg-emerald-100 text-emerald-700',
  PERDIDO: 'bg-red-100 text-red-700'
};

const LEVEL_COLORS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
  info: 'bg-slate-100 text-slate-700'
};

export const StatusBadge = ({ value }) =>
  html`<span class="badge ${STATUS_COLORS[value] || 'bg-slate-100 text-slate-700'}">${value}</span>`;

export const StageBadge = ({ value }) =>
  html`<span class="badge ${STAGE_COLORS[value] || 'bg-slate-100 text-slate-700'}">${value}</span>`;

export const LevelBadge = ({ level }) =>
  html`<span class="badge ${LEVEL_COLORS[level] || 'bg-slate-100 text-slate-700'}">${level}</span>`;

export const Currency = ({ value, currency = '€' }) =>
  html`<span class="font-medium tabular-nums">${formatCurrency(value, currency)}</span>`;

export const Tabs = ({ tabs, active, onChange }) =>
  html`<div class="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto">${tabs.map(t => html`<button onClick=${() => onChange(t)} class="px-4 py-2 text-sm font-medium whitespace-nowrap ${active === t ? 'border-b-2 border-amarea-600 text-amarea-700' : 'text-slate-500 hover:text-slate-700'}">${t}</button>`)}</div>`;

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '◆' },
  { id: 'projects', label: 'Proyectos', icon: '●' },
  { id: 'pipeline', label: 'Pipeline', icon: '▲' },
  { id: 'calendar', label: 'Calendario', icon: '■' },
  { id: 'finance', label: 'Finanzas', icon: '€' },
  { id: 'contacts', label: 'Contactos', icon: '○' },
  { id: 'documents', label: 'Documentos', icon: '▭' },
  { id: 'marketing', label: 'Marketing', icon: '!' },
  { id: 'uploads', label: 'Multimedia', icon: '▤' },
  { id: 'chat', label: 'Chat', icon: '✉' },
  { id: 'analytics', label: 'Análisis', icon: '◈' },
  { id: 'loscabos', label: 'Campaña Los Cabos', icon: '🌴' },
  { id: 'settings', label: 'Configuración', icon: '⚙' }
];

export const Sidebar = ({ view, setView, orgName }) => {
  const [open, setOpen] = useState(false);
  const items = MENU.map(m => html`<button
    onClick=${() => { setView(m.id); setOpen(false); }}
    class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover-gay ${view === m.id ? 'bg-amarea-50 text-amarea-700' : 'text-slate-600 hover:bg-slate-100'}"
  >
    <span class="w-5 text-center">${m.icon}</span>
    <span>${m.label}</span>
  </button>`);

  return html`
    <div>
      <div class="lg:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-20">
        <div class="font-bold rainbow-text text-lg">${orgName}</div>
        <button onClick=${() => setOpen(!open)} class="text-2xl text-slate-600">☰</button>
      </div>
      <aside class="${open ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white border-r border-slate-200 h-auto lg:h-screen lg:fixed lg:top-0 lg:left-0 lg:overflow-y-auto">
        <div class="p-5 border-b border-slate-200 hidden lg:block">
          <div class="text-2xl font-bold rainbow-text">${orgName}</div>
          <div class="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span class="sparkle">💖</span>
            OS para productoras · para MIKE
            <span class="sparkle">🌈</span>
          </div>
        </div>
        <nav class="p-3 space-y-1">${items}</nav>
      </aside>
    </div>
  `;
};

export const Empty = ({ text }) =>
  html`<div class="p-8 text-center text-slate-500 text-sm">${text}</div>`;

export const SectionHeader = ({ title, children }) =>
  html`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"><h1 class="text-2xl font-bold text-slate-900">${title}</h1><div class="flex items-center gap-2">${children}</div></div>`;

export const daysUntil = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.round((d - now) / (1000 * 60 * 60 * 24));
};
