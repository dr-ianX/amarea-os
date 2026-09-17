// BUSINESS LOGIC layer: calculations, alerts, automations

import { buildChecklist, newProject } from './data.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function toDate(str) {
  return new Date(str + 'T00:00:00');
}

export function daysUntil(dateStr, from = new Date()) {
  const d = toDate(dateStr);
  const diff = d - new Date(from.toISOString().slice(0, 10) + 'T00:00:00');
  return Math.round(diff / MS_PER_DAY);
}

export function formatCurrency(value, currency = '€') {
  if (value === '' || value == null) return '-';
  const n = Number(value) || 0;
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }).replace('EUR', currency);
}

export function financials(project) {
  const pIn = (project.income || []).reduce((s, i) => s + (Number(i.projected) || 0), 0);
  const rIn = (project.income || []).reduce((s, i) => s + (Number(i.real) || 0), 0);
  const pCo = (project.costs || []).reduce((s, c) => s + (Number(c.projected) || 0), 0);
  const rCo = (project.costs || []).reduce((s, c) => s + (Number(c.real) || 0), 0);
  const pRe = pIn - pCo;
  const rRe = rIn - rCo;
  const pMa = pIn > 0 ? (pRe / pIn) * 100 : 0;
  const rMa = rIn > 0 ? (rRe / rIn) * 100 : 0;
  return {
    projectedIncome: pIn,
    realIncome: rIn,
    projectedCost: pCo,
    realCost: rCo,
    projectedResult: pRe,
    realResult: rRe,
    projectedMargin: pMa,
    realMargin: rMa
  };
}

export function summary(state, now = new Date()) {
  const active = state.projects.filter(p => p.status !== 'FINALIZADO');
  const fin = state.projects.map(financials);
  const totals = {
    activeProjects: active.length,
    finalizedProjects: state.projects.filter(p => p.status === 'FINALIZADO').length,
    activeLeads: state.opportunities.filter(o => o.stage !== 'GANADO' && o.stage !== 'PERDIDO').length,
    pendingProposals: state.opportunities.filter(o => o.stage === 'PROPUESTA' || o.stage === 'NEGOCIACIÓN').length,
    wonValue: state.opportunities.filter(o => o.stage === 'GANADO').reduce((s, o) => s + (Number(o.value) || 0), 0),
    projectedIncome: fin.reduce((s, f) => s + f.projectedIncome, 0),
    realIncome: fin.reduce((s, f) => s + f.realIncome, 0),
    projectedCost: fin.reduce((s, f) => s + f.projectedCost, 0),
    realCost: fin.reduce((s, f) => s + f.realCost, 0)
  };
  totals.projectedResult = totals.projectedIncome - totals.projectedCost;
  totals.realResult = totals.realIncome - totals.realCost;
  totals.projectedMargin = totals.projectedIncome > 0 ? (totals.projectedResult / totals.projectedIncome) * 100 : 0;
  return totals;
}

