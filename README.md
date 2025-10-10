# WR10 🔧

Sistema de monitoramento inteligente com interface web responsiva para acompanhamento de dados de sensores em tempo real.

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

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura e marcação semântica
- **CSS3**: Estilização responsiva e moderna
- **JavaScript**: Interatividade e conexão com API
- **Font Awesome**: Ícones modernos
- **Google Fonts**: Tipografia (Inter)
- **API Integration**: Conexão com backend para dados em tempo real

## 🌐 Demo Online

O projeto está disponível online através do GitHub Pages:
[https://vaconauta.github.io/WR10/](https://vaconauta.github.io/WR10/)

## 📁 Estrutura do Projeto

```
WR10/
├── index.html              # Página principal (login)
├── config.json             # Configurações do sistema
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos principais
│   ├── img/               # Imagens e ícones
│   └── js/
│       └── app.js         # Lógica da aplicação
└── pages/
    ├── dashboard.html      # Dashboard principal
    ├── dispositivos.html   # Gerenciamento de dispositivos
    ├── irrigacao.html      # Sistema de irrigação
    ├── dados.html          # Visualização de dados
    ├── configuracoes.html  # Configurações
    └── admin-dashboard.html # Painel administrativo
```

## 🚀 Como Executar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/vaconauta/WR10.git
   cd WR10
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

## ⚙️ Configuração

O arquivo `config.json` contém as principais configurações do sistema:

- **API**: URL do backend e configurações de conexão
- **UI**: Configurações de interface e tema
- **Features**: Habilitação/desabilitação de funcionalidades
- **Cores**: Personalização do tema visual

## 📱 Responsividade

O WR10 foi desenvolvido com design mobile-first, garantindo:
- ✅ Compatibilidade com dispositivos móveis
- ✅ Adaptação automática para tablets
- ✅ Interface otimizada para desktop
- ✅ Navegação touch-friendly

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

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