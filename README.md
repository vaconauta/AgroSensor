# WR10 🌱

Sistema de monitoramento inteligente com interface web responsiva para acompanhamento de dados de sensores em tempo real.

[![Deploy Status](https://github.com/vaconauta/AgroSensor/actions/workflows/deploy.yml/badge.svg)](https://github.com/vaconauta/AgroSensor/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://vaconauta.github.io/AgroSensor/)

## 📋 Sobre o Projeto

O WR10 é uma plataforma web moderna desenvolvida para monitoramento de dados em tempo real, oferecendo uma interface intuitiva e responsiva para acompanhar métricas importantes como:

- 🌡️ Temperatura e umidade do ar
- 💧 Umidade do solo
- ☀️ Luminosidade
- 🚿 Controle de irrigação
- 📊 Visualização de dados em tempo real
- 📱 Interface responsiva para mobile e desktop

## 🚀 Funcionalidades

- **Dashboard Intuitivo**: Visualização clara dos dados dos sensores
- **Gerenciamento de Dispositivos**: Controle e configuração de sensores
- **Sistema de Irrigação**: Controle automatizado da irrigação
- **Relatórios e Gráficos**: Análise histórica dos dados coletados
- **Interface Responsiva**: Acesso completo via mobile e desktop
- **Configurações Personalizáveis**: Ajustes conforme necessidades específicas
- **Deploy Automatizado**: CI/CD com GitHub Actions
- **Navegação Otimizada**: Sistema de rotas com suporte a GitHub Pages

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura e marcação semântica
- **CSS3**: Estilização responsiva e moderna
- **JavaScript ES6+**: Interatividade e conexão com API
- **Chart.js**: Visualização de dados em gráficos
- **Font Awesome**: Ícones modernos
- **Google Fonts**: Tipografia (Inter)
- **GitHub Pages**: Hospedagem e deploy automático
- **GitHub Actions**: CI/CD pipeline

## 🌐 Demo Online

O projeto está disponível online através do GitHub Pages:
[https://vaconauta.github.io/AgroSensor/](https://vaconauta.github.io/AgroSensor/)

## 📁 Estrutura do Projeto

```
WR10/
├── index.html              # Página principal (login)
├── 404.html                # Página de erro personalizada
├── config.json             # Configurações do sistema
├── .nojekyll               # Bypass Jekyll processing
├── _config.yml             # Configuração GitHub Pages
├── DEPLOY_GITHUB_PAGES.md  # Guia de deploy
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos principais
│   ├── img/               # Imagens e ícones
│   └── js/
│       ├── app.js         # Lógica da aplicação
│       └── router.js      # Sistema de navegação
└── pages/
    ├── dashboard.html      # Dashboard principal
    ├── dispositivos.html   # Gerenciamento de dispositivos
    ├── irrigacao.html      # Sistema de irrigação
    ├── dados.html          # Visualização de dados
    ├── configuracoes.html  # Configurações
    └── admin-dashboard.html # Painel administrativo
```

## 🚀 Como Executar

### Desenvolvimento Local

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/vaconauta/AgroSensor.git
   cd AgroSensor
   ```

2. **Execute localmente**:
   - Abra o arquivo `index.html` em um navegador, ou
   - Use um servidor local (recomendado):
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npx http-server
   
   # Com PHP
   php -S localhost:8000
   ```

3. **Acesse a aplicação**:
   - Navegador: `http://localhost:8000`

### Deploy no GitHub Pages

Para fazer deploy, veja o guia completo em [DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)

**Resumo rápido**:
```bash
# Faça suas mudanças
git add .
git commit -m "Atualizações"
git push origin main

# O GitHub Actions fará o deploy automaticamente
```

## ⚙️ Configuração

O arquivo `config.json` contém as principais configurações do sistema:

- **API**: URL do backend e configurações de conexão
- **UI**: Configurações de interface e tema
- **Features**: Habilitação/desabilitação de funcionalidades
- **Cores**: Personalização do tema visual

### Sistema de Navegação

O projeto usa um sistema de navegação otimizado que:
- ✅ Detecta automaticamente o ambiente (local ou GitHub Pages)
- ✅ Ajusta os paths dinamicamente
- ✅ Funciona sem necessidade de configuração manual

## 📱 Responsividade

O WR10 foi desenvolvido com design mobile-first, garantindo:
- ✅ Compatibilidade com dispositivos móveis
- ✅ Adaptação automática para tablets
- ✅ Interface otimizada para desktop
- ✅ Navegação touch-friendly

## 🔧 Otimizações para GitHub Pages

- ✅ **Detecção Automática de BaseURL**: Funciona em qualquer ambiente
- ✅ **404 Personalizado**: Página de erro com redirecionamento inteligente
- ✅ **CI/CD Automático**: Deploy via GitHub Actions
- ✅ **SEO Otimizado**: Metadados e configurações Jekyll
- ✅ **Bypass Jekyll**: Arquivo `.nojekyll` para evitar processamento desnecessário

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📚 Documentação Adicional

- [Guia de Deploy GitHub Pages](DEPLOY_GITHUB_PAGES.md)
- [Personalização de Gráficos](PERSONALIZACAO_GRAFICOS.md)
- [Filtros de Gráficos](FILTROS_GRAFICOS.md)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Vaconauta**
- GitHub: [@vaconauta](https://github.com/vaconauta)

## 🐛 Reportar Bugs

Encontrou um problema? [Abra uma issue](https://github.com/vaconauta/WR10/issues) descrevendo:
- Passos para reproduzir o bug
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do navegador/dispositivo

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!