# 📊 Guia de Personalização de Gráficos - Dashboard WR10

## 🎨 Funcionalidades Implementadas

### 1. **Tipos de Gráfico**
Cada gráfico pode ser exibido em 3 formatos diferentes:

- **📈 Linha**: Visualização linear conectando os pontos de dados
- **📊 Barra**: Visualização em barras verticais
- **🏔️ Área**: Linha com preenchimento colorido abaixo

**Como usar:**
1. Clique no ícone de engrenagem ⚙️ no canto superior direito do gráfico
2. Selecione o tipo desejado na seção "TIPO DE GRÁFICO"
3. A mudança é aplicada instantaneamente

---

### 2. **Redimensionamento de Gráficos**
Os gráficos agora podem ser redimensionados verticalmente:

**Como usar:**
1. Passe o mouse sobre o canto inferior direito do gráfico
2. Um cursor de redimensionamento (↘️) aparecerá
3. Clique e arraste para cima ou para baixo
4. **Limites**: Entre 300px (mínimo) e 800px (máximo)
5. A altura é **salva automaticamente** no seu navegador

**Atalho CSS:**
- Os containers agora têm `resize: vertical` ativado
- Você também pode arrastar a borda inferior diretamente (navegadores modernos)

---

### 3. **Opções de Visualização**

#### 🎛️ **Mostrar Grid**
- Ativa/desativa as linhas de grade do gráfico
- Útil para leituras mais precisas ou visual mais limpo

#### 🔵 **Mostrar Pontos**
- Ativa/desativa os círculos em cada ponto de dados
- Recomendado para gráficos com poucos dados

#### 🎨 **Preencher Área**
- Ativa/desativa o preenchimento colorido sob as linhas
- Funciona apenas em gráficos de linha
- Cria efeito visual de área

**Como usar:**
- Cada opção tem um **toggle switch** (interruptor)
- Clique para ligar/desligar
- Verde = Ativo | Cinza = Desativado

---

### 4. **Persistência de Configurações**

Todas as suas preferências são salvas automaticamente:

✅ **Salvo no navegador:**
- Tipo de gráfico (linha/barra/área)
- Estado do grid (ligado/desligado)
- Visibilidade dos pontos
- Preenchimento de área
- Altura personalizada de cada gráfico

🔄 **Restauração automática:**
- Ao recarregar a página, todas as configurações voltam como você deixou
- Cada gráfico mantém suas preferências individuais

---

## 🎯 Atalhos e Dicas

### Atalhos de Teclado
- **ESC**: Fecha o menu de configurações aberto

### Dicas de Uso

1. **Gráfico de Linha**: Melhor para visualizar tendências ao longo do tempo
2. **Gráfico de Barra**: Melhor para comparar valores em momentos específicos
3. **Gráfico de Área**: Melhor para mostrar volume/acumulação

### Boas Práticas

✅ **Recomendado:**
- Use **linha** para dados contínuos (umidade, temperatura)
- Use **barra** para eventos discretos (chuva por hora)
- Ative **pontos** quando há poucos dados (< 50 pontos)
- Desative **grid** para apresentações ou capturas de tela

❌ **Evite:**
- Redimensionar muito pequeno (< 300px) - dificulta leitura
- Desativar grid E pontos simultaneamente em gráficos de linha

---

## 🛠️ Estrutura Técnica

### Armazenamento Local
```javascript
// Configurações salvas em localStorage
{
  "humidity": {
    "type": "line",      // linha, barra ou área
    "showGrid": true,    // mostrar grade
    "showPoints": true,  // mostrar pontos
    "fill": true         // preencher área
  },
  "rain": {
    "type": "line",
    "showGrid": true,
    "showPoints": true,
    "fill": true
  }
}

// Alturas salvas separadamente
humidityChartContainer_height: "500"
rainChartContainer_height: "450"
```

### Funções JavaScript Disponíveis

```javascript
// Trocar tipo de gráfico
changeChartType('humidity', 'line');  // ou 'bar' ou 'area'

// Toggles de visualização
toggleChartGrid('humidity');    // Ligar/desligar grid
toggleChartPoints('humidity');  // Ligar/desligar pontos
toggleChartFill('humidity');    // Ligar/desligar preenchimento

// Abrir/fechar configurações
toggleChartSettings('humidity'); // ou 'rain'

// Salvar preferências manualmente
saveChartPreferences();

// Carregar preferências manualmente
loadChartPreferences();
```

---

## 🎨 Personalização de Cores

### Cores Padrão

**Umidade do Solo:**
- Azul: `#3182ce` (linha principal)
- Background: `rgba(49, 130, 206, 0.1)` (preenchimento)

**Precipitação:**
- Verde: `#7fb069` (linha principal)
- Background: `rgba(127, 176, 105, 0.1)` (preenchimento)

### Múltiplos Sensores
- Cada sensor recebe uma cor diferente automaticamente
- Paleta de 8 cores distintas
- Rotação automática se houver mais de 8 sensores

---

## 📱 Responsividade

As personalizações funcionam em todos os tamanhos de tela:

- **Desktop (> 1024px)**: Todos os recursos disponíveis
- **Tablet (768-1024px)**: Redimensionamento adaptado
- **Mobile (< 768px)**: Redimensionamento desabilitado, altura fixa otimizada

---

## 🔧 Solução de Problemas

### Configurações não salvam
**Causa**: LocalStorage desabilitado ou cheio
**Solução**: 
1. Verifique as configurações de privacidade do navegador
2. Limpe dados antigos do site
3. Tente em modo anônimo para testar

### Gráfico não redimensiona
**Causa**: Navegador não suporta ou CSS conflitante
**Solução**:
1. Use o handle (↘️) no canto inferior direito
2. Atualize o navegador para última versão
3. Teste em navegador diferente

### Dropdown não fecha
**Causa**: JavaScript não carregado completamente
**Solução**:
1. Recarregue a página (F5)
2. Clique fora da área do dropdown
3. Pressione ESC

---

## 🚀 Próximas Funcionalidades (Futuro)

- [ ] Exportar gráfico como imagem (PNG/SVG)
- [ ] Paleta de cores personalizável
- [ ] Temas claro/escuro para gráficos
- [ ] Animações personalizáveis
- [ ] Compartilhar configurações entre usuários
- [ ] Presets salvos (ex: "Apresentação", "Análise", "Monitoramento")

---

## 📝 Notas Técnicas

### Bibliotecas Utilizadas
- **Chart.js 4.x**: Renderização de gráficos
- **chartjs-plugin-zoom**: Zoom e pan nos gráficos
- **Hammer.js**: Gestos touch para mobile

### Compatibilidade
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE11 (não suportado)

---

**Desenvolvido para WR10 - Sistema de Monitoramento Agrícola**
