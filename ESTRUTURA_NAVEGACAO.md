# Estrutura de Navegação do WR10

## Sistema de Navegação Otimizado

O WR10 utiliza um sistema de navegação moderno e otimizado que funciona tanto em ambiente local quanto no GitHub Pages.

## Arquivos Principais

### 1. router.js
Gerencia toda a navegação do sistema com:
- Detecção automática de baseURL
- Resolução de paths dinâmicos
- Suporte para navegação SPA-like

### 2. app.js
Contém as configurações globais e helpers:
- `CONFIG.getPageURL(page)` - Resolve URL de páginas
- `CONFIG.getAssetURL(asset)` - Resolve URL de assets
- `CONFIG.BASE_URL` - BaseURL atual do sistema

## Mapeamento de Rotas

```javascript
const routes = {
  '/': 'index.html',                      // Página inicial (Login)
  '/dashboard': 'pages/dashboard.html',   // Dashboard principal
  '/dispositivos': 'pages/dispositivos.html',  // Gerenciamento de dispositivos
  '/irrigacao': 'pages/irrigacao.html',   // Sistema de irrigação
  '/dados': 'pages/dados.html',           // Visualização de dados
  '/configuracoes': 'pages/configuracoes.html', // Configurações
  '/admin': 'pages/admin-dashboard.html'  // Painel administrativo
}
```

## Estrutura de Páginas

```
┌─────────────────────────────────────┐
│         index.html (Login)          │
└─────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        v                   v
┌───────────────┐   ┌──────────────────┐
│   Dashboard   │   │  Admin Dashboard │
│   (Normal)    │   │  (Administrador) │
└───────────────┘   └──────────────────┘
        │
        ├─── Dispositivos
        ├─── Irrigação
        ├─── Dados
        └─── Configurações
```

## Fluxo de Navegação

### 1. Login (index.html)
- Autenticação do usuário
- Redirecionamento baseado no tipo de usuário:
  - **Admin** → admin-dashboard.html
  - **User** → dashboard.html

### 2. Dashboard (dashboard.html)
Menu de navegação com acesso a:
- **Home** - Visão geral dos dados
- **Dispositivos** - Gerenciamento de sensores
- **Irrigação** - Controle de irrigação
- **Dados** - Relatórios e histórico
- **Configurações** - Ajustes do sistema

### 3. Admin Dashboard (admin-dashboard.html)
Painel administrativo com:
- Gerenciamento de empresas
- Gerenciamento de usuários
- Gerenciamento de sensores
- Configurações globais

## Como Usar a Navegação

### Em HTML

#### Links Relativos (Recomendado)
```html
<!-- Funcionam automaticamente em qualquer ambiente -->
<a href="pages/dashboard.html">Dashboard</a>
<a href="pages/dispositivos.html">Dispositivos</a>
<a href="../index.html">Voltar ao Login</a>
```

#### Links com Router (Navegação SPA)
```html
<!-- Usa o sistema de rotas para navegação sem reload -->
<a href="#" data-route="/dashboard">Dashboard</a>
<a href="#" data-route="/dispositivos">Dispositivos</a>
```

### Em JavaScript

#### Usando CONFIG
```javascript
// Obter URL de uma página
const dashboardURL = CONFIG.getPageURL('pages/dashboard.html');
window.location.href = dashboardURL;

// Obter URL de um asset
const cssURL = CONFIG.getAssetURL('assets/css/style.css');
```

#### Usando Router
```javascript
// Navegar programaticamente
window.navigateTo('/dashboard');

// Voltar
window.router.back();

// Avançar
window.router.forward();
```

#### Resolver URLs
```javascript
// Resolve qualquer path
const url = window.resolveURL('pages/dados.html');

// Resolve assets
const imageURL = window.getAssetURL('assets/img/logo.png');
```

## Breadcrumb Navigation

Exemplo de navegação hierárquica:

```
Home > Dashboard > Dispositivos > Sensor #123
│      │          │              └─ Detalhes do sensor
│      │          └─ Lista de dispositivos
│      └─ Dashboard principal
└─ Página inicial
```

## Estados de Navegação

### Usuário Normal
```
Login → Dashboard → [Dispositivos|Irrigação|Dados|Configurações]
```

### Administrador
```
Login → Admin Dashboard → [Empresas|Usuários|Sensores|Config]
           └─ Pode acessar também: Dashboard Normal
```

## Proteção de Rotas

Todas as páginas (exceto index.html) verificam autenticação:

```javascript
// Verifica se usuário está autenticado
if (!localStorage.getItem('accessToken')) {
    window.location.href = CONFIG.getPageURL('index.html');
}

// Verifica permissões de admin
if (requiresAdmin && userType !== 'admin') {
    window.location.href = CONFIG.getPageURL('pages/dashboard.html');
}
```

## Navegação Mobile

O menu de navegação é responsivo e adapta-se automaticamente:

### Desktop
```
┌─────────────────────────────────────┐
│  Logo  │ Dashboard │ Dispositivos  │
└─────────────────────────────────────┘
```

### Mobile
```
┌──────────────┐
│  ☰  Logo     │
└──────────────┘
     │
     └─ Menu hambúrguer
        ├─ Dashboard
        ├─ Dispositivos
        ├─ Irrigação
        └─ ...
```

## Persistência de Navegação

O sistema mantém estado usando:
- **LocalStorage** - Token de autenticação e preferências
- **SessionStorage** - Estado temporário da sessão
- **URL Parameters** - Estado compartilhável

Exemplo:
```
?tab=historico&sensor=ABC123&period=7days
```

## Otimizações

### 1. Prefetch
```html
<!-- Pré-carrega recursos importantes -->
<link rel="prefetch" href="pages/dashboard.html">
<link rel="prefetch" href="assets/js/charts.js">
```

### 2. Lazy Loading
```javascript
// Carrega páginas sob demanda
async function loadPage(page) {
    const module = await import(`./pages/${page}.js`);
    return module.init();
}
```

### 3. Cache
```javascript
// Utiliza cache do service worker (futuro)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

## Troubleshooting

### Problema: Links quebrados após deploy
**Solução**: Use paths relativos ou as funções helper do CONFIG

### Problema: Página em branco
**Solução**: Verifique console (F12) e confirme que router.js foi carregado

### Problema: Redirecionamento incorreto
**Solução**: Limpe localStorage e faça login novamente

---

**Última atualização**: Outubro 2025  
**Versão do Sistema de Navegação**: 2.0
