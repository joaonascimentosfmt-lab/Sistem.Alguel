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
    return `<div class="empty-state"><div class="icon">📭</div><h3>${emptyMsg}</h3></div>`;
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
