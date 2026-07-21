const Calendar = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),

  async render() {
    const [receipts, contracts, events, leads] = await Promise.all([
      db.getAll('receipts'),
      db.getAll('contracts'),
      db.getAll('events'),
      db.getAll('leads'),
    ]);

    const month = this.currentMonth;
    const year = this.currentYear;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const monthName = Utils.months[month];

    const allEvents = [];

    receipts.forEach(r => {
      if (r.dueDate && r.status !== 'pago') {
        allEvents.push({ date: new Date(r.dueDate), type: 'due', title: `Vencimento: R$ ${r.amount}`, id: r.id });
      }
    });

    contracts.forEach(c => {
      if (c.endDate) {
        allEvents.push({ date: new Date(c.endDate), type: 'contract', title: `Término contrato #${c.id}`, id: c.id });
      }
    });

    leads.forEach(l => {
      if (l.contactDate && l.status !== 'alugado' && l.status !== 'perdido') {
        allEvents.push({ date: new Date(l.contactDate), type: 'visit', title: `Visita: ${l.name}`, id: l.id });
      }
    });

    events.forEach(e => {
      if (e.date) {
        allEvents.push({ date: new Date(e.date), type: e.type || 'event', title: e.title, id: e.id });
      }
    });

    const dayEvents = {};
    allEvents.forEach(e => {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`;
      if (!dayEvents[key]) dayEvents[key] = [];
      dayEvents[key].push(e);
    });

    let days = '';
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrev - firstDay + 1 + i;
      days += `<div class="calendar-day other-month">${day}</div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${month}-${d}`;
      const evts = dayEvents[key] || [];
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const hasEvent = evts.length > 0;
      const eventTypes = evts.map(e => e.type).join(' ');
      const tooltip = evts.map(e => e.title).join('\n');

      days += `<div class="calendar-day${isToday ? ' today' : ''}${hasEvent ? ' has-event ' + eventTypes : ''}" title="${tooltip}" onclick="Calendar.showDayEvents(${d})">${d}</div>`;
    }

    const remaining = 7 - ((firstDay + daysInMonth) % 7 || 7);
    for (let i = 1; i <= remaining; i++) {
      days += `<div class="calendar-day other-month">${i}</div>`;
    }

    const headerDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => `<div class="calendar-header">${d}</div>`).join('');

    const html = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h2>📅 Agenda - ${monthName} ${year}</h2>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm btn-ghost" onclick="Calendar.changeMonth(-1)">←</button>
          <button class="btn btn-sm btn-ghost" onclick="Calendar.changeMonth(1)">→</button>
          <button class="btn btn-sm btn-primary" onclick="Calendar.openEventForm()">+ Evento</button>
        </div>
      </div>
      <div class="card">
        <div class="calendar-grid">${headerDays}${days}</div>
      </div>
      <div style="display:flex;gap:16px;margin-top:16px;font-size:12px;color:var(--text-secondary);">
        <span>🔴 Vencimentos</span>
        <span>🟢 Visitas</span>
        <span>🔵 Contratos</span>
      </div>
      <div id="dayEvents" style="margin-top:16px;"></div>
    `;

    return { html };
  },

  changeMonth(delta) {
    this.currentMonth += delta;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    Router.navigate('calendar');
  },

  async showDayEvents(day) {
    const container = document.getElementById('dayEvents');
    if (!container) return;
    const date = new Date(this.currentYear, this.currentMonth, day);
    const dateStr = date.toLocaleDateString('pt-BR');
    container.innerHTML = `<h4 style="margin-bottom:8px;">Eventos de ${dateStr}</h4><p style="color:var(--text-muted);font-size:13px;">Nenhum evento neste dia.</p>`;
  },

  async openEventForm(id) {
    const e = id ? await db.getById('events', id) : {};
    const fields = buildForm([
      { type: 'grid', fields: [
        formField('Título', 'title', 'text', { value: e.title || '', required: true }),
        formField('Tipo', 'type', 'select', { value: e.type || 'event', options: [['due','Vencimento'],['visit','Visita'],['contract','Contrato'],['maintenance','Manutenção'],['collection','Cobrança'],['event','Outro']] }),
      ]},
      { type: 'grid', fields: [
        formField('Data', 'date', 'date', { value: e.date ? Utils.formatDateISO(e.date) : Utils.formatDateISO(new Date().toISOString()) }),
      ]},
      formField('Descrição', 'description', 'textarea', { value: e.description || '', className: 'full' }),
    ]);

    showModal(id ? 'Editar Evento' : 'Novo Evento', fields, {
      buttons: [
        { label: 'Cancelar', cls: 'btn-ghost' },
        { label: id ? 'Salvar' : 'Criar', cls: 'btn-primary', action: async () => {
          const data = getFormData(['title','type','date','description']);
          if (!data.title) { showToast('Informe o título.', 'error'); return; }
          if (id) { data.id = Number(id); await db.put('events', data); }
          else { await db.add('events', data); }
          closeModal();
          showToast('Evento salvo!');
          Router.navigate('calendar');
        }},
      ],
    });
  },
};
