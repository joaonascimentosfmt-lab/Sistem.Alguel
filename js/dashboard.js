const Dashboard = {
  async render() {
    const [properties, contracts, receipts, expenses] = await Promise.all([
      db.getAll('properties'),
      db.getAll('contracts'),
      db.getAll('receipts'),
      db.getAll('expenses'),
    ]);

    const total = properties.length;
    const alugados = properties.filter(p => p.status === 'alugado').length;
    const vagos = properties.filter(p => p.status === 'vago').length;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const monthReceipts = receipts.filter(r => r.dueDate >= monthStart && r.dueDate <= monthEnd);
    const receitaPrevista = monthReceipts.reduce((s, r) => s + Number(r.amount || 0), 0);
    const receitaRecebida = monthReceipts.filter(r => r.status === 'pago').reduce((s, r) => s + Number(r.receivedAmount || r.amount || 0), 0);
    const receitaAtraso = monthReceipts.filter(r => r.status === 'atrasado' || r.status === 'vencido').reduce((s, r) => s + Number(r.amount || 0), 0);
    const monthExpenses = expenses.filter(e => e.date >= monthStart && e.date <= monthEnd);
    const totalDespesas = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const lucro = receitaRecebida - totalDespesas;

    const vencendo30 = contracts.filter(c => {
      if (!c.endDate) return false;
      const d = Utils.diffDays(c.endDate);
      return d >= 0 && d <= 30;
    }).length;

    const cards = [
      renderCard('Total Imóveis', total, Icons.building, { className: 'dashboard-card' }),
      renderCard('Alugados', alugados, Icons.check, { className: 'dashboard-card' }),
      renderCard('Vagos', vagos, Icons.x, { className: 'dashboard-card' }),
      renderCard('Receita Prevista', Utils.formatCurrency(receitaPrevista), Icons.trendingUp, { className: 'dashboard-card' }),
      renderCard('Receita Recebida', Utils.formatCurrency(receitaRecebida), Icons.dollar, { className: 'dashboard-card' }),
      renderCard('Em Atraso', Utils.formatCurrency(receitaAtraso), Icons.alertCircle, { className: 'dashboard-card' }),
      renderCard('Despesas', Utils.formatCurrency(totalDespesas), Icons.trendingDown, { className: 'dashboard-card' }),
      renderCard('Lucro', Utils.formatCurrency(lucro), Icons.dollar, { className: lucro >= 0 ? 'dashboard-card' : 'dashboard-card' }),
      renderCard('Contratos Vencendo', `${vencendo30}`, Icons.file, { className: 'dashboard-card' }),
    ];

    let html = `<div class="cards-grid">${cards.join('')}</div>`;

    html += `<div class="charts-grid">
      <div class="chart-card"><h3>${Icons.trendingUp} Receita por Mês</h3><canvas id="chartRevenue"></canvas></div>
      <div class="chart-card"><h3>${Icons.building} Ocupação</h3><canvas id="chartOccupancy"></canvas></div>
      <div class="chart-card"><h3>${Icons.creditCard} Pagamentos</h3><canvas id="chartPayments"></canvas></div>
      <div class="chart-card"><h3>${Icons.trendingUp} Evolução da Receita</h3><canvas id="chartEvolution"></canvas></div>
    </div>`;

    return { html, after: () => this.initCharts(receipts, properties) };
  },

  initCharts(receipts, properties) {
    const monthlyData = this.getMonthlyData(receipts);
    const ctx = (id) => document.getElementById(id)?.getContext('2d');

    if (ctx('chartRevenue')) {
      new Chart(ctx('chartRevenue'), {
        type: 'bar',
        data: { labels: monthlyData.labels, datasets: [{ label: 'Receita', data: monthlyData.values, backgroundColor: 'rgba(59, 130, 246, 0.7)', borderColor: '#3b82f6', borderWidth: 1, borderRadius: 4 }] },
        options: this.chartOpts('bar'),
      });
    }

    const alugados = properties.filter(p => p.status === 'alugado').length;
    const vagos = properties.filter(p => p.status === 'vago').length;
    const outros = properties.filter(p => p.status !== 'alugado' && p.status !== 'vago').length;

    if (ctx('chartOccupancy')) {
      new Chart(ctx('chartOccupancy'), {
        type: 'doughnut',
        data: { labels: ['Alugados', 'Vagos', 'Outros'], datasets: [{ data: [alugados, vagos, outros], backgroundColor: ['#22c55e', '#f59e0b', '#64748b'], borderWidth: 0 }] },
        options: this.chartOpts('doughnut'),
      });
    }

    const pago = receipts.filter(r => r.status === 'pago').length;
    const pendente = receipts.filter(r => r.status === 'pendente').length;
    const atrasado = receipts.filter(r => r.status === 'atrasado' || r.status === 'vencido').length;

    if (ctx('chartPayments')) {
      new Chart(ctx('chartPayments'), {
        type: 'doughnut',
        data: { labels: ['Em Dia', 'Pendentes', 'Atrasados'], datasets: [{ data: [pago, pendente, atrasado], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0 }] },
        options: this.chartOpts('doughnut'),
      });
    }

    if (ctx('chartEvolution')) {
      new Chart(ctx('chartEvolution'), {
        type: 'line',
        data: { labels: monthlyData.labels, datasets: [{ label: 'Receita', data: monthlyData.values, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4, pointRadius: 4 }] },
        options: this.chartOpts('line'),
      });
    }
  },

  getMonthlyData(receipts) {
    const map = {};
    receipts.forEach(r => {
      if (!r.dueDate) return;
      const d = new Date(r.dueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + Number(r.receivedAmount || r.amount || 0);
    });
    const keys = Object.keys(map).sort();
    const labels = keys.map(k => { const [y, m] = k.split('-'); return `${Utils.months[parseInt(m) - 1]}/${y}`; });
    const values = keys.map(k => map[k]);
    return { labels: labels.slice(-12), values: values.slice(-12) };
  },

  chartOpts(type) {
    const isDark = document.body.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const base = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
    };
    if (type === 'doughnut') {
      return { ...base, cutout: '60%', plugins: { ...base.plugins, legend: { position: 'bottom', labels: { color: textColor, font: { size: 11 }, padding: 12 } } } };
    }
    return {
      ...base,
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
      },
    };
  },
};
