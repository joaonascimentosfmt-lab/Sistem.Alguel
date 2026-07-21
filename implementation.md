# Plano de Implementação - ImobAdmin

## MVP (Sprint 1) - Versão 1.0.0

### Duração Estimada: 2 semanas

---

### Sprint 1.1 - Estrutura Base (Dias 1-2)

- [x] Criar estrutura de diretórios do projeto
- [x] Configurar `index.html` - Shell SPA com sidebar, topbar, container de conteúdo
- [x] Implementar `manifest.json` para PWA (instalação, tema, ícones)
- [x] Implementar `sw.js` - Service Worker para cache offline
- [x] Estilizar `css/style.css` - Design system completo
  - [x] CSS Custom Properties para tema dark/light
  - [x] Layout flexível (sidebar + main)
  - [x] Componentes: Card, Table, Modal, Form Grid, Toast, Badges
  - [x] Responsividade (3 breakpoints)
- [x] Criar `js/db.js` - Camada de dados IndexedDB
  - [x] Open/upgrade database com stores
  - [x] CRUD genérico (getAll, getById, add, put, delete)
  - [x] Método de search global
  - [x] Store de metadados (meta)
- [x] Criar `js/components.js` - Componentes UI compartilhados
  - [x] Utils (formatação moeda/data, helpers)
  - [x] Toast de notificação
  - [x] Modal genérico com confirmação
  - [x] Renderização de cards, tabelas, formulários
  - [x] Build de formulários por seções

### Sprint 1.2 - Navegação e Roteamento (Dias 2-3)

