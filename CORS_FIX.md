# 🚫 Erro de CORS - Solução

## 🐛 Problema Identificado

O erro de CORS acontece quando o **frontend** (em um domínio) tenta fazer requisições para a **API** (em outro domínio), mas o servidor da API não está configurado para aceitar essas requisições.

```
Frontend: https://wr10-dashboard.onrender.com
API:      https://api-estacao.onrender.com
          ⬆️ PRECISA PERMITIR REQUISIÇÕES DO FRONTEND
```

## ✅ Solução no Backend (API)

O backend em `https://api-estacao.onrender.com` precisa ter CORS configurado.

### Se usa Express.js:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// OPÇÃO 1: Permitir todos os domínios (desenvolvimento)
app.use(cors());

// OPÇÃO 2: Permitir domínios específicos (produção - RECOMENDADO)
app.use(cors({
  origin: [
    'https://wr10-dashboard.onrender.com',  // Seu frontend no Render
    'https://vaconauta.github.io',          // GitHub Pages
    'http://localhost:8080'                  // Desenvolvimento local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Resto do código...
```

### Se usa outro framework:

**Node.js puro:**
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://wr10-dashboard.onrender.com');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

**Python/Flask:**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://wr10-dashboard.onrender.com",
    "https://vaconauta.github.io"
])
```

## 🧪 Como Testar

### 1. Verificar se API está online:

Abrir no navegador:
```
https://api-estacao.onrender.com/api/health
```
(ou qualquer endpoint público)

### 2. Testar CORS no Console do Navegador:

```javascript
fetch('https://api-estacao.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' })
})
.then(r => console.log('✅ Sucesso:', r))
.catch(e => console.error('❌ Erro:', e));
```

### 3. Ver erro de CORS:

Se aparecer erro como:
```
Access to fetch at 'https://api-estacao.onrender.com/...' 
from origin 'https://wr10-dashboard.onrender.com' 
has been blocked by CORS policy
```

**= Confirma que é problema de CORS no backend**

## 💊 Solução Temporária (Frontend)

Se não puder alterar o backend imediatamente, use um proxy:

### Opção 1: CORS Proxy (NÃO RECOMENDADO para produção)

```javascript
// app.js - CONFIG
API_BASE_URL: 'https://cors-anywhere.herokuapp.com/https://api-estacao.onrender.com'
```

### Opção 2: Proxy no Render

Criar `server.js` que faz proxy das requisições:

```javascript
const http = require('http');
const https = require('https');

app.use('/api', (req, res) => {
  const apiUrl = 'https://api-estacao.onrender.com' + req.url;
  https.get(apiUrl, (apiRes) => {
    res.writeHead(apiRes.statusCode, {
      'Content-Type': apiRes.headers['content-type'],
      'Access-Control-Allow-Origin': '*'
    });
    apiRes.pipe(res);
  });
});
```

## 📋 Checklist

**No Backend (api-estacao.onrender.com):**
- [ ] Instalar `cors`: `npm install cors`
- [ ] Configurar CORS no código
- [ ] Adicionar domínio do frontend: `https://wr10-dashboard.onrender.com`
- [ ] Fazer deploy/restart
- [ ] Testar endpoint público

**No Frontend:**
- [x] Logs detalhados de erro adicionados
- [x] Mode 'cors' explícito
- [x] Headers corretos configurados

## 🔍 Debug

**Ver logs no Console do navegador:**
- F12 → Console
- Procurar por:
  - `🌐 API Request:`
  - `📡 API Response:`
  - `❌ API Error:`
  - Mensagens de CORS

**Código atualizado em:** `assets/js/app.js`
- Logs detalhados adicionados
- Mode CORS explícito
- Melhor tratamento de erros

## 🚀 Próximos Passos

1. **Verificar se API está online**: Acessar URL da API no navegador
2. **Configurar CORS no backend**: Adicionar código acima
3. **Deploy do backend**: Restart do serviço no Render
4. **Testar login**: Deve funcionar após configurar CORS

---

**A solução definitiva é SEMPRE configurar CORS no backend!**
