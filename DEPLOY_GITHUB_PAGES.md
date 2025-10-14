# 🚀 Guia de Deploy para GitHub Pages

## Configuração Inicial

### 1. Prepare seu Repositório

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/vaconauta/AgroSensor.git
cd AgroSensor

# Certifique-se de estar na branch main
git checkout main
```

### 2. Configure o GitHub Pages

1. Acesse seu repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione:
   - **Branch**: `main`
   - **Folder**: `/ (root)` ou `/frontend/agrosensor/new` dependendo da estrutura
4. Clique em **Save**

### 3. Aguarde o Deploy

- O GitHub Pages levará alguns minutos para processar
- Você verá uma mensagem quando estiver pronto
- URL padrão: `https://vaconauta.github.io/AgroSensor/`

## Estrutura Otimizada

O projeto já está otimizado para GitHub Pages com:

✅ **`.nojekyll`** - Desabilita processamento Jekyll  
✅ **`_config.yml`** - Configurações de SEO e metadados  
✅ **`404.html`** - Página de erro personalizada  
✅ **`router.js`** - Sistema de navegação com detecção automática de baseURL  
✅ **Paths dinâmicos** - Funciona tanto local quanto no GitHub Pages

## Comandos Git Úteis

### Deploy Manual

```bash
# Adicione as mudanças
git add .

# Faça commit
git commit -m "Deploy: Atualização do frontend"

# Envie para o GitHub
git push origin main

# Aguarde 1-3 minutos para o deploy automático
```

### Verificar Status

```bash
# Ver arquivos modificados
git status

# Ver histórico de commits
git log --oneline -10

# Ver diferenças
git diff
```

## Configurações Importantes

### BaseURL Automático

O sistema detecta automaticamente se está rodando:

- **Localmente**: `http://localhost` → baseURL = `''`
- **GitHub Pages**: `https://usuario.github.io/repo` → baseURL = `/repo`

### URLs de Assets

Use sempre os helpers fornecidos:

```javascript
// No JavaScript
const imageURL = CONFIG.getAssetURL('assets/img/logo.png');
const pageURL = CONFIG.getPageURL('pages/dashboard.html');

// Ou use o router global
const url = window.getAssetURL('assets/css/style.css');
```

### Links HTML

Para links internos, use caminhos relativos:

```html
<!-- ✅ Correto -->
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/app.js"></script>
<a href="pages/dashboard.html">Dashboard</a>

<!-- ✅ Ou use data-route para navegação SPA -->
<a href="#" data-route="/dashboard">Dashboard</a>

<!-- ❌ Evite paths absolutos -->
<a href="/pages/dashboard.html">Dashboard</a>
```

## Troubleshooting

### Problema: 404 em recursos CSS/JS

**Solução**: Certifique-se de usar paths relativos ou o helper `getAssetURL()`

### Problema: Página em branco após deploy

**Solução**:
1. Verifique o console do navegador (F12)
2. Confirme que os paths dos assets estão corretos
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Problema: Links quebrados

**Solução**: Use sempre paths relativos ou o sistema de router

### Problema: Mudanças não aparecem

**Solução**:
```bash
# Force um novo commit
git add .
git commit -m "Force update"
git push origin main

# Aguarde 2-3 minutos
# Limpe o cache: Ctrl+Shift+R
```

## Otimizações Implementadas

### 1. Sistema de Roteamento
- Detecção automática de baseURL
- Compatível com GitHub Pages e localhost
- Navegação SPA-like opcional

### 2. SEO e Performance
- Metadados otimizados
- Sitemap automático (via Jekyll)
- Página 404 customizada

### 3. Assets Otimizados
- CDN para bibliotecas externas
- Paths relativos para assets locais
- Lazy loading quando aplicável

## Verificação Pós-Deploy

Após o deploy, verifique:

- [ ] Página inicial carrega corretamente
- [ ] CSS e JavaScript são carregados
- [ ] Navegação entre páginas funciona
- [ ] Imagens são exibidas
- [ ] Formulários funcionam
- [ ] API conecta (se aplicável)
- [ ] Responsividade mobile
- [ ] Teste em diferentes navegadores

## Atualizações Futuras

Para atualizar o site:

```bash
# 1. Faça suas alterações nos arquivos
# 2. Teste localmente
# 3. Commit e push

git add .
git commit -m "feat: Descrição da mudança"
git push origin main

# O GitHub Pages atualiza automaticamente
```

## Domínio Personalizado (Opcional)

Para usar um domínio próprio:

1. Configure DNS do seu domínio:
   ```
   Type: CNAME
   Name: www
   Value: vaconauta.github.io
   ```

2. No GitHub:
   - **Settings** > **Pages**
   - Em **Custom domain**, adicione: `www.seudominio.com`
   - Marque **Enforce HTTPS**

3. Atualize `_config.yml`:
   ```yaml
   url: "https://www.seudominio.com"
   baseurl: ""
   ```

## Suporte

Documentação oficial:
- [GitHub Pages Docs](https://docs.github.com/pt/pages)
- [Jekyll Docs](https://jekyllrb.com/docs/)

---

**Última atualização**: Outubro 2025  
**Versão**: 2.0
