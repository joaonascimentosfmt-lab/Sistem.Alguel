const Contracts = {
  async render() {
    const [contracts, properties, tenants] = await Promise.all([
      db.getAll('contracts'),
      db.getAll('properties'),
      db.getAll('tenants'),
    ]);

    const pMap = {}; properties.forEach(p => pMap[p.id] = p);
    const tMap = {}; tenants.forEach(t => tMap[t.id] = t);

    const title = 'Contratos';
    const actions = `<button class="btn btn-primary" onclick="Contracts.openForm()">+ Novo Contrato</button>`;

    if (contracts.length === 0) {
      return { html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div>${emptyState('📄', 'Nenhum contrato cadastrado', 'Crie contratos vinculando imóveis e inquilinos.', 'Criar Contrato', '() => Contracts.openForm()')}` };
    }

    const headers = ['Imóvel', 'Inquilino', 'Início', 'Término', 'Valor', 'Vencimento', 'Status', 'Ações'];
    const rows = contracts.map(c => {
      const prop = pMap[c.propertyId];
      const ten = tMap[c.tenantId];
      const expiring = c.endDate && Utils.diffDays(c.endDate) <= 30 && Utils.diffDays(c.endDate) >= 0;
      return [
        prop ? Utils.truncate(prop.name, 20) : '---',
        ten ? Utils.truncate(ten.name, 20) : '---',
        Utils.formatDate(c.startDate),
        Utils.formatDate(c.endDate),
        Utils.formatCurrency(c.rentAmount),
        `Dia ${c.dueDay || 5}`,
        expiring ? '<span class="status status-pending">Vencendo</span>' : '<span class="status status-active">Ativo</span>',
        `<div class="actions">
          <button class="btn btn-sm btn-ghost" onclick="Contracts.view(${c.id})">👁️</button>
          <button class="btn btn-sm btn-ghost" onclick="Contracts.openForm(${c.id})">✏️</button>
          <button class="btn btn-sm btn-ghost" onclick="Contracts.remove(${c.id})">🗑️</button>
        </div>`,
      ];
    });

    return { html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div>${renderTable(headers, rows, 'Nenhum contrato encontrado.')}` };
  },

  async openForm(id) {
    const [c, properties, tenants] = await Promise.all([
      id ? db.getById('contracts', id) : {},
      db.getAll('properties'),
      db.getAll('tenants'),
    ]);
    const isEdit = !!id;

    if (properties.length === 0) { showToast('Cadastre um imóvel primeiro.', 'error'); return; }
    if (tenants.length === 0) { showToast('Cadastre um inquilino primeiro.', 'error'); return; }

    const propOpts = properties.map(p => [p.id, `${p.code || p.name} - ${p.name}`]);
    const tenOpts = tenants.map(t => [t.id, t.name]);

    const fields = buildForm([
      { type: 'grid', fields: [
        formField('Imóvel', 'propertyId', 'select', { value: c.propertyId || '', options: propOpts }),
        formField('Inquilino', 'tenantId', 'select', { value: c.tenantId || '', options: tenOpts }),
      ]},
      { type: 'grid', fields: [
        formField('Data Início', 'startDate', 'date', { value: c.startDate ? Utils.formatDateISO(c.startDate) : '' }),
        formField('Data Término', 'endDate', 'date', { value: c.endDate ? Utils.formatDateISO(c.endDate) : '' }),
      ]},
      { type: 'grid', fields: [
        formField('Valor Aluguel (R$)', 'rentAmount', 'number', { value: c.rentAmount || 0 }),
        formField('Dia Vencimento', 'dueDay', 'number', { value: c.dueDay || 5 }),
      ]},
      { type: 'grid', fields: [
        formField('Valor Caução (R$)', 'depositAmount', 'number', { value: c.depositAmount || 0 }),
        formField('Qtd Cauções', 'depositCount', 'number', { value: c.depositCount || 0 }),
      ]},
      { type: 'grid', fields: [
        formField('Multa (%)', 'penalty', 'number', { value: c.penalty || 0 }),
        formField('Juros (% ao mês)', 'interest', 'number', { value: c.interest || 0 }),
      ]},
      { type: 'grid', fields: [
        formField('Índice Reajuste', 'adjustmentIndex', 'select', { value: c.adjustmentIndex || '', options: [['igpm','IGP-M'],['ipca','IPCA'],['outro','Outro']] }),
        formField('Renovação Automática', 'autoRenew', 'checkbox', { value: c.autoRenew }),
      ]},
    ]);

    showModal(isEdit ? 'Editar Contrato' : 'Novo Contrato', fields, {
      large: true,
      buttons: [
        { label: 'Cancelar', cls: 'btn-ghost' },
        { label: isEdit ? 'Salvar' : 'Criar', cls: 'btn-primary', action: () => this.save(id) },
      ],
    });
  },

  async save(id) {
    const data = getFormData(['propertyId','tenantId','startDate','endDate','rentAmount','dueDay','depositAmount','depositCount','penalty','interest','adjustmentIndex','autoRenew']);
    if (!data.propertyId || !data.tenantId) { showToast('Selecione imóvel e inquilino.', 'error'); return; }
    data.propertyId = Number(data.propertyId);
    data.tenantId = Number(data.tenantId);
    try {
      if (id) { data.id = Number(id); await db.put('contracts', data); showToast('Contrato atualizado!'); }
      else {
        const cId = await db.add('contracts', data);
        await db.getById('properties', data.propertyId).then(async p => {
          if (p) { p.status = 'alugado'; await db.put('properties', p); }
        });
        showToast('Contrato criado!');
      }
      closeModal();
      Router.navigate('contracts');
    } catch (e) { showToast('Erro ao salvar contrato.', 'error'); }
  },

  async view(id) {
    const [c, properties, tenants] = await Promise.all([
      db.getById('contracts', id),
      db.getAll('properties'),
      db.getAll('tenants'),
    ]);
    if (!c) return;
    const prop = properties.find(p => p.id === c.propertyId);
    const ten = tenants.find(t => t.id === c.tenantId);
    const expiring = c.endDate && Utils.diffDays(c.endDate) <= 30 && Utils.diffDays(c.endDate) >= 0;

    const html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div><strong>Imóvel:</strong> ${prop ? prop.name : '---'}</div>
      <div><strong>Inquilino:</strong> ${ten ? ten.name : '---'}</div>
      <div><strong>Início:</strong> ${Utils.formatDate(c.startDate)}</div>
      <div><strong>Término:</strong> ${Utils.formatDate(c.endDate)} ${expiring ? '⚠️ Vencendo' : ''}</div>
      <div><strong>Valor:</strong> ${Utils.formatCurrency(c.rentAmount)}</div>
      <div><strong>Vencimento:</strong> Dia ${c.dueDay || 5}</div>
      <div><strong>Caução:</strong> ${Utils.formatCurrency(c.depositAmount)} (${c.depositCount || 0}x)</div>
      <div><strong>Multa:</strong> ${c.penalty || 0}%</div>
      <div><strong>Juros:</strong> ${c.interest || 0}%</div>
      <div><strong>Reajuste:</strong> ${(c.adjustmentIndex || '---').toUpperCase()}</div>
      <div><strong>Renovação Auto:</strong> ${c.autoRenew ? 'Sim' : 'Não'}</div>
    </div>`;
    showModal(`Contrato #${id}`, html, { large: true });
  },

  async remove(id) {
    confirmAction('Tem certeza que deseja excluir este contrato?', async () => {
      const c = await db.getById('contracts', id);
      await db.delete('contracts', id);
      if (c?.propertyId) {
        await db.getById('properties', c.propertyId).then(async p => {
          if (p) { p.status = 'vago'; await db.put('properties', p); }
        });
      }
      showToast('Contrato excluído.', 'info');
      Router.navigate('contracts');
    });
  },
};
