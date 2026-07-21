const CRM = {
  async render() {
    const [leads, properties] = await Promise.all([db.getAll('leads'), db.getAll('properties')]);
    const pMap = {}; properties.forEach(p => pMap[p.id] = p);
    const title = 'CRM - Interessados';

    if (leads.length === 0) {
      return { html: `<div class="section-header"><h2>${title}</h2><button class="btn btn-primary" onclick="CRM.openForm()">+ Novo Interessado</button></div>${emptyState('🤝', 'Nenhum interessado cadastrado', 'Cadastre leads interessados nos imóveis.', 'Novo Interessado', '() => CRM.openForm()')}` };
    }

    const headers = ['Nome', 'Telefone', 'Email', 'Imóvel', 'Origem', 'Status', 'Ações'];
    const rows = leads.map(l => [
      Utils.truncate(l.name, 25),
      l.phone || '-',
      Utils.truncate(l.email, 20) || '-',
      l.propertyId ? (pMap[l.propertyId]?.name || '-') : '-',
      Utils.capitalize(l.source || '-'),
      `<span class="status ${Utils.statusClass(l.status === 'alugado' ? 'alugado' : l.status === 'novo' ? 'pendente' : l.status === 'perdido' ? 'atrasado' : '')}">${Utils.capitalize(l.status || 'novo')}</span>`,
      `<div class="actions">
        <button class="btn btn-sm btn-ghost" onclick="CRM.openForm(${l.id})">✏️</button>
        <button class="btn btn-sm btn-ghost" onclick="CRM.remove(${l.id})">🗑️</button>
      </div>`,
    ]);

    return { html: `<div class="section-header"><h2>${title}</h2><button class="btn btn-primary" onclick="CRM.openForm()">+ Novo Interessado</button></div>${renderTable(headers, rows)}` };
  },

  async openForm(id) {
    const [l, properties] = await Promise.all([
      id ? db.getById('leads', id) : {},
      db.getAll('properties'),
    ]);
    const isEdit = !!id;

    const fields = buildForm([
      { type: 'grid', fields: [
        formField('Nome', 'name', 'text', { value: l.name || '', required: true }),
        formField('Telefone', 'phone', 'text', { value: l.phone || '' }),
      ]},
      { type: 'grid', fields: [
        formField('WhatsApp', 'whatsapp', 'text', { value: l.whatsapp || '' }),
        formField('Email', 'email', 'email', { value: l.email || '' }),
      ]},
      { type: 'grid', fields: [
        formField('Imóvel de Interesse', 'propertyId', 'select', { value: l.propertyId || '', options: properties.map(p => [p.id, p.name]) }),
        formField('Data Contato', 'contactDate', 'date', { value: l.contactDate ? Utils.formatDateISO(l.contactDate) : Utils.formatDateISO(new Date().toISOString()) }),
      ]},
      { type: 'grid', fields: [
        formField('Origem', 'source', 'select', { value: l.source || '', options: [['instagram','Instagram'],['facebook','Facebook'],['olx','OLX'],['indicacao','Indicação'],['google','Google'],['outro','Outro']] }),
        formField('Status', 'status', 'select', { value: l.status || 'novo', options: [['novo','Novo'],['visitou','Visitou'],['negociando','Negociando'],['alugado','Alugou'],['perdido','Perdido']] }),
      ]},
      formField('Observações', 'notes', 'textarea', { value: l.notes || '', className: 'full' }),
    ]);

    showModal(isEdit ? 'Editar Interessado' : 'Novo Interessado', fields, {
      buttons: [
        { label: 'Cancelar', cls: 'btn-ghost' },
        { label: isEdit ? 'Salvar' : 'Cadastrar', cls: 'btn-primary', action: () => this.save(id) },
      ],
    });
  },

  async save(id) {
    const data = getFormData(['name','phone','whatsapp','email','propertyId','contactDate','source','status','notes']);
    if (!data.name) { showToast('Preencha o nome.', 'error'); return; }
    data.propertyId = data.propertyId ? Number(data.propertyId) : null;
    try {
      if (id) { data.id = Number(id); await db.put('leads', data); showToast('Lead atualizado!'); }
      else { await db.add('leads', data); showToast('Lead cadastrado!'); }
      closeModal();
      Router.navigate('crm');
    } catch (e) { showToast('Erro ao salvar.', 'error'); }
  },

  async remove(id) {
    confirmAction('Excluir este lead?', async () => {
      await db.delete('leads', id);
      showToast('Lead excluído.', 'info');
      Router.navigate('crm');
    });
  },
};