- [x] Criar `js/app.js` - Inicialização do sistema
  - [x] Router SPA baseado em hash (#dashboard, #properties, etc.)
  - [x] Loader de módulos com carregamento dinâmico
  - [x] Toggle de tema dark/light com persistência (localStorage)
  - [x] Sidebar responsiva com hamburger em mobile
  - [x] Botão de ação rápida (+ Novo) contextual
  - [x] Busca global com debounce e resultados em dropdown
  - [x] Service Worker registration

### Sprint 1.3 - Dashboard (Dias 3-4)

- [x] Criar `js/dashboard.js` - Painel principal
  - [x] Cards métricos: Total imóveis, Alugados, Vagos
  - [x] Cards financeiros: Receita prevista, Recebida, Atraso
  - [x] Cards: Despesas, Lucro, Contratos vencendo em 30 dias
  - [x] Gráfico: Receita por mês (barras)
  - [x] Gráfico: Ocupação dos imóveis (donut)
  - [x] Gráfico: Pagamentos em dia x atrasados (donut)
  - [x] Gráfico: Evolução da receita (linha)
  - [x] Cálculo de dados mensais agrupados

### Sprint 1.4 - Cadastro de Imóveis (Dias 4-6)

- [x] Criar `js/properties.js` - CRUD completo
  - [x] Listagem com filtros (status, tipo, busca textual)
  - [x] Formulário de cadastro/edição completo
  - [x] Campos: código, nome, tipo, endereço, características
  - [x] Campos: condomínio, valores (aluguel, condomínio, IPTU)
  - [x] Status do imóvel (Alugado/Vago/Reservado/Manutenção)
  - [x] Visualização detalhada em modal
  - [x] Exclusão com confirmação
  - [x] Validação de campos obrigatórios

### Sprint 1.5 - Cadastro de Inquilinos (Dias 6-7)

- [x] Criar `js/tenants.js` - CRUD completo
  - [x] Listagem com busca textual
  - [x] Formulário completo: dados pessoais, contato, documento
  - [x] Campos: profissão, empresa, renda, estado civil
  - [x] Contato de emergência
  - [x] Visualização detalhada
  - [x] Exclusão com confirmação

### Sprint 1.6 - Gestão de Contratos (Dias 7-9)

- [x] Criar `js/contracts.js` - Gestão de contratos
  - [x] Vinculação imóvel + inquilino (selects populados)
  - [x] Datas de início/término
  - [x] Valor do aluguel e dia de vencimento
  - [x] Configuração de caução (valor + quantidade)
  - [x] Multa e juros percentuais
  - [x] Índice de reajuste (IGP-M/IPCA/Outro)
  - [x] Renovação automática
  - [x] Identificação visual de contratos vencendo (tag laranja)
  - [x] Ao criar contrato, imóvel assume status "Alugado"
  - [x] Ao excluir contrato, imóvel volta a "Vago"

### Sprint 1.7 - Controle Financeiro (Dias 9-11)

- [x] Criar `js/finances.js` - Módulo financeiro
  - [x] Aba de Receitas (CRUD)
  - [x] Aba de Despesas (CRUD)
  - [x] Aba de Fluxo de Caixa
  - [x] Registro de recebimento (botão pagar)
  - [x] Status do pagamento: Pago/Pendente/Atrasado/Vencido
  - [x] Formas de pagamento (PIX, Dinheiro, Cartão, TED, Boleto)
  - [x] Tipos de despesa (manutenção, pintura, limpeza, etc.)
  - [x] Gráfico de fluxo de caixa (barras comparativas)
  - [x] Cards de resumo (total receitas, despesas, saldo)

### Sprint 1.8 - CRM e Agenda (Dias 11-13)

- [x] Criar `js/crm.js` - CRM de interessados
  - [x] Cadastro de leads com origem (Instagram, Facebook, OLX, etc.)
  - [x] Status do lead (Novo, Visitou, Negociando, Alugou, Perdido)
  - [x] Vinculação com imóvel de interesse
  - [x] Listagem com busca e ações
- [x] Criar `js/calendar.js` - Agenda e calendário
  - [x] Calendário mensal com navegação
  - [x] Destaque de eventos por tipo (vencimentos, visitas, contratos)
  - [x] Destaque do dia atual
  - [x] Criação de eventos manuais
  - [x] Eventos automáticos (vencimentos, visitas de leads)

### Sprint 1.9 - Finalização MVP (Dia 14)

- [x] Testes de todas as funcionalidades
- [x] Ajustes de responsividade
- [x] Documentação (context.md, implementation.md)
- [x] Deploy inicial (GitHub Pages, Vercel, ou servidor estático)

---

## Produto Final - Roadmap Completo

---

### Sprint 2 - Backend e Autenticação (4 semanas)

**Objetivo:** Substituir IndexedDB por backend real com autenticação.

- [ ] Setup NestJS + TypeScript
- [ ] Configurar Prisma ORM + PostgreSQL
- [ ] Modelagem do banco de dados relacional
- [ ] Autenticação JWT (login, registro, refresh token)
- [ ] CRUD API Imóveis (REST)
- [ ] CRUD API Inquilinos (REST)
- [ ] CRUD API Contratos (REST)
- [ ] CRUD API Financeiro (REST)
- [ ] CRUD API CRM (REST)
- [ ] CRUD API Agenda (REST)
- [ ] Validação de dados com class-validator
- [ ] Swagger / OpenAPI documentation
- [ ] Tratamento de erros global
- [ ] Testes unitários (Jest)
- [ ] Testes e2e (Supertest)

### Sprint 3 - Frontend React/Next.js (4 semanas)

**Objetivo:** Migrar o frontend vanilla para React/Next.js com TypeScript.

- [ ] Setup Next.js + TypeScript + Tailwind CSS
- [ ] Configurar Shadcn UI + modo escuro
- [ ] Criar componentes atômicos (Button, Input, Card, Modal, Table)
- [ ] Páginas: Login/Register
- [ ] Páginas: Dashboard (com SSR + WebSocket)
- [ ] Páginas: Imóveis (listagem, formulário, detalhes)
- [ ] Páginas: Inquilinos
- [ ] Páginas: Contratos
- [ ] Páginas: Financeiro
- [ ] Páginas: CRM
- [ ] Páginas: Agenda
- [ ] State management (Zustand ou Context API)
- [ ] Integração com API REST (React Query / SWR)
- [ ] SEO e meta tags
- [ ] PWA: notificações push
- [ ] Testes (Jest + Testing Library)

### Sprint 4 - Multi-tenant e Permissões (3 semanas)

**Objetivo:** Isolamento de dados por proprietário e controle de acesso.

- [ ] Schema multi-tenant no Prisma (tenantId em todas as tabelas)
- [ ] Middleware de tenant no NestJS
- [ ] Cadastro de usuários com perfis
- [ ] Perfis: Administrador, Funcionário, Corretor
- [ ] Sistema de permissões (RBAC)
- [ ] Convite de usuários por email
- [ ] Logs de auditoria
- [ ] Backup automático do banco

### Sprint 5 - Pagamentos e Financeiro Avançado (3 semanas)

**Objetivo:** Integração com gateways de pagamento e automatização financeira.

- [ ] Integração Stripe (cartão de crédito)
- [ ] Integração Asaas (boleto, PIX)
- [ ] Geração de boletos automatizada
- [ ] Conciliação bancária
- [ ] Parcelamento de aluguéis
- [ ] Multa e juros automáticos no atraso
- [ ] Notificação de vencimento (email + WhatsApp)
- [ ] Extrato financeiro detalhado
- [ ] Relatório de inadimplência

### Sprint 6 - WhatsApp e Comunicação (3 semanas)

**Objetivo:** Automação de comunicação com inquilinos.

- [ ] Integração API Oficial WhatsApp Business
- [ ] Envio automático de cobrança
- [ ] Lembrete de vencimento (5 dias antes)
- [ ] Envio de contrato digital
- [ ] Envio de recibo de pagamento
- [ ] Aviso de reajuste
- [ ] Mensagens personalizadas em massa
- [ ] Template de mensagens
- [ ] Histórico de conversas

### Sprint 7 - IA Assistente (2 semanas)

**Objetivo:** Assistente inteligente para consultas em linguagem natural.

- [ ] Integração OpenAI API
- [ ] RAG (Retrieval Augmented Generation) com dados do banco
- [ ] Query em linguagem natural → SQL
- [ ] Respostas contextualizadas
- [ ] Exemplos: "Quem está inadimplente?", "Quanto recebi este mês?"
- [ ] Chat UI no dashboard
- [ ] Sugestões proativas (ex: "3 contratos vencem este mês")

### Sprint 8 - Relatórios e Exportação (2 semanas)

**Objetivo:** Geração de relatórios gerenciais completos.

- [ ] Receita por imóvel
- [ ] Lucro por imóvel
- [ ] Rentabilidade
- [ ] Imóveis vagos com tempo de vacância
- [ ] Histórico financeiro completo
- [ ] Contratos vencendo (próximos 30/60/90 dias)
- [ ] Exportar PDF (Puppeteer ou PDFKit)
- [ ] Exportar Excel (ExcelJS)
- [ ] Exportar CSV
- [ ] Agendamento de relatórios

### Sprint 9 - Assinatura Eletrônica (2 semanas)

**Objetivo:** Assinatura digital de contratos online.

- [ ] Integração com plataforma de assinatura (Zapsign, Clicksign)
- [ ] Upload de contrato PDF
- [ ] Definição de campos de assinatura
- [ ] Envio para assinatura do inquilino
- [ ] Status: Pendente, Assinado, Vencido
- [ ] Histórico de alterações do contrato
- [ ] Versões de contrato

### Sprint 10 - Features Premium e Finalização (3 semanas)

**Objetivo:** Diferenciais competitivos e preparação para lançamento.

- [ ] Ranking dos imóveis mais lucrativos
- [ ] Ranking dos inquilinos mais pontuais
- [ ] Timeline de eventos por imóvel
- [ ] Histórico completo de manutenção por imóvel
- [ ] Upload ilimitado de documentos (Supabase/S3)
- [ ] Página pública do imóvel + link compartilhável
- [ ] Botão WhatsApp + Agendar visita na página pública
- [ ] Pesquisa global instantânea (ElasticSearch)
- [ ] Modo escuro persistente
- [ ] PWA completo com notificações push
- [ ] Performance optimization (Lighthouse 90+)
- [ ] Testes de carga
- [ ] Deploy em produção
- [ ] Monitoramento (Sentry + LogRocket)

---

## Critérios de Qualidade

| Critério | Meta |
|----------|------|
| Lighthouse Performance | > 90 |
| Lighthouse PWA | ✅ |
| Cobertura de Testes | > 80% |
| Acessibilidade | > 85 |
| Tempo de Carregamento | < 2s |
| Mobile First | ✅ |
| Offline Suportado | ✅ |

## Tecnologias por Fase

| Fase | Tecnologias |
|------|-------------|
| MVP (Sprint 1) | HTML5, CSS3, Vanilla JS, IndexedDB, Chart.js |
| Sprint 2-3 | NestJS, Prisma, PostgreSQL, React/Next.js, Tailwind |
| Sprint 4-10 | Stripe, Asaas, OpenAI, WhatsApp API, ElasticSearch, AWS/S3 |
