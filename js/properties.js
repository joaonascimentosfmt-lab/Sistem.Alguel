const Properties = {
  async render() {
    const properties = await db.getAll('properties');
    const title = 'Imóveis';
    const actions = `<button class="btn btn-primary" onclick="Properties.openForm()">${Icons.plus} Novo Imóvel</button>`;

    const filterBar = `<div class="filter-bar">
      <select id="filterPropertyStatus" onchange="Properties.render()">
        <option value="">Todos os status</option>
        <option value="alugado">Alugado</option>
        <option value="vago">Vago</option>
        <option value="reservado">Reservado</option>
        <option value="manutenção">Manutenção</option>
      </select>
      <select id="filterPropertyType" onchange="Properties.render()">
        <option value="">Todos os tipos</option>
        <option value="kitnet">Kitnet</option>
        <option value="apartamento">Apartamento</option>
        <option value="casa">Casa</option>
        <option value="sala_comercial">Sala Comercial</option>
        <option value="terreno">Terreno</option>
      </select>
      <input type="text" id="filterPropertySearch" placeholder="Buscar..." oninput="Properties.render()" style="width:160px;">
    </div>`;

    let filtered = [...properties];
    const statusFilter = document.getElementById('filterPropertyStatus')?.value;
    const typeFilter = document.getElementById('filterPropertyType')?.value;
    const searchFilter = document.getElementById('filterPropertySearch')?.value?.toLowerCase();
    if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
    if (typeFilter) filtered = filtered.filter(p => p.type === typeFilter);
    if (searchFilter) filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchFilter) || p.code?.toLowerCase().includes(searchFilter) || p.neighborhood?.toLowerCase().includes(searchFilter));

    if (filtered.length === 0) {
      return { html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div>${emptyState(Icons.building, 'Nenhum imóvel cadastrado', 'Cadastre seu primeiro imóvel para começar.', 'Cadastrar Imóvel', '() => Properties.openForm()')}` };
    }

    const headers = ['Código', 'Nome', 'Tipo', 'Bairro', 'Valor', 'Status', 'Ações'];
    const rows = filtered.map(p => [
      p.code || '-',
      Utils.truncate(p.name, 25),
      Utils.propertyTypeLabel(p.type),
      Utils.truncate(p.neighborhood, 20),
      Utils.formatCurrency(p.rentAmount),
      `<span class="status ${Utils.statusClass(p.status)}">${Utils.statusLabel(p.status)}</span>`,
      `<div class="actions">
        <button class="btn btn-sm btn-ghost" onclick="Properties.view(${p.id})">${Icons.eye}</button>
        <button class="btn btn-sm btn-ghost" onclick="Properties.openForm(${p.id})">${Icons.edit}</button>
        <button class="btn btn-sm btn-ghost" onclick="Properties.remove(${p.id})">${Icons.trash}</button>
      </div>`,
    ]);

    return {
      html: `<div class="section-header"><h2>${title}</h2><div>${actions}</div></div>${filterBar}${renderTable(headers, rows, 'Nenhum imóvel encontrado.')}`,
      after: () => {
        const select = document.getElementById('filterPropertyStatus');
        if (select && statusFilter) select.value = statusFilter;
        const select2 = document.getElementById('filterPropertyType');
        if (select2 && typeFilter) select2.value = typeFilter;
        const input = document.getElementById('filterPropertySearch');
        if (input && searchFilter) input.value = searchFilter;
      }
    };
  },

  async openForm(id) {
    const p = id ? await db.getById('properties', id) : {};
    const isEdit = !!id;

    const fields = buildForm([
      { type: 'grid', fields: [
        formField('Código Interno', 'code', 'text', { value: p.code || '', placeholder: 'ex: AP-001' }),
        formField('Nome do Imóvel', 'name', 'text', { value: p.name || '', placeholder: 'ex: Kitnet Centro' }),
      ]},
      { type: 'grid', fields: [
        formField('Tipo', 'type', 'select', { value: p.type || '', options: [['kitnet','Kitnet'],['apartamento','Apartamento'],['casa','Casa'],['sala_comercial','Sala Comercial'],['terreno','Terreno']] }),
        formField('Status', 'status', 'select', { value: p.status || 'vago', options: [['alugado','Alugado'],['vago','Vago'],['reservado','Reservado'],['manutenção','Manutenção']] }),
      ]},
      { type: 'title', label: 'Endereço' },
      { type: 'grid', fields: [
        formField('CEP', 'cep', 'text', { value: p.cep || '', placeholder: '00000-000' }),
        formField('Bairro', 'neighborhood', 'text', { value: p.neighborhood || '' }),
      ]},
      { type: 'grid', fields: [
        formField('Cidade', 'city', 'text', { value: p.city || '' }),
        formField('Estado', 'state', 'text', { value: p.state || '' }),
      ]},
      formField('Endereço Completo', 'address', 'text', { value: p.address || '', className: 'full' }),
      { type: 'title', label: 'Características' },
      { type: 'grid', fields: [
        formField('Quartos', 'bedrooms', 'number', { value: p.bedrooms || 0 }),
        formField('Banheiros', 'bathrooms', 'number', { value: p.bathrooms || 0 }),
        formField('Vagas Garagem', 'garage', 'number', { value: p.garage || 0 }),
        formField('Área (m²)', 'area', 'number', { value: p.area || 0 }),
      ]},
      { type: 'grid', fields: [
        formField('Mobiliado', 'furnished', 'select', { value: p.furnished || 'nao', options: [['sim','Sim'],['nao','Não']] }),
        formField('Condomínio (R$)', 'condoFee', 'number', { value: p.condoFee || 0 }),
      ]},
      { type: 'grid', fields: [
        formField('Internet Inclusa', 'internetIncluded', 'checkbox', { value: p.internetIncluded }),
        formField('Água Inclusa', 'waterIncluded', 'checkbox', { value: p.waterIncluded }),
        formField('Energia Inclusa', 'energyIncluded', 'checkbox', { value: p.energyIncluded }),
        formField('', '', 'html', { html: '' }),
      ]},
      { type: 'title', label: 'Valores' },
      { type: 'grid', fields: [
        formField('Valor Aluguel (R$)', 'rentAmount', 'number', { value: p.rentAmount || 0 }),
        formField('Valor Condomínio (R$)', 'condoAmount', 'number', { value: p.condoAmount || 0 }),
        formField('IPTU (R$)', 'iptu', 'number', { value: p.iptu || 0 }),
      ]},
      formField('Descrição', 'description', 'textarea', { value: p.description || '', className: 'full' }),
      formField('Observações', 'notes', 'textarea', { value: p.notes || '', className: 'full' }),
    ]);

    showModal(isEdit ? 'Editar Imóvel' : 'Novo Imóvel', fields, {
      large: true,
      buttons: [
        { label: 'Cancelar', cls: 'btn-ghost' },
        { label: isEdit ? 'Salvar' : 'Cadastrar', cls: 'btn-primary', action: () => this.save(id) },
      ],
    });
  },

  async save(id) {
    const data = getFormData(['code','name','type','status','address','neighborhood','city','state','cep','bedrooms','bathrooms','garage','area','furnished','internetIncluded','waterIncluded','energyIncluded','condoFee','description','rentAmount','condoAmount','iptu','notes']);
    if (!data.name || !data.type) { showToast('Preencha nome e tipo do imóvel.', 'error'); return; }
    try {
      if (id) { data.id = Number(id); await db.put('properties', data); showToast('Imóvel atualizado!'); }
      else { await db.add('properties', data); showToast('Imóvel cadastrado!'); }
      closeModal();
      Router.navigate('properties');
    } catch (e) { showToast('Erro ao salvar imóvel.', 'error'); }
  },

  async view(id) {
    const p = await db.getById('properties', id);
    if (!p) return;
    const html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div><strong>Código:</strong> ${p.code || '-'}</div>
      <div><strong>Nome:</strong> ${p.name}</div>
      <div><strong>Tipo:</strong> ${Utils.propertyTypeLabel(p.type)}</div>
      <div><strong>Status:</strong> <span class="status ${Utils.statusClass(p.status)}">${Utils.statusLabel(p.status)}</span></div>
      <div><strong>Endereço:</strong> ${p.address || '-'}</div>
      <div><strong>Bairro:</strong> ${p.neighborhood || '-'}</div>
      <div><strong>Cidade/Estado:</strong> ${p.city || '-'}/${p.state || '-'}</div>
      <div><strong>CEP:</strong> ${p.cep || '-'}</div>
      <div><strong>Quartos:</strong> ${p.bedrooms || 0}</div>
      <div><strong>Banheiros:</strong> ${p.bathrooms || 0}</div>
      <div><strong>Garagem:</strong> ${p.garage || 0}</div>
      <div><strong>Área:</strong> ${p.area || 0}m²</div>
      <div><strong>Mobiliado:</strong> ${p.furnished === 'sim' ? 'Sim' : 'Não'}</div>
      <div><strong>Condomínio:</strong> ${Utils.formatCurrency(p.condoFee)}</div>
      <div><strong>Internet:</strong> ${p.internetIncluded ? 'Sim' : 'Não'}</div>
      <div><strong>Água:</strong> ${p.waterIncluded ? 'Sim' : 'Não'}</div>
      <div><strong>Energia:</strong> ${p.energyIncluded ? 'Sim' : 'Não'}</div>
      <div><strong>Aluguel:</strong> ${Utils.formatCurrency(p.rentAmount)}</div>
      <div><strong>Condomínio:</strong> ${Utils.formatCurrency(p.condoAmount)}</div>
      <div><strong>IPTU:</strong> ${Utils.formatCurrency(p.iptu)}</div>
      <div class="full" style="grid-column:1/-1;"><strong>Descrição:</strong><br>${p.description || '-'}</div>
      <div class="full" style="grid-column:1/-1;"><strong>Observações:</strong><br>${p.notes || '-'}</div>
    </div>`;
    showModal(p.name, html, { large: true });
  },

  async remove(id) {
    confirmAction('Tem certeza que deseja excluir este imóvel?', async () => {
      await db.delete('properties', id);
      showToast('Imóvel excluído.', 'info');
      Router.navigate('properties');
    });
  },
};
