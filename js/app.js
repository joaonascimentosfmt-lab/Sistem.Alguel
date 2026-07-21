const Router = {
  routes: {
    dashboard: { module: Dashboard, label: 'Dashboard' },
    properties: { module: Properties, label: 'Imóveis' },
    tenants: { module: Tenants, label: 'Inquilinos' },
    contracts: { module: Contracts, label: 'Contratos' },
    finances: { module: Finances, label: 'Financeiro' },
    crm: { module: CRM, label: 'CRM' },
    calendar: { module: Calendar, label: 'Agenda' },
  },

  currentRoute: null,

  async navigate(route) {
    if (!route) route = 'dashboard';
    if (this.routes[route]) {
      this.currentRoute = route;
      window.location.hash = route;
      await this.loadRoute(route);
    }
  },

  async loadRoute(route) {
    const config = this.routes[route];
    if (!config) return;

    document.getElementById('pageTitle').textContent = config.label;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route);
    });

    const content = document.getElementById('pageContent');
    content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">Carregando...</div>';

    try {
      const result = await config.module.render();
      content.innerHTML = result.html || result;
      if (result.after) setTimeout(result.after, 100);
    } catch (e) {
      console.error('Erro ao carregar rota:', e);
      content.innerHTML = `<div class="empty-state"><div class="icon">${Icons.alertTriangle}</div><h3>Erro ao carregar</h3><p>${e.message}</p></div>`;
    }
  },

  init() {
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '') || 'dashboard';
      this.navigate(route);
    });

    const route = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(route);
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  await db.open();

  const savedTheme = localStorage.getItem('imobadmin-theme') || 'dark';
  document.body.className = savedTheme;
  document.querySelector('.theme-icon').innerHTML = savedTheme === 'dark' ? Icons.moon : Icons.sun;

  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    document.body.className = isDark ? 'light' : 'dark';
    localStorage.setItem('imobadmin-theme', document.body.className);
    document.querySelector('.theme-icon').innerHTML = isDark ? Icons.sun : Icons.moon;
    setTimeout(() => Router.loadRoute(Router.currentRoute), 100);
  });

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  }
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('active', isOpen);
  }

  document.getElementById('sidebarToggle').addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
  document.getElementById('hamburger').addEventListener('click', toggleSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('loadDemoData').addEventListener('click', () => {
    confirmAction('Carregar dados de demonstração? Isso adicionará imóveis, inquilinos, contratos e dados financeiros de exemplo.', () => SeedData.load());
  });
  document.getElementById('clearAllData').addEventListener('click', () => {
    confirmAction('Tem certeza que deseja limpar TODOS os dados?', () => SeedData.clear());
  });

  async function checkFirstRun() {
    const properties = await db.getAll('properties');
    if (properties.length === 0) {
      await SeedData.load();
    }
  }

  const quickBtn = document.getElementById('quickAction');
  quickBtn.addEventListener('click', () => {
    const route = Router.currentRoute;
    if (route === 'properties') Properties.openForm();
    else if (route === 'tenants') Tenants.openForm();
    else if (route === 'contracts') Contracts.openForm();
    else if (route === 'finances') {
      const tab = document.getElementById('financeTab')?.value || 'receipts';
      Finances.openForm(tab);
    }
    else if (route === 'crm') CRM.openForm();
    else Properties.openForm();
  });

  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  let searchTimeout;

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const term = searchInput.value.trim();
    if (!term) { searchResults.classList.remove('active'); return; }
    searchTimeout = setTimeout(async () => {
      const results = await db.search(term);
      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item" style="color:var(--text-muted);">Nenhum resultado encontrado.</div>';
      } else {
        searchResults.innerHTML = results.slice(0, 10).map(r => {
          const label = r.item.name || r.item.title || `#${r.item.id}`;
          const typeLabel = { properties: 'Imóvel', tenants: 'Inquilino', contracts: 'Contrato', leads: 'Lead' }[r.type] || r.type;
          return `<div class="search-result-item" onclick="Router.navigate('${r.type}')">
            <span class="type">${typeLabel}</span>
            <span>${Utils.truncate(label, 35)}</span>
          </div>`;
        }).join('');
      }
      searchResults.classList.add('active');
    }, 300);
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchResults.classList.remove('active'), 200);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) searchResults.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-search')) {
      searchResults.classList.remove('active');
    }
  });

  Router.init();

  checkFirstRun();
});
