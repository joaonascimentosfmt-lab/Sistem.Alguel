const SeedData = {
  async load() {
    const existing = await db.getAll('properties');
    if (existing.length > 0) {
      showToast('Já existem dados carregados.', 'error');
      return;
    }

    const properties = [
      { code: 'KT-001', name: 'Kitnet Centro - Apto 101', type: 'kitnet', address: 'Rua XV de Novembro, 150 - Apto 101', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01010-010', bedrooms: 1, bathrooms: 1, garage: 0, area: 28, furnished: 'sim', internetIncluded: true, waterIncluded: true, energyIncluded: false, condoFee: 120, description: 'Kitnet completa no centro, reformada, mobiliada. Próximo ao metrô e comércios.', status: 'alugado', rentAmount: 1800, condoAmount: 120, iptu: 60, notes: 'Ótima localização. Inquilino pagou caução de 3 meses.' },
      { code: 'AP-001', name: 'Apartamento Vila Olímpia', type: 'apartamento', address: 'Av. Dr. Cardoso de Melo, 850 - Apto 42', neighborhood: 'Vila Olímpia', city: 'São Paulo', state: 'SP', cep: '04548-003', bedrooms: 2, bathrooms: 2, garage: 1, area: 65, furnished: 'sim', internetIncluded: false, waterIncluded: false, energyIncluded: false, condoFee: 450, description: 'Apartamento moderno com vista, varanda gourmet, 2 suítes, cozinha planejada.', status: 'alugado', rentAmount: 3800, condoAmount: 450, iptu: 180, notes: 'Contrato com cláusula de reajuste anual pelo IGP-M.' },
      { code: 'CS-001', name: 'Casa Jardins - 3 Quartos', type: 'casa', address: 'Rua Tupi, 485', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', cep: '01430-010', bedrooms: 3, bathrooms: 2, garage: 2, area: 150, furnished: 'nao', internetIncluded: false, waterIncluded: false, energyIncluded: false, condoFee: 0, description: 'Casa ampla em condomínio fechado, piscina, churrasqueira, jardim amplo.', status: 'alugado', rentAmount: 6500, condoAmount: 0, iptu: 350, notes: '' },
      { code: 'KT-002', name: 'Kitnet Santa Cecília', type: 'kitnet', address: 'Rua das Palmeiras, 200 - Fundos', neighborhood: 'Santa Cecília', city: 'São Paulo', state: 'SP', cep: '01226-010', bedrooms: 1, bathrooms: 1, garage: 0, area: 22, furnished: 'sim', internetIncluded: true, waterIncluded: true, energyIncluded: true, condoFee: 80, description: 'Kitnet aconchegante, mobiliada, todas as contas inclusas. Ideal para estudante.', status: 'alugado', rentAmount: 1500, condoAmount: 80, iptu: 45, notes: 'Conta de luz inclusa no condomínio.' },
      { code: 'AP-002', name: 'Apartamento Moema', type: 'apartamento', address: 'Av. Ibirapuera, 1200 - Apto 78', neighborhood: 'Moema', city: 'São Paulo', state: 'SP', cep: '04028-001', bedrooms: 2, bathrooms: 1, garage: 1, area: 55, furnished: 'nao', internetIncluded: false, waterIncluded: false, energyIncluded: false, condoFee: 380, description: 'Apartamento bem localizado, próximo ao parque, ótimo estado de conservação.', status: 'alugado', rentAmount: 3200, condoAmount: 380, iptu: 150, notes: '' },
      { code: 'SC-001', name: 'Sala Comercial Paulista', type: 'sala_comercial', address: 'Av. Paulista, 1000 - Sala 1505', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', cep: '01310-100', bedrooms: 0, bathrooms: 1, garage: 0, area: 35, furnished: 'sim', internetIncluded: true, waterIncluded: true, energyIncluded: true, condoFee: 220, description: 'Sala comercial na Paulista, mobiliada, ideal para escritório, ar condicionado.', status: 'vago', rentAmount: 2800, condoAmount: 220, iptu: 130, notes: 'Disponível para visitação. Prédio com segurança 24h.' },
      { code: 'CS-002', name: 'Casa Vila Mariana', type: 'casa', address: 'Rua Vergueiro, 3200', neighborhood: 'Vila Mariana', city: 'São Paulo', state: 'SP', cep: '04101-300', bedrooms: 2, bathrooms: 1, garage: 1, area: 80, furnished: 'nao', internetIncluded: false, waterIncluded: false, energyIncluded: false, condoFee: 0, description: 'Casa térrea, quintal, ótima para famílias pequenas.', status: 'vago', rentAmount: 2800, condoAmount: 0, iptu: 120, notes: 'Precisa de pequenas reformas na pintura.' },
      { code: 'AP-003', name: 'Apartamento Pinheiros', type: 'apartamento', address: 'Rua dos Pinheiros, 450 - Apto 12', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP', cep: '05422-010', bedrooms: 1, bathrooms: 1, garage: 1, area: 42, furnished: 'sim', internetIncluded: true, waterIncluded: false, energyIncluded: false, condoFee: 300, description: 'Studio mobiliado, prédio novo com academia e salão de festas.', status: 'reservado', rentAmount: 2600, condoAmount: 300, iptu: 100, notes: 'Reservado para lead interessado. Visita agendada.' },
      { code: 'AP-004', name: 'Apartamento Tatuapé', type: 'apartamento', address: 'Rua Tuiuti, 1500 - Apto 34', neighborhood: 'Tatuapé', city: 'São Paulo', state: 'SP', cep: '03307-001', bedrooms: 3, bathrooms: 2, garage: 2, area: 90, furnished: 'nao', internetIncluded: false, waterIncluded: false, energyIncluded: false, condoFee: 520, description: 'Apartamento amplo, suíte master, sacada, 2 vagas.', status: 'alugado', rentAmount: 4500, condoAmount: 520, iptu: 200, notes: 'Contrato renovado automaticamente por mais 12 meses.' },
      { code: 'KT-003', name: 'Kitnet República', type: 'kitnet', address: 'Rua do Arouche, 100 - Apto 201', neighborhood: 'República', city: 'São Paulo', state: 'SP', cep: '01020-010', bedrooms: 1, bathrooms: 1, garage: 0, area: 25, furnished: 'sim', internetIncluded: true, waterIncluded: true, energyIncluded: false, condoFee: 100, description: 'Kitnet mobiliada, centro histórico, próxima à faculdades.', status: 'vago', rentAmount: 1400, condoAmount: 100, iptu: 40, notes: 'Alta procura de estudantes. Ideal para locação rápida.' },
    ];

    const tenants = [
      { name: 'Carlos Eduardo Silva', cpf: '123.456.789-00', rg: '12.345.678-9', phone: '(11) 99999-1001', whatsapp: '(11) 99999-1001', email: 'carlos.silva@email.com', profession: 'Analista de Sistemas', company: 'Tech Solutions Ltda', income: 6500, birthDate: '1990-05-15', maritalStatus: 'casado', address: 'Rua Augusta, 500 - Apto 45, Consolação, SP', emergencyContact: 'Maria Silva - (11) 98888-1001' },
      { name: 'Ana Beatriz Oliveira', cpf: '987.654.321-00', rg: '98.765.432-1', phone: '(11) 99999-2002', whatsapp: '(11) 99999-2002', email: 'ana.oliveira@email.com', profession: 'Médica', company: 'Hospital São Camilo', income: 15000, birthDate: '1988-12-02', maritalStatus: 'solteiro', address: 'Av. Brasil, 2000 - Apto 1201, Jardins, SP', emergencyContact: 'Dr. Pedro Oliveira - (11) 98888-2002' },
      { name: 'Roberto Almeida Santos', cpf: '456.789.123-00', rg: '45.678.912-3', phone: '(11) 99999-3003', whatsapp: '(11) 99999-3003', email: 'roberto.santos@email.com', profession: 'Advogado', company: 'Santos & Associados', income: 12000, birthDate: '1985-03-20', maritalStatus: 'casado', address: 'Rua Oscar Freire, 800, Jardins, SP', emergencyContact: 'Regina Santos - (11) 98888-3003' },
      { name: 'Juliana Costa Lima', cpf: '321.654.987-00', rg: '32.165.498-7', phone: '(11) 99999-4004', whatsapp: '(11) 99999-4004', email: 'juliana.lima@email.com', profession: 'Arquiteta', company: 'Lima Arquitetura', income: 8500, birthDate: '1992-07-08', maritalStatus: 'solteiro', address: 'Rua França Pinto, 350 - Apto 22, Vila Mariana, SP', emergencyContact: 'Paulo Lima - (11) 98888-4004' },
      { name: 'Fernando Souza Pereira', cpf: '654.321.987-00', rg: '65.432.198-9', phone: '(11) 99999-5005', whatsapp: '(11) 99999-5005', email: 'fernando.pereira@email.com', profession: 'Engenheiro Civil', company: 'Construtora Nova Era', income: 11000, birthDate: '1987-11-25', maritalStatus: 'casado', address: 'Rua Maria Antônia, 200 - Apto 78, Consolação, SP', emergencyContact: 'Luciana Pereira - (11) 98888-5005' },
    ];

    const propertyTenantMap = [
      { propertyIdx: 0, tenantIdx: 0 }, { propertyIdx: 1, tenantIdx: 1 },
      { propertyIdx: 2, tenantIdx: 2 }, { propertyIdx: 3, tenantIdx: 3 },
      { propertyIdx: 4, tenantIdx: 4 }, { propertyIdx: 7, tenantIdx: 0 },
    ];

    const propIds = [];
    for (const p of properties) {
      const id = await db.add('properties', p);
      propIds.push(id);
    }

    const tenIds = [];
    for (const t of tenants) {
      const id = await db.add('tenants', t);
      tenIds.push(id);
    }

    const contractData = [
      { propertyId: propIds[0], tenantId: tenIds[0], startDate: '2025-01-01', endDate: '2026-12-31', rentAmount: 1800, dueDay: 10, depositAmount: 5400, depositCount: 3, penalty: 10, interest: 2, adjustmentIndex: 'igpm', autoRenew: true },
      { propertyId: propIds[1], tenantId: tenIds[1], startDate: '2025-03-15', endDate: '2027-03-14', rentAmount: 3800, dueDay: 5, depositAmount: 3800, depositCount: 1, penalty: 10, interest: 1, adjustmentIndex: 'ipca', autoRenew: true },
      { propertyId: propIds[2], tenantId: tenIds[2], startDate: '2024-08-01', endDate: '2026-08-01', rentAmount: 6500, dueDay: 15, depositAmount: 13000, depositCount: 2, penalty: 10, interest: 2, adjustmentIndex: 'igpm', autoRenew: false },
      { propertyId: propIds[3], tenantId: tenIds[3], startDate: '2025-06-01', endDate: '2026-06-01', rentAmount: 1500, dueDay: 5, depositAmount: 3000, depositCount: 2, penalty: 5, interest: 1, adjustmentIndex: 'ipca', autoRenew: true },
      { propertyId: propIds[4], tenantId: tenIds[4], startDate: '2025-02-01', endDate: '2027-01-31', rentAmount: 3200, dueDay: 10, depositAmount: 3200, depositCount: 1, penalty: 10, interest: 2, adjustmentIndex: 'igpm', autoRenew: true },
      { propertyId: propIds[7], tenantId: tenIds[0], startDate: '2025-09-01', endDate: '2026-09-01', rentAmount: 4500, dueDay: 5, depositAmount: 4500, depositCount: 1, penalty: 10, interest: 2, adjustmentIndex: 'ipca', autoRenew: true },
    ];

    for (const c of contractData) {
      await db.add('contracts', c);
    }

    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();

    const receiptData = [
      { description: 'Aluguel - Kitnet Centro', contractId: '1', dueDate: new Date(y, m, 10).toISOString(), amount: 1800, status: 'pago', paymentMethod: 'pix', receivedAmount: 1800, paymentDate: new Date(y, m, 8).toISOString() },
      { description: 'Aluguel - Kitnet Centro', contractId: '1', dueDate: new Date(y, m - 1, 10).toISOString(), amount: 1800, status: 'pago', paymentMethod: 'pix', receivedAmount: 1800, paymentDate: new Date(y, m - 1, 9).toISOString() },
      { description: 'Aluguel - Kitnet Centro', contractId: '1', dueDate: new Date(y, m - 2, 10).toISOString(), amount: 1800, status: 'pago', paymentMethod: 'pix', receivedAmount: 1800, paymentDate: new Date(y, m - 2, 5).toISOString() },
      { description: 'Aluguel - Apto Vila Olímpia', contractId: '2', dueDate: new Date(y, m, 5).toISOString(), amount: 3800, status: 'pago', paymentMethod: 'ted', receivedAmount: 3800, paymentDate: new Date(y, m, 3).toISOString() },
      { description: 'Aluguel - Apto Vila Olímpia', contractId: '2', dueDate: new Date(y, m - 1, 5).toISOString(), amount: 3800, status: 'pago', paymentMethod: 'ted', receivedAmount: 3800, paymentDate: new Date(y, m - 1, 4).toISOString() },
      { description: 'Aluguel - Casa Jardins', contractId: '3', dueDate: new Date(y, m, 15).toISOString(), amount: 6500, status: 'pendente', paymentMethod: '', receivedAmount: 0, paymentDate: '' },
      { description: 'Aluguel - Casa Jardins', contractId: '3', dueDate: new Date(y, m - 1, 15).toISOString(), amount: 6500, status: 'atrasado', paymentMethod: '', receivedAmount: 0, paymentDate: '' },
      { description: 'Aluguel - Kitnet Santa Cecília', contractId: '4', dueDate: new Date(y, m, 5).toISOString(), amount: 1500, status: 'pago', paymentMethod: 'pix', receivedAmount: 1500, paymentDate: new Date(y, m, 5).toISOString() },
      { description: 'Aluguel - Kitnet Santa Cecília', contractId: '4', dueDate: new Date(y, m - 1, 5).toISOString(), amount: 1500, status: 'pago', paymentMethod: 'pix', receivedAmount: 1500, paymentDate: new Date(y, m - 1, 4).toISOString() },
      { description: 'Aluguel - Apto Moema', contractId: '5', dueDate: new Date(y, m, 10).toISOString(), amount: 3200, status: 'pendente', paymentMethod: '', receivedAmount: 0, paymentDate: '' },
      { description: 'Aluguel - Apto Moema', contractId: '5', dueDate: new Date(y, m - 1, 10).toISOString(), amount: 3200, status: 'pago', paymentMethod: 'boleto', receivedAmount: 3200, paymentDate: new Date(y, m - 1, 12).toISOString() },
      { description: 'Aluguel - Apto Tatuapé', contractId: '6', dueDate: new Date(y, m, 5).toISOString(), amount: 4500, status: 'atrasado', paymentMethod: '', receivedAmount: 0, paymentDate: '' },
      { description: 'Aluguel - Apto Tatuapé', contractId: '6', dueDate: new Date(y, m - 1, 5).toISOString(), amount: 4500, status: 'vencido', paymentMethod: '', receivedAmount: 0, paymentDate: '' },
    ];

    for (const r of receiptData) {
      await db.add('receipts', r);
    }

    const expenseData = [
      { description: 'Pintura fachada - Kitnet Centro', type: 'pintura', amount: 800, date: new Date(y, m, 3).toISOString(), propertyId: propIds[0] },
      { description: 'Troca chuveiro - Casa Jardins', type: 'manutenção', amount: 350, date: new Date(y, m - 1, 20).toISOString(), propertyId: propIds[2] },
      { description: 'Limpeza - Apto Pinheiros (vistoria)', type: 'limpeza', amount: 200, date: new Date(y, m, 8).toISOString(), propertyId: propIds[7] },
      { description: 'Internet - Kitnet República', type: 'internet', amount: 120, date: new Date(y, m, 1).toISOString(), propertyId: propIds[9] },
      { description: 'Condomínio - Apto Vila Olímpia', type: 'condomínio', amount: 450, date: new Date(y, m, 10).toISOString(), propertyId: propIds[1] },
      { description: 'Conta de luz - Casa Vila Mariana', type: 'energia', amount: 280, date: new Date(y, m - 1, 15).toISOString(), propertyId: propIds[6] },
      { description: 'Conserto torneira - Kitnet Santa Cecília', type: 'manutenção', amount: 150, date: new Date(y, m - 1, 28).toISOString(), propertyId: propIds[3] },
      { description: 'IPTU - Apto Tatuapé (parcela 6/10)', type: 'iptu', amount: 200, date: new Date(y, m, 15).toISOString(), propertyId: propIds[7] },
    ];

    for (const e of expenseData) {
      await db.add('expenses', e);
    }

    const leadData = [
      { name: 'Lucas Fernandes', phone: '(11) 97777-1001', whatsapp: '(11) 97777-1001', email: 'lucas.f@email.com', propertyId: propIds[5], contactDate: new Date(y, m, 5).toISOString(), source: 'olx', status: 'novo', notes: 'Interessado na sala comercial. Vai visitar esta semana.' },
      { name: 'Marina Costa', phone: '(11) 97777-2002', whatsapp: '(11) 97777-2002', email: 'marina.c@email.com', propertyId: propIds[6], contactDate: new Date(y, m - 1, 15).toISOString(), source: 'instagram', status: 'negociando', notes: 'Visitou o imóvel e gostou. Negociando valor do aluguel.' },
      { name: 'Thiago Rodrigues', phone: '(11) 97777-3003', whatsapp: '(11) 97777-3003', email: 'thiago.r@email.com', propertyId: propIds[9], contactDate: new Date(y, m - 2, 10).toISOString(), source: 'indicacao', status: 'alugado', notes: 'Fechou contrato da kitnet República. Início em 01/08.' },
      { name: 'Patrícia Oliveira', phone: '(11) 97777-4004', whatsapp: '(11) 97777-4004', email: 'patricia.o@email.com', propertyId: propIds[5], contactDate: new Date(y, m, 12).toISOString(), source: 'facebook', status: 'novo', notes: 'Consultou valores da sala comercial. Enviar proposta.' },
      { name: 'Gabriel Santos', phone: '(11) 97777-5005', whatsapp: '(11) 97777-5005', email: 'gabriel.s@email.com', propertyId: propIds[7], contactDate: new Date(y, m, 1).toISOString(), source: 'google', status: 'visitou', notes: 'Visitou o Apto Pinheiros. Disse que vai pensar.' },
    ];

    for (const l of leadData) {
      await db.add('leads', l);
    }

    const eventData = [
      { title: 'Vistoria - Apto Pinheiros', type: 'visit', date: new Date(y, m, 16).toISOString(), description: 'Vistoria de entrada do novo inquilino.' },
      { title: 'Manutenção - Casa Jardins', type: 'maintenance', date: new Date(y, m, 18).toISOString(), description: 'Troca de caixa d\'água - agendar com inquilino.' },
      { title: 'Cobrança - Casa Jardins (atraso)', type: 'collection', date: new Date(y, m, 20).toISOString(), description: 'Ligar para Roberto sobre aluguel em atraso.' },
    ];

    for (const ev of eventData) {
      await db.add('events', ev);
    }

    showToast(`✅ Dados demo carregados! ${properties.length} imóveis, ${tenants.length} inquilinos, ${contractData.length} contratos, ${receiptData.length} receitas, ${expenseData.length} despesas, ${leadData.length} leads.`, 'success');
    setTimeout(() => Router.navigate('dashboard'), 500);
  },

  async clear() {
    const stores = ['properties', 'tenants', 'contracts', 'receipts', 'expenses', 'leads', 'events'];
    for (const store of stores) {
      const all = await db.getAll(store);
      for (const item of all) {
        await db.delete(store, item.id);
      }
    }
    showToast('🗑️ Todos os dados foram limpos.', 'info');
    setTimeout(() => Router.navigate('dashboard'), 500);
  },
};
