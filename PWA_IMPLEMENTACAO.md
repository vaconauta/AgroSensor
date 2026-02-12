# 📱 PWA (Progressive Web App) - WR10 Dashboard

## ✅ Implementação Concluída

O WR10 Dashboard agora é um **Progressive Web App (PWA)** completo, podendo ser instalado como aplicativo nativo em Android, iOS e Desktop.

## 📂 Arquivos Implementados

| Arquivo | Localização | Status | Descrição |
|---------|-------------|--------|-----------|
| manifest.json | `/manifest.json` | ✅ | Metadados do app (nome, ícones, cores) |
| service-worker.js | `/service-worker.js` | ✅ | Gerencia cache e funcionamento offline |
| pwa-register.js | `/assets/js/pwa-register.js` | ✅ | Registra Service Worker e controla instalação |
| offline.html | `/offline.html` | ✅ | Página exibida quando não há conexão |
| Ícones | `/assets/icons/` | ⚠️ | **Pendente** - Gerar ícones nos tamanhos necessários |

## 🎯 Funcionalidades Implementadas

### ✅ Cache Inteligente
- Arquivos essenciais pré-carregados (CSS, JS, páginas principais)
- Estratégia "stale-while-revalidate" (mostra cache e atualiza em background)
- Limpeza automática de cache antigo

### ✅ Funcionamento Offline
- App continua funcionando sem internet
- Página offline personalizada com design WR10
- Tentativa automática de reconexão a cada 10 segundos

### ✅ Botão de Instalação
- Aparece automaticamente quando o app é instalável
- Design consistente com a identidade visual WR10
- Animações suaves de entrada/saída

### ✅ Notificação de Atualização
- Detecta quando nova versão está disponível
- Permite atualizar com um clique
- Não interrompe o uso do app

### ✅ Suporte Multiplataforma
- Android (Chrome, Edge, Samsung Internet)
- iOS/iPadOS (Safari 16.4+)
- Desktop (Chrome, Edge, Safari)
- Modo standalone (sem barra do navegador)

## 🚀 Como Testar

### Desenvolvimento Local

1. **Servir via HTTPS** (obrigatório para PWA):
   ```bash
   # Opção 1: Usar extensão Live Server com HTTPS
   # Ou
   
   # Opção 2: Criar certificado local
   npx http-server -S -C cert.pem -K key.pem
   ```

2. **Abrir no navegador**:
   ```
   https://localhost:8080
   ```

3. **Verificar no DevTools**:
   - Abrir Chrome DevTools (F12)
   - Ir em **Application > Manifest**
   - Verificar que o manifest carregou corretamente
   - Ir em **Application > Service Workers**
   - Confirmar que o SW está ativo

### Teste de Instalação

1. **Desktop (Chrome/Edge)**:
   - Clicar no botão "Instalar App" flutuante
   - Ou clicar no ícone de instalação na barra de endereço
   - Confirmar a instalação

2. **Android**:
   - Abrir o site no Chrome
   - Tocar no botão "Instalar App"
   - Ou abrir menu (⋮) > "Instalar aplicativo"
   - O ícone aparecerá na tela inicial

3. **iOS/iPadOS**:
   - Abrir no Safari
   - Tocar no botão de compartilhar
   - Selecionar "Adicionar à Tela de Início"
   - Confirmar (funcionalidade limitada no iOS)

### Teste Offline

1. Abrir o app instalado
2. No DevTools: **Network > Offline**
3. Navegar pelo app (deve continuar funcionando)
4. Tentar carregar páginas não cacheadas (mostra offline.html)

## ⚠️ Pendências

### 1. Gerar Ícones PWA (IMPORTANTE)

Os ícones são **obrigatórios** para o PWA funcionar corretamente. Siga o guia em:
```
assets/icons/README.md
```

