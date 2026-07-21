const Finances = {
  tab: 'receipts',

  async render() {
    this.tab = document.getElementById('financeTab')?.value || this.tab;
    const [receipts, expenses, properties, contracts] = await Promise.all([
      db.getAll('receipts'),
      db.getAll('expenses'),
      db.getAll('properties'),
      db.getAll('contracts'),
    ]);

    const pMap = {}; properties.forEach(p => pMap[p.id] = p);

    const title = 'Financeiro';
    const tabs = `<div class="filter-bar" style="margin-bottom:16px;">
      <select id="financeTab" onchange="Finances.render()">
        <option value="receipts" ${this.tab === 'receipts' ? 'selected' : ''}>Receitas</option>
        <option value="expenses" ${this.tab === 'expenses' ? 'selected' : ''}>Despesas</option>
        <option value="cashflow" ${this.tab === 'cashflow' ? 'selected' : ''}>Fluxo de Caixa</option>
      </select>
      <button class="btn btn-primary" onclick="Finances.openForm('${this.tab}')">${Icons.plus} Nova ${this.tab === 'expenses' ? 'Despesa' : 'Receita'}</button>
    </div>`;

    if (this.tab === 'receipts') return this.renderReceipts(receipts, contracts, pMap, title, tabs);
    if (this.tab === 'expenses') return this.renderExpenses(expenses, pMap, title, tabs);
    return this.renderCashflow(receipts, expenses, title, tabs);
  },

  renderReceipts(receipts, contracts, pMap, title, tabs) {
    const cMap = {}; contracts.forEach(c => cMap[c.id] = c);

    if (receipts.length === 0) {
      return { html: `${tabs}${emptyState(Icons.trendingUp, 'Nenhuma receita registrada', 'Registre os pagamentos de aluguel dos inquilinos.', 'Nova Receita', '() => Finances.openForm(\"receipts\")')}` };
    }

    const headers = ['Descrição', 'Contrato', 'Valor', 'Vencimento', 'Status', 'Pagamento', 'Ações'];
    const rows = receipts.map(r => {
      const contrato = cMap[r.contractId];
      return [
        r.description || 'Aluguel',
        contrato ? `#${contrato.id}` : '-',
        Utils.formatCurrency(r.amount),
        Utils.formatDate(r.dueDate),
        `<span class="status ${Utils.statusClass(r.status)}">${Utils.statusLabel(r.status)}</span>`,
        r.status === 'pago' ? `${Utils.formatDate(r.paymentDate)} ${r.paymentMethod ? '/ ' + Utils.paymentMethodLabel(r.paymentMethod) : ''}` : '-',
        `<div class="actions">
          <button class="btn btn-sm btn-ghost" onclick="Finances.pay(${r.id})">${Icons.creditCard}</button>
          <button class="btn btn-sm btn-ghost" onclick="Finances.openForm('receipts', ${r.id})">${Icons.edit}</button>
          <button class="btn btn-sm btn-ghost" onclick="Finances.remove('receipts', ${r.id})">${Icons.trash}</button>
        </div>`,
      ];
    });

    return { html: `<div class="section-header"><h2>${title}</h2></div>${tabs}${renderTable(headers, rows, 'Nenhuma receita encontrada.')}` };
  },

  renderExpenses(expenses, pMap, title, tabs) {
    if (expenses.length === 0) {
      return { html: `${tabs}${emptyState(Icons.trendingDown, 'Nenhuma despesa registrada', 'Registre as despesas dos imóveis.', 'Nova Despesa', '() => Finances.openForm(\"expenses\")')}` };
    }

    const headers = ['Descrição', 'Imóvel', 'Tipo', 'Valor', 'Data', 'Ações'];
    const rows = expenses.map(e => [
      Utils.truncate(e.description, 25),
      pMap[e.propertyId]?.name || '-',
      Utils.capitalize(e.type || 'outro'),
      Utils.formatCurrency(e.amount),
      Utils.formatDate(e.date),
      `<div class="actions">
        <button class="btn btn-sm btn-ghost" onclick="Finances.openForm('expenses', ${e.id})">${Icons.edit}</button>
        <button class="btn btn-sm btn-ghost" onclick="Finances.remove('expenses', ${e.id})">${Icons.trash}</button>
      </div>`,
    ]);

    return { html: `<div class="section-header"><h2>${title}</h2></div>${tabs}${renderTable(headers, rows, 'Nenhuma despesa encontrada.')}` };
  },

  renderCashflow(receipts, expenses, title, tabs) {
    const months = {};
    const add = (items, type) => {
      items.forEach(item => {
        const d = new Date(item.dueDate || item.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!months[key]) months[key] = { receitas: 0, despesas: 0 };
        if (type === 'receita') months[key].receitas += Number(item.receivedAmount || item.amount || 0);
        else months[key].despesas += Number(item.amount || 0);
      });
    };
    add(receipts, 'receita');
    add(expenses, 'despesa');

    const keys = Object.keys(months).sort().slice(-12);
    const totalReceitas = keys.reduce((s, k) => s + months[k].receitas, 0);
    const totalDespesas = keys.reduce((s, k) => s + months[k].despesas, 0);
    const saldo = totalReceitas - totalDespesas;

    const html = `${tabs}
      <div class="cards-grid" style="margin-bottom:16px;">
        ${renderCard('Total Receitas', Utils.formatCurrency(totalReceitas), Icons.trendingUp)}
        ${renderCard('Total Despesas', Utils.formatCurrency(totalDespesas), Icons.trendingDown)}
        ${renderCard('Saldo', Utils.formatCurrency(saldo), Icons.dollar)}
      </div>
      <div class="chart-card"><h3>${Icons.dollar} Fluxo de Caixa</h3><canvas id="chartCashflow"></canvas></div>
      ${renderTable(['Período', 'Receitas', 'Despesas', 'Saldo'], keys.map(k => {
        const r = months[k].receitas, d = months[k].despesas;
        return [`${k}`, Utils.formatCurrency(r), Utils.formatCurrency(d), `<span style="color:${r-d>=0?'var(--success)':'var(--danger)'}">${Utils.formatCurrency(r-d)}</span>`];
      }))}`;

    return { html, after: () => {
      const ctx = document.getElementById('chartCashflow')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            { label: 'Receitas', data: keys.map(k => months[k].receitas), backgroundColor: 'rgba(34, 197, 94, 0.7)', borderRadius: 4 },
            { label: 'Despesas', data: keys.map(k => months[k].despesas), backgroundColor: 'rgba(239, 68, 68, 0.7)', borderRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { labels: { color: document.body.classList.contains('dark') ? '#94a3b8' : '#475569', font: { size: 11 } } } },
          scales: {
            x: { ticks: { color: document.body.classList.contains('dark') ? '#94a3b8' : '#475569', font: { size: 10 } }, grid: { color: document.body.classList.contains('dark') ? '#1e293b' : '#e2e8f0' } },
            y: { ticks: { color: document.body.classList.contains('dark') ? '#94a3b8' : '#475569', font: { size: 10 } }, grid: { color: document.body.classList.contains('dark') ? '#1e293b' : '#e2e8f0' } },
          },
        },
      });
    }};
  },

  async openForm(type, id) {
    const [item, properties, contracts] = await Promise.all([
      id ? db.getById(type, id) : {},
      db.getAll('properties'),
      db.getAll('contracts'),
    ]);
    const isEdit = !!id;

    if (type === 'expenses') {
      const fields = buildForm([
        { type: 'grid', fields: [
          formField('Descrição', 'description', 'text', { value: item.description || '', required: true }),
          formField('Tipo', 'type', 'select', { value: item.type || 'manutenção', options: [['manutenção','Manutenção'],['pintura','Pintura'],['limpeza','Limpeza'],['condomínio','Condomínio'],['iptu','IPTU'],['energia','Energia'],['água','Água'],['internet','Internet'],['reforma','Reforma'],['outro','Outro']] }),
        ]},
        { type: 'grid', fields: [
          formField('Valor (R$)', 'amount', 'number', { value: item.amount || 0 }),
          formField('Data', 'date', 'date', { value: item.date ? Utils.formatDateISO(item.date) : Utils.formatDateISO(new Date().toISOString()) }),
        ]},
        formField('Imóvel', 'propertyId', 'select', { value: item.propertyId || '', options: properties.map(p => [p.id, p.name]), className: 'full' }),
      ]);

      showModal(isEdit ? 'Editar Despesa' : 'Nova Despesa', fields, {
        buttons: [
          { label: 'Cancelar', cls: 'btn-ghost' },
          { label: isEdit ? 'Salvar' : 'Registrar', cls: 'btn-primary', action: () => this.saveExpense(id) },
        ],
      });
    } else {
      const cOpts = contracts.map(c => [c.id, `#${c.id} - R$ ${c.rentAmount}`]);
      const fields = buildForm([
        { type: 'grid', fields: [
          formField('Descrição', 'description', 'text', { value: item.description || 'Aluguel' }),
          formField('Contrato', 'contractId', 'select', { value: item.contractId || '', options: cOpts }),
        ]},
        { type: 'grid', fields: [
          formField('Valor (R$)', 'amount', 'number', { value: item.amount || 0 }),
          formField('Data Vencimento', 'dueDate', 'date', { value: item.dueDate ? Utils.formatDateISO(item.dueDate) : '' }),
        ]},
        { type: 'grid', fields: [
          formField('Status', 'status', 'select', { value: item.status || 'pendente', options: [['pago','Pago'],['pendente','Pendente'],['atrasado','Atrasado'],['vencido','Vencido']] }),
          formField('Forma Pagamento', 'paymentMethod', 'select', { value: item.paymentMethod || '', options: [['pix','PIX'],['dinheiro','Dinheiro'],['cartao','Cartão'],['ted','TED'],['boleto','Boleto']] }),
        ]},
        { type: 'grid', fields: [
          formField('Valor Recebido (R$)', 'receivedAmount', 'number', { value: item.receivedAmount || 0 }),
          formField('Data Pagamento', 'paymentDate', 'date', { value: item.paymentDate ? Utils.formatDateISO(item.paymentDate) : '' }),
        ]},
      ]);

      showModal(isEdit ? 'Editar Receita' : 'Nova Receita', fields, {
        buttons: [
          { label: 'Cancelar', cls: 'btn-ghost' },
          { label: isEdit ? 'Salvar' : 'Registrar', cls: 'btn-primary', action: () => this.saveReceipt(id) },
        ],
      });
    }
  },

  async saveReceipt(id) {
    const data = getFormData(['description','contractId','amount','dueDate','status','paymentMethod','receivedAmount','paymentDate']);
    if (!data.amount) { showToast('Informe o valor.', 'error'); return; }
    data.contractId = data.contractId ? Number(data.contractId) : null;
    try {
      if (id) { data.id = Number(id); await db.put('receipts', data); showToast('Receita atualizada!'); }
      else { await db.add('receipts', data); showToast('Receita registrada!'); }
      closeModal();
      Router.navigate('finances');
    } catch (e) { showToast('Erro ao salvar.', 'error'); }
  },

  async saveExpense(id) {
    const data = getFormData(['description','type','amount','date','propertyId']);
    if (!data.description || !data.amount) { showToast('Preencha descrição e valor.', 'error'); return; }
    data.propertyId = data.propertyId ? Number(data.propertyId) : null;
    try {
      if (id) { data.id = Number(id); await db.put('expenses', data); showToast('Despesa atualizada!'); }
      else { await db.add('expenses', data); showToast('Despesa registrada!'); }
      closeModal();
      Router.navigate('finances');
    } catch (e) { showToast('Erro ao salvar.', 'error'); }
  },

  async pay(id) {
    const r = await db.getById('receipts', id);
    if (!r) return;
    r.status = 'pago';
    r.paymentDate = new Date().toISOString();
    r.receivedAmount = r.receivedAmount || r.amount;
    await db.put('receipts', r);
    showToast('Pagamento registrado!');
    Router.navigate('finances');
  },

  async remove(type, id) {
    confirmAction(`Tem certeza?`, async () => {
      await db.delete(type, id);
      showToast('Registro excluído.', 'info');
      Router.navigate('finances');
    });
  },
};
