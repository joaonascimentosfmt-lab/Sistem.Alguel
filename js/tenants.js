const Tenants = {
  async render() {
    const tenants = await db.getAll('tenants');
    const title = 'Inquilinos';
    const actions = `<button class="btn btn-primary" onclick="Tenants.openForm()">${Icons.plus} Novo Inquilino</button>`;

    const searchTerm = document.getElementById('filterTenantSearch')?.value?.toLowerCase();

    let filtered = [...tenants];
    if (searchTerm) filtered = filtered.filter(t => t.name?.toLowerCase().includes(searchTerm) || t.cpf?.includes(searchTerm) || t.phone?.includes(searchTerm));

    if (filtered.length === 0) {
      return { html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div><div class="filter-bar"><input type="text" id="filterTenantSearch" placeholder="Buscar inquilino..." oninput="Tenants.render()" style="width:200px;"></div>${emptyState(Icons.users, 'Nenhum inquilino cadastrado', 'Cadastre seus inquilinos para gerenciar contratos.', 'Cadastrar Inquilino', '() => Tenants.openForm()')}` };
    }

    const headers = ['Nome', 'CPF', 'Telefone', 'Email', 'Profissão', 'Renda', 'Ações'];
    const rows = filtered.map(t => [
      Utils.truncate(t.name, 25),
      t.cpf || '-',
      t.phone || '-',
      Utils.truncate(t.email, 20) || '-',
      Utils.truncate(t.profession, 15) || '-',
      Utils.formatCurrency(t.income),
      `<div class="actions">
        <button class="btn btn-sm btn-ghost" onclick="Tenants.view(${t.id})">${Icons.eye}</button>
        <button class="btn btn-sm btn-ghost" onclick="Tenants.openForm(${t.id})">${Icons.edit}</button>
        <button class="btn btn-sm btn-ghost" onclick="Tenants.remove(${t.id})">${Icons.trash}</button>
      </div>`,
    ]);

    const filterBar = `<div class="filter-bar"><input type="text" id="filterTenantSearch" placeholder="Buscar inquilino..." oninput="Tenants.render()" style="width:200px;" value="${searchTerm || ''}"></div>`;

    return {
      html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div>${filterBar}${renderTable(headers, rows, 'Nenhum inquilino encontrado.')}`,
    };
  },

  async openForm(id) {
    const t = id ? await db.getById('tenants', id) : {};
    const isEdit = !!id;

    const fields = buildForm([
      { type: 'grid', fields: [
        formField('Nome Completo', 'name', 'text', { value: t.name || '', required: true }),
        formField('CPF', 'cpf', 'text', { value: t.cpf || '', placeholder: '000.000.000-00' }),
      ]},
      { type: 'grid', fields: [
        formField('RG', 'rg', 'text', { value: t.rg || '' }),
        formField('Data Nascimento', 'birthDate', 'date', { value: t.birthDate ? Utils.formatDateISO(t.birthDate) : '' }),
      ]},
      { type: 'grid', fields: [
        formField('Telefone', 'phone', 'text', { value: t.phone || '', placeholder: '(00) 00000-0000' }),
        formField('WhatsApp', 'whatsapp', 'text', { value: t.whatsapp || '', placeholder: '(00) 00000-0000' }),
      ]},
      { type: 'grid', fields: [
        formField('Email', 'email', 'email', { value: t.email || '' }),
        formField('Profissão', 'profession', 'text', { value: t.profession || '' }),
      ]},
      { type: 'grid', fields: [
        formField('Empresa', 'company', 'text', { value: t.company || '' }),
        formField('Renda (R$)', 'income', 'number', { value: t.income || 0 }),
      ]},
      { type: 'grid', fields: [
        formField('Estado Civil', 'maritalStatus', 'select', { value: t.maritalStatus || '', options: [['solteiro','Solteiro(a)'],['casado','Casado(a)'],['divorciado','Divorciado(a)'],['viuvo','Viúvo(a)']] }),
        formField('Contato Emergência', 'emergencyContact', 'text', { value: t.emergencyContact || '' }),
      ]},
      formField('Endereço Atual', 'address', 'text', { value: t.address || '', className: 'full' }),
    ]);

    showModal(isEdit ? 'Editar Inquilino' : 'Novo Inquilino', fields, {
      large: true,
      buttons: [
        { label: 'Cancelar', cls: 'btn-ghost' },
        { label: isEdit ? 'Salvar' : 'Cadastrar', cls: 'btn-primary', action: () => this.save(id) },
      ],
    });
  },

  async save(id) {
    const data = getFormData(['name','cpf','rg','phone','whatsapp','email','profession','company','income','birthDate','maritalStatus','address','emergencyContact']);
    if (!data.name) { showToast('Preencha o nome do inquilino.', 'error'); return; }
    try {
      if (id) { data.id = Number(id); await db.put('tenants', data); showToast('Inquilino atualizado!'); }
      else { await db.add('tenants', data); showToast('Inquilino cadastrado!'); }
      closeModal();
      Router.navigate('tenants');
    } catch (e) { showToast('Erro ao salvar inquilino.', 'error'); }
  },

  async view(id) {
    const t = await db.getById('tenants', id);
    if (!t) return;
    const html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div><strong>Nome:</strong> ${t.name}</div>
      <div><strong>CPF:</strong> ${t.cpf || '-'}</div>
      <div><strong>RG:</strong> ${t.rg || '-'}</div>
      <div><strong>Nascimento:</strong> ${Utils.formatDate(t.birthDate) || '-'}</div>
      <div><strong>Telefone:</strong> ${t.phone || '-'}</div>
      <div><strong>WhatsApp:</strong> ${t.whatsapp || '-'}</div>
      <div><strong>Email:</strong> ${t.email || '-'}</div>
      <div><strong>Profissão:</strong> ${t.profession || '-'}</div>
      <div><strong>Empresa:</strong> ${t.company || '-'}</div>
      <div><strong>Renda:</strong> ${Utils.formatCurrency(t.income)}</div>
      <div><strong>Estado Civil:</strong> ${Utils.capitalize(t.maritalStatus || '-')}</div>
      <div><strong>Emergência:</strong> ${t.emergencyContact || '-'}</div>
      <div class="full" style="grid-column:1/-1;"><strong>Endereço:</strong> ${t.address || '-'}</div>
    </div>`;
    showModal(t.name, html, { large: true });
  },

  async remove(id) {
    confirmAction('Tem certeza que deseja excluir este inquilino?', async () => {
      await db.delete('tenants', id);
      showToast('Inquilino excluído.', 'info');
      Router.navigate('tenants');
    });
  },
};