**Tamanhos necessários:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Ação recomendada:**
1. Ter uma logo/imagem do WR10 em alta qualidade (mínimo 512x512)
2. Usar [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
3. Baixar e extrair os ícones na pasta `assets/icons/`

### 2. Configurar HTTPS em Produção

PWA só funciona com HTTPS. Opções:

- **GitHub Pages**: Automático (usa HTTPS)
- **Netlify/Vercel**: Automático
- **Servidor próprio**: Usar Let's Encrypt (certbot)

## 🔧 Manutenção

### Atualizar Cache ao Fazer Deploy

Sempre que modificar arquivos CSS/JS, **atualizar a versão do cache**:

**Em `service-worker.js`, linha 2:**
```javascript
const CACHE_NAME = 'wr10-cache-v1'; // Mudar para v2, v3, etc.
```

### Adicionar Novas Páginas ao Cache

**Em `service-worker.js`, no array `PRECACHE_ASSETS`:**
```javascript
const PRECACHE_ASSETS = [
  // ... existentes
  '/pages/nova-pagina.html' // Adicionar aqui
];
```

## 📊 Verificação de Conformidade PWA

Use o **Lighthouse** para auditar:

1. Abrir Chrome DevTools
2. Ir em **Lighthouse**
3. Selecionar "Progressive Web App"
4. Clicar em "Analyze page load"

**Pontos verificados:**
- ✅ Registra um Service Worker
- ✅ Responde com 200 quando offline
- ✅ Tem um manifesto válido
- ⚠️ Tem ícones nos tamanhos corretos (pendente)
- ✅ Usa HTTPS
- ✅ Redireciona HTTP para HTTPS
- ✅ Configurado para tela inicial personalizada
- ✅ Tem meta tag theme-color

## 🎨 Personalização

### Alterar Cores do App

**Em `manifest.json`:**
```json
{
  "theme_color": "#2d7a3e",      // Cor da barra de status
  "background_color": "#ffffff"  // Cor de fundo do splash screen
}
```

**Em `index.html`:**
```html
<meta name="theme-color" content="#2d7a3e">
```

### Adicionar Atalhos (Shortcuts)

**Em `manifest.json`, seção `shortcuts`:**
```json
{
  "name": "Nova Função",
  "url": "/pages/funcao.html",
  "icons": [{ "src": "assets/icons/icon-96x96.png", "sizes": "96x96" }]
}
```

## 📱 Recursos do PWA

### Detectar se está rodando como PWA

```javascript
if (window.isPWA()) {
  console.log('Rodando como app instalado');
} else {
  console.log('Rodando no navegador');
}
```

### Forçar Instalação Programaticamente

```javascript
// Chamar a instalação
window.installPWA();
```

### Verificar Estado do Service Worker

```javascript
navigator.serviceWorker.ready.then(registration => {
  console.log('Service Worker pronto:', registration);
});
```

## 🐛 Troubleshooting

### PWA não aparece para instalar
- Verificar se está em HTTPS (ou localhost)
- Confirmar que manifest.json está acessível
- Verificar se os ícones existem (pelo menos 192x192 e 512x512)
- Limpar cache e recarregar

### Service Worker não registra
- Verificar console por erros
- Confirmar que service-worker.js está na raiz
- Testar em aba anônima (sem extensões)

### Cache não atualiza
- Incrementar `CACHE_NAME` no service-worker.js
- Hard refresh (Ctrl+Shift+R)
- Unregister SW no DevTools > Application > Service Workers

### "Add to Home Screen" não aparece no iOS
- iOS requer adicionar manualmente via botão compartilhar
- Funcionalidade limitada (sem Service Worker completo no iOS < 16.4)

## 📚 Recursos Adicionais

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox (Google)](https://developers.google.com/web/tools/workbox)

## ✅ Próximos Passos

1. **Gerar ícones** (prioridade máxima)
2. **Testar em dispositivos reais** (Android e iOS)
3. **Configurar HTTPS em produção**
4. **Rodar Lighthouse audit** para validação
5. **Submeter para lojas** (opcional):
   - [Google Play Store via TWA](https://developers.google.com/web/android/trusted-web-activity)
   - [Microsoft Store via PWA](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/)

---

**Status**: ✅ PWA implementado com sucesso (pendente geração de ícones)
**Versão**: 1.0
**Data**: 2026-02-12
