# Contexto e Arquitetura - ImobAdmin

## Visão Geral

**ImobAdmin** é um sistema SaaS de gestão de imóveis para locação, focado em proprietários de kitnets, apartamentos e casas que administram seus próprios imóveis. O sistema permite controle completo da operação de aluguel em um único lugar.

### Problema

Proprietários de imóveis precisam gerenciar múltiplas unidades, inquilinos, contratos e finanças de forma dispersa entre planilhas, cadernos e sistemas desconectados. Não há uma solução integrada, acessível via celular, que unifique todo o fluxo operacional.

### Solução MVP

Um PWA (Progressive Web App) responsivo com armazenamento local (IndexedDB), que funciona offline, com interface moderna e escura, contendo os módulos essenciais para gestão de imóveis.

---

## Arquitetura do MVP

### Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla ES6+) |
| Armazenamento | IndexedDB (navegador) |
| Gráficos | Chart.js 4.x (CDN) |
| Tema | CSS Custom Properties (dark/light) |
| PWA | Service Worker + Manifest |
| Ícones | Emoji nativos (sem dependência) |

### Estrutura de Arquivos

```
/
├── index.html          # Shell SPA com sidebar, topbar, modais
├── manifest.json       # Config PWA (instalação, splash screen)
├── sw.js               # Service Worker (cache offline)
├── css/
│   └── style.css       # Design system completo (dark/light, responsivo)
├── js/
│   ├── db.js           # Camada de dados - IndexedDB (CRUD, search)
│   ├── components.js   # Componentes UI (toast, modal, tabelas, formulários)
│   ├── dashboard.js    # Dashboard com métricas e gráficos
│   ├── properties.js   # CRUD de imóveis
│   ├── tenants.js      # CRUD de inquilinos
│   ├── contracts.js    # Gestão de contratos
│   ├── finances.js     # Receitas, despesas, fluxo de caixa
│   ├── crm.js          # CRM de leads/interessados
│   ├── calendar.js     # Agenda e calendário de eventos
│   └── app.js          # Router SPA, tema, busca global, inicialização
├── context.md          # Este arquivo
└── implementation.md   # Sprints e roadmap
```

### Data Model (IndexedDB Stores)

| Store | Descrição | Campos Principais |
|-------|-----------|-------------------|
| `properties` | Imóveis | id, code, name, type, address, neighborhood, city, state, cep, bedrooms, bathrooms, garage, area, furnished, internetIncluded, waterIncluded, energyIncluded, condoFee, description, status, rentAmount, condoAmount, iptu, notes |
| `tenants` | Inquilinos | id, name, cpf, rg, phone, whatsapp, email, profession, company, income, birthDate, maritalStatus, address, emergencyContact |
| `contracts` | Contratos | id, propertyId, tenantId, startDate, endDate, rentAmount, dueDay, depositAmount, depositCount, penalty, interest, adjustmentIndex, autoRenew |
| `receipts` | Receitas | id, description, contractId, amount, dueDate, status, paymentMethod, receivedAmount, paymentDate |
| `expenses` | Despesas | id, description, type, amount, date, propertyId |
| `leads` | CRM | id, name, phone, whatsapp, email, propertyId, contactDate, source, status, notes |
| `events` | Agenda | id, title, type, date, description |
| `meta` | Metadados | key, value |

### Fluxo de Dados

```
Usuário → Router (hash) → Module.render() → db.getAll/query → Montagem HTML → Insert no DOM → after() hooks (Chart.js)
```

### Arquitetura do Produto Final

```
┌─────────────────────────────────────────────┐
│                   Frontend                    │
│  React / Next.js / TypeScript / Tailwind     │
│  Shadcn UI / PWA / Modo Escuro              │
├─────────────────────────────────────────────┤
│                  API Gateway                  │
│           NestJS (REST + WebSocket)          │
├─────────────────────────────────────────────┤
│               Serviços (NestJS)               │
│  Auth │ Imóveis │ Inquilinos │ Contratos     │
│  Financeiro │ CRM │ Relatórios │ IA          │
│  WhatsApp │ Agenda │ Assinatura              │
├─────────────────────────────────────────────┤
│              ORM / Database                   │
│         Prisma / PostgreSQL                  │
├─────────────────────────────────────────────┤
│            Storage / External                 │
│  Supabase/S3 │ API WhatsApp │ OpenAI         │
└─────────────────────────────────────────────┘
```

### MVP vs Produto Final

| Funcionalidade | MVP | Produto Final |
|---------------|-----|---------------|
| Dashboard c/ gráficos | ✅ Chart.js | ✅ Server-side rendering + WebSocket |
| CRUD Imóveis | ✅ IndexedDB | ✅ PostgreSQL + Prisma |
| CRUD Inquilinos | ✅ IndexedDB | ✅ PostgreSQL + Prisma |
| Contratos | ✅ IndexedDB | ✅ Com assinatura eletrônica |
| Financeiro | ✅ Receitas/Despesas/Fluxo | ✅ Multimodal, parcelamento |
| Pagamentos | ✅ Status manual | 🔄 Integração Stripe/Asaas |
| CRM | ✅ Leads básico | ✅ Funil completo + automação |
| Agenda | ✅ Calendário manual | ✅ Integração Google Calendar |
| PWA | ✅ Offline-first | ✅ Notificações push |
| Dark Mode | ✅ CSS Variables | ✅ Tailwind + persistência |
| Busca Global | ✅ IndexedDB search | ✅ ElasticSearch |
| Multi-tenant | ❌ (single usuário) | ✅ Isolamento por tenant |
| IA Assistente | ❌ | ✅ OpenAI + RAG |
| WhatsApp | ❌ | ✅ API Oficial WhatsApp |
| Relatórios | ❌ (apenas gráficos) | ✅ PDF / Excel / CSV |
| Autenticação | ❌ (local) | ✅ JWT + OAuth |

---

### Design System (MVP)

- **Cores**: Azul (`#3b82f6`) como cor primária, fundo escuro (`#0f172a`) e claro (`#ffffff`)
- **Tipografia**: Sistema nativa (-apple-system, Segoe UI, Roboto)
- **Componentes**: Card, Table, Form Grid, Modal, Toast, Badge de Status
- **Grid**: Responsivo com `auto-fill` e `minmax`
- **Responsividade**: 3 breakpoints (1024px, 768px, 480px)

### Segurança (MVP)

- Sem autenticação (dados armazenados apenas localmente no navegador)
- Sem envio de dados para servidores externos
- Toda operação é local (IndexedDB)

### Próximos Passos

O MVP atual serve como protótipo funcional para validação do conceito. A migração para o produto final envolve:
1. Backend NestJS com PostgreSQL
2. Autenticação JWT + multi-tenant
3. API REST documentada (Swagger)
4. Versão React/Next.js do frontend
5. Integrações (WhatsApp, Pagamentos, IA)
