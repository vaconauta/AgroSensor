# WR10 Dashboard - Deploy no Render

## 🚀 Passos para Deploy

### 1. Criar conta no Render
- Acessar: https://render.com
- Fazer login com GitHub

### 2. Criar novo Web Service
1. Clicar em "New +" → "Web Service"
2. Conectar ao repositório: `vaconauta/AgroSensor`
3. Configurar:

| Campo | Valor |
|-------|-------|
| **Name** | `wr10-dashboard` (ou qualquer nome) |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 3. Variáveis de Ambiente (opcional)
- Nenhuma necessária para o PWA

### 4. Deploy
- Clicar em "Create Web Service"
- Aguardar build (2-3 minutos)
- URL será algo como: `https://wr10-dashboard.onrender.com`

## ✅ Vantagens do Render

| Recurso | Status |
|---------|--------|
| HTTPS automático | ✅ Grátis |
| Deploy automático | ✅ A cada git push |
| Logs em tempo real | ✅ |
| Domínio customizado | ✅ (opcional) |
| PWA 100% funcional | ✅ |

## 🔧 Configurações Aplicadas

**package.json atualizado:**
- ✅ Script `start` para Render
- ✅ Servidor HTTP configurado
- ✅ Porta dinâmica ($PORT)

**PWA pronto:**
- ✅ Paths relativos (funciona em qualquer lugar)
- ✅ Service Worker configurado
- ✅ Manifest completo
- ✅ Ícones gerados

## 📱 Testar PWA após Deploy

1. **Acessar URL do Render** (ex: `https://wr10-dashboard.onrender.com`)
2. **No celular**: Abrir no Chrome
3. **Instalar**: Menu → "Instalar aplicativo"
4. **Testar debug** (se necessário): Adicionar `/pwa-debug.html` na URL

## 🆚 Render vs GitHub Pages

| Aspecto | GitHub Pages | Render |
|---------|--------------|--------|
| HTTPS | ✅ | ✅ |
| Path | Subdiretório `/AgroSensor/` | Raiz `/` |
| PWA | ✅ (com ajustes) | ✅ (direto) |
| Custo | Grátis | Grátis |
| Deploy | Push para `main` | Push para `main` |

**Vantagem do Render:** Serve na raiz, não em subdiretório!

## 🐛 Se não funcionar

1. **Ver logs do build**: Render Dashboard → Logs
2. **Testar localmente**:
   ```bash
   npm install
   npm start
   # Abrir http://localhost:$PORT
   ```
3. **Debug PWA**: Acessar `/pwa-debug.html`

## 📊 Status

✅ Projeto preparado para Render
✅ package.json configurado
✅ PWA com paths relativos
✅ Pronto para deploy

---

**Próximo passo**: Fazer commit e push, depois criar Web Service no Render