export function alertList(state, now = new Date()) {
  const alerts = [];
  const todayStr = now.toISOString().slice(0, 10);

  state.projects.forEach(p => {
    const d = daysUntil(p.date, now);
    const fin = financials(p);

    if (p.status === 'FINALIZADO') {
      if (!p.postmortem || p.postmortem.trim() === '') {
        alerts.push({
          id: `pm-${p.id}`,
          type: 'postmortem',
          level: 'medium',
          text: `${p.name}: iniciar cierre financiero y postmortem`,
          date: todayStr
        });
      }
      return;
    }

    if (d <= 30 && d > 14) {
      alerts.push({ id: `a30-${p.id}`, type: 'production', level: 'info', text: `${p.name}: faltan 30 días. Revisar producción.`, date: p.date });
    }
    if (d <= 14 && d > 7) {
      alerts.push({ id: `a14-${p.id}`, type: 'suppliers', level: 'low', text: `${p.name}: faltan 14 días. Revisión de proveedores.`, date: p.date });
    }
    if (d <= 7 && d > 3) {
      alerts.push({ id: `a7-${p.id}`, type: 'checklist', level: 'medium', text: `${p.name}: faltan 7 días. Checklist final.`, date: p.date });
    }
    if (d <= 3 && d > 1) {
      alerts.push({ id: `a3-${p.id}`, type: 'critical', level: 'high', text: `${p.name}: faltan 3 días. Últimos detalles.`, date: p.date });
    }
    if (d <= 1 && d >= 0) {
      alerts.push({ id: `a1-${p.id}`, type: 'critical', level: 'high', text: `${p.name}: ¡evento mañana! Alerta crítica.`, date: p.date });
    }
    if (d < 0) {
      alerts.push({ id: `a0-${p.id}`, type: 'critical', level: 'high', text: `${p.name}: evento finalizado. Iniciar cierre.`, date: p.date });
    }

    (p.checklist || []).forEach(item => {
      if (!item.done) {
        alerts.push({
          id: `task-${p.id}-${item.id}`,
          type: 'task',
          level: d <= 7 ? 'high' : 'medium',
          text: `${p.name}: ${item.text}`,
          date: p.date
        });
      }
    });

    const margin = fin.projectedMargin;
    if (margin < 10) {
      alerts.push({
        id: `margin-${p.id}`,
        type: 'finance',
        level: 'high',
        text: `${p.name}: margen proyectado bajo (${margin.toFixed(1)}%)`,
        date: todayStr
      });
    }
  });

  state.opportunities.forEach(o => {
    const d = daysUntil(o.nextActionDate, now);
    if (d <= 2 && o.stage !== 'GANADO' && o.stage !== 'PERDIDO') {
      alerts.push({
        id: `opp-${o.id}`,
        type: 'followup',
        level: d < 0 ? 'high' : 'medium',
        text: `${o.company}: ${o.nextAction}`,
        date: o.nextActionDate
      });
    }
    if (o.stage === 'PROPUESTA' && daysUntil(o.nextActionDate, now) > 2) {
      alerts.push({
        id: `opp-proposal-${o.id}`,
        type: 'followup',
        level: 'low',
        text: `${o.company}: preparar seguimiento de propuesta`,
        date: o.nextActionDate
      });
    }
  });

  return alerts.sort((a, b) => (a.level === 'high' ? -1 : 1) - (b.level === 'high' ? -1 : 1) || daysUntil(a.date, now) - daysUntil(b.date, now));
}

export function calendarEvents(state, now = new Date()) {
  const events = [];

  state.projects.forEach(p => {
    events.push({
      id: `evt-${p.id}`,
      date: p.date,
      title: p.name,
      type: 'Evento',
      projectId: p.id
    });

    const offsets = [30, 14, 7, 3, 1];
    offsets.forEach(offset => {
      const d = new Date(p.date + 'T00:00:00');
      d.setDate(d.getDate() - offset);
      events.push({
        id: `m-${offset}-${p.id}`,
        date: d.toISOString().slice(0, 10),
        title: `${p.name}: ${offset} días antes`,
        type: 'Hito producción',
        projectId: p.id
      });
    });

    const close = new Date(p.date + 'T00:00:00');
    close.setDate(close.getDate() + 1);
    events.push({
      id: `close-${p.id}`,
      date: close.toISOString().slice(0, 10),
      title: `${p.name}: cierre posterior`,
      type: 'Cierre',
      projectId: p.id
    });
  });

  state.opportunities.forEach(o => {
    events.push({
      id: `oppn-${o.id}`,
      date: o.nextActionDate,
      title: `${o.company}: ${o.nextAction}`,
      type: 'Follow-up',
      opportunityId: o.id
    });
  });

  state.marketingCampaigns.forEach(c => {
    events.push({
      id: `mkt-${c.id}`,
      date: c.launchDate,
      title: `${c.name}: lanzamiento`,
      type: 'Marketing',
      projectId: c.projectId
    });
  });

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function convertOpportunityToProject(opportunity, state) {
  const now = new Date().toISOString().slice(0, 10);
  const contact = state.contacts.find(c => c.id === opportunity.contactId);
  const project = newProject(undefined, {
    name: `${opportunity.company} — ${opportunity.type}`,
    concept: opportunity.notes || '',
    status: 'PREPRODUCCIÓN',
    client: contact ? contact.name : opportunity.contact,
    clientId: contact ? contact.id : '',
    date: opportunity.estimatedDate,
    projectedIncome: Number(opportunity.value) || 0,
    responsible: opportunity.responsible,
    notes: `Convertido desde oportunidad ${opportunity.company}. Historial: ${opportunity.history.join(' / ')}`
  });
  return project;
}

export function projectNameById(state, id) {
  const p = state.projects.find(x => x.id === id);
  return p ? p.name : '';
}

export function contactNameById(state, id) {
  const c = state.contacts.find(x => x.id === id);
  return c ? c.name : '';
}
