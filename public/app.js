// APP ENTRY — orchestrates DATA / UI / MODALS

import { html } from 'htm/preact';
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
import { loadState, saveState } from './data.js';
import { Sidebar } from './components.js';
import { Dashboard, Projects, Pipeline, Calendar, Finance, Contacts, Documents, Marketing, Uploads, Chat, Analytics, Settings } from './pages.js';
import { LosCabosMarketing } from './los_cabos_marketing.js';
import { ProjectModal, OpportunityModal, ContactModal, DocumentModal, MarketingModal } from './modals.js';

const VIEWS = {
  dashboard: Dashboard,
  projects: Projects,
  pipeline: Pipeline,
  calendar: Calendar,
  finance: Finance,
  contacts: Contacts,
  documents: Documents,
  marketing: Marketing,
  uploads: Uploads,
  chat: Chat,
  analytics: Analytics,
  loscabos: LosCabosMarketing,
  settings: Settings
};

const findRecord = (state, type, id) => {
  if (type === 'project') return state.projects.find(p => p.id === id) || null;
  if (type === 'opportunity') return state.opportunities.find(o => o.id === id) || null;
  if (type === 'contact') return state.contacts.find(c => c.id === id) || null;
  if (type === 'document') return state.documents.find(d => d.id === id) || null;
  if (type === 'marketing') return state.marketingCampaigns.find(c => c.id === id) || null;
  return null;
};

const App = () => {
  const [state, setState] = useState(loadState());
  const [view, setView] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', (state.ui || {}).theme === 'dark');
  }, [state.ui]);

  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(t);
  }, []);


  const close = () => setModal(null);
  const View = VIEWS[view] || Dashboard;
  const item = modal ? findRecord(state, modal.type, modal.id) : null;

  const renderModal = () => {
    if (!modal) return null;
    switch (modal.type) {
      case 'project':
        return html`<${ProjectModal} project=${item} state=${state} setState=${setState} onClose=${close} />`;
      case 'opportunity':
        return html`<${OpportunityModal} opportunity=${item} state=${state} setState=${setState} onClose=${close} />`;
      case 'contact':
        return html`<${ContactModal} contact=${item} setState=${setState} onClose=${close} />`;
      case 'document':
        return html`<${DocumentModal} document=${item} state=${state} setState=${setState} onClose=${close} />`;
      case 'marketing':
        return html`<${MarketingModal} campaign=${item} state=${state} setState=${setState} onClose=${close} />`;
      default:
        return null;
    }
  };

  const Banner = () => html`
    <div class="mike-banner pink-glitter" onClick=${() => setShowBanner(false)}>
      <div class="banner-box" onClick=${e => e.stopPropagation()}>
        <span class="sparkle" style="top:-1rem;left:-1rem;animation-delay:0s">✨</span>
        <span class="sparkle" style="top:-1rem;right:-1rem;animation-delay:0.3s">💖</span>
        <span class="sparkle" style="bottom:-1rem;left:-1rem;animation-delay:0.6s">🌈</span>
        <span class="sparkle" style="bottom:-1rem;right:-1rem;animation-delay:0.9s">✨</span>
        <div class="text-3xl sm:text-5xl font-black pink-text mb-2">HOLA MIKE</div>
        <div class="text-xl sm:text-3xl font-black pink-text mb-4">TE AMAMOS</div>
        <button onClick=${() => setShowBanner(false)} class="px-5 py-2 rounded-full bg-pink-600 text-white text-sm font-bold shadow-lg hover:bg-pink-500">Entrar al glitter ✨</button>
      </div>
    </div>
  `;

  return html`
    ${showBanner && html`<${Banner} />`}
    <div class="min-h-screen flex flex-col lg:flex-row">
      <${Sidebar} view=${view} setView=${setView} orgName=${state.org.name} />
      <main class="flex-1 p-4 lg:p-8 lg:ml-64">
        <div class="mb-4 glitter-bg gay-border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="rainbow-text font-bold text-sm flex items-center gap-2">
            <span class="sparkle">✨</span>
            AMAREA OS v0.1 — HECHO CON GLITTER PARA MIKE
            <span class="sparkle">✨</span>
          </div>
          <div class="text-xs text-slate-400">datos DEMO · Guardado en local</div>
        </div>
        <${View} state=${state} setState=${setState} setView=${setView} setModal=${setModal} />
      </main>
      ${renderModal()}
    </div>
  `;
};

render(html`<${App} />`, document.getElementById('app'));
