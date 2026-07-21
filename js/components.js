const Icons = {
  svg: (path, viewBox = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">${path}</svg>`,
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21V11h6v10"/><path d="M15 21h6"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  file: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  dollar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  userPlus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  trendingUp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  trendingDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  creditCard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  inbox: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="44" height="44"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  alertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="44" height="44"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  refreshCw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
};

const Utils = {
  formatCurrency: (v) => `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  formatDate: (d) => { if (!d) return ''; const dt = new Date(d); return dt.toLocaleDateString('pt-BR'); },
  formatDateISO: (d) => { if (!d) return ''; return new Date(d).toISOString().split('T')[0]; },
  parseDate: (s) => { if (!s) return null; const [y, m, d] = s.split('-'); return new Date(+y, +m - 1, +d); },
  daysBetween: (a, b) => Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)),
  diffDays: (d) => { if (!d) return 0; const today = new Date(); today.setHours(0,0,0,0); const dt = new Date(d); dt.setHours(0,0,0,0); return Math.floor((dt - today) / (1000 * 60 * 60 * 24)); },
  truncate: (s, n = 40) => s && s.length > n ? s.substring(0, n) + '...' : s,
  capitalize: (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '',
  generateId: () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
  statusClass: (s) => {
    const map = { alugado: 'status-active', vago: 'status-vacant', reservado: 'status-pending', manutenção: 'status-maintenance', pago: 'status-paid', pendente: 'status-pending', atrasado: 'status-late', vencido: 'status-late' };
    return map[s?.toLowerCase()] || '';
  },
  statusLabel: (s) => {
    const map = { alugado: 'Alugado', vago: 'Vago', reservado: 'Reservado', manutenção: 'Manutenção', pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado', vencido: 'Vencido' };
    return map[s?.toLowerCase()] || s || '';
  },
  paymentMethodLabel: (m) => {
    const map = { pix: 'PIX', dinheiro: 'Dinheiro', cartao: 'Cartão', ted: 'TED', boleto: 'Boleto' };
    return map[m?.toLowerCase()] || m || '';
  },
  propertyTypeLabel: (t) => {
    const map = { kitnet: 'Kitnet', apartamento: 'Apartamento', casa: 'Casa', sala_comercial: 'Sala Comercial', terreno: 'Terreno' };
    return map[t?.toLowerCase()] || t || '';
  },
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
};

function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function showModal(title, bodyHtml, opts = {}) {
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('modalContainer');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const footerEl = document.getElementById('modalFooter');

  titleEl.textContent = title;
  bodyEl.innerHTML = bodyHtml;
  container.className = `modal${opts.large ? ' large' : ''}`;

  footerEl.innerHTML = '';
  if (opts.footer !== false) {
    if (opts.buttons) {
      opts.buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `btn ${b.cls || 'btn-primary'}`;
        btn.textContent = b.label;
        btn.onclick = () => { if (b.action) b.action(); if (b.close !== false) closeModal(); };
        footerEl.appendChild(btn);
      });
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost';
      btn.textContent = 'Fechar';
      btn.onclick = closeModal;
      footerEl.appendChild(btn);
    }
  }

  overlay.classList.remove('hidden');
  if (opts.onOpen) opts.onOpen();

  return { close: closeModal, body: bodyEl, footer: footerEl };
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function openModal(title, bodyHtml, buttons) {
  return showModal(title, bodyHtml, { buttons });
}

function confirmAction(msg, cb) {
  showModal('Confirmação', `<p>${msg}</p>`, {
    buttons: [
      { label: 'Cancelar', cls: 'btn-ghost' },
      { label: 'Confirmar', cls: 'btn-danger', action: cb },
    ]
  });
}

function renderCard(label, value, icon, opts = {}) {
  const cls = opts.className || '';
  const change = opts.change ? `<div class="card-change ${opts.changeDir || 'up'}">${opts.change}</div>` : '';
  return `<div class="card ${cls}">
    <div class="card-header">
      <span class="card-label">${label}</span>
      <span class="card-icon">${icon}</span>
    </div>
    <div class="card-value">${value}</div>
    ${change}
  </div>`;
}

function renderTable(headers, rows, emptyMsg = 'Nenhum registro encontrado.') {
  if (!rows || rows.length === 0) {
    return `<div class="empty-state"><div class="icon">${Icons.inbox}</div><h3>${emptyMsg}</h3></div>`;
  }
  const h = headers.map(h => `<th>${h}</th>`).join('');
  const r = rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrapper"><table><thead><tr>${h}</tr></thead><tbody>${r}</tbody></table></div>`;
}

function createSelect(options, selected, placeholder) {
  let html = '';
  if (placeholder) html += `<option value="">${placeholder}</option>`;
  options.forEach(([val, label]) => {
    html += `<option value="${val}"${val === selected ? ' selected' : ''}>${label}</option>`;
  });
  return html;
}

function formField(label, id, type = 'text', opts = {}) {
  const val = opts.value || '';
  const ph = opts.placeholder || '';
  const required = opts.required ? ' required' : '';
  const cls = opts.className || '';
  const extra = opts.extra || '';
  const hint = opts.hint ? `<span class="hint">${opts.hint}</span>` : '';

  if (type === 'textarea') {
    return `<div class="form-group full">
      <label for="${id}">${label}</label>
      <textarea id="${id}" ${required} ${extra}>${val}</textarea>
      ${hint}
    </div>`;
  }
  if (type === 'select') {
    const optsHtml = createSelect(opts.options || [], val, opts.placeholder);
    return `<div class="form-group ${cls}">
      <label for="${id}">${label}</label>
      <select id="${id}" ${required} ${extra}>${optsHtml}</select>
      ${hint}
    </div>`;
  }
  if (type === 'checkbox') {
    const checked = val ? ' checked' : '';
    return `<div class="form-group ${cls}">
      <label><input type="checkbox" id="${id}" ${checked} ${extra}> ${label}</label>
      ${hint}
    </div>`;
  }
  return `<div class="form-group ${cls}">
    <label for="${id}">${label}</label>
    <input type="${type}" id="${id}" value="${val}" placeholder="${ph}" ${required} ${extra}>
    ${hint}
  </div>`;
}

function formRow(...fields) {
  return `<div class="form-grid">${fields.join('\n')}</div>`;
}

function buildForm(sections) {
  return sections.map(s => {
    if (s.type === 'grid') {
      return `<div class="form-grid">${s.fields.join('\n')}</div>`;
    }
    if (s.type === 'html') return s.html;
    if (s.type === 'title') return `<h4 style="margin: 16px 0 8px;font-size:14px;color:var(--text-secondary);border-bottom:1px solid var(--border);padding-bottom:8px;">${s.label}</h4>`;
    return '';
  }).join('\n');
}

function emptyState(icon, title, msg, btnText, btnAction) {
  const btn = btnText ? `<button class="btn btn-primary" onclick="(${btnAction})()">${btnText}</button>` : '';
  return `<div class="empty-state"><div class="icon">${icon}</div><h3>${title}</h3><p>${msg}</p>${btn}</div>`;
}

function getFormData(ids) {
  const data = {};
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') data[id] = el.checked;
    else if (el.type === 'number') data[id] = el.value ? Number(el.value) : 0;
    else data[id] = el.value;
  });
  return data;
}

function debounce(fn, ms = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}
