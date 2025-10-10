# Implementação de Filtros nos Gráficos - AgroSensor

## Resumo das Alterações

Foram implementados filtros de período nos gráficos do dashboard, permitindo visualizar dados históricos dos sensores com diferentes intervalos de tempo.

## Rotas da API Implementadas

### 1. Últimas 24 horas de todos os sensores
```
GET /api/sensores/historico?period=24h
```

### 2. Últimos 7 dias de todos os sensores
```
GET /api/sensores/historico?period=7d
```

### 3. Últimos 30 dias de todos os sensores
```
GET /api/sensores/historico?period=30d
```

### 4. Todos os dados (sem filtro de período)
```
GET /api/sensores/historico
```

### 5. Filtro por sensor específico (opcional)
```
GET /api/sensores/historico?period=24h&sensor_id=507f1f77bcf86cd799439011
```

### 6. Com company_id para admins
```
GET /api/sensores/historico?period=7d&company_id=507f1f77bcf86cd799439011
```

## Alterações no Código

### 1. `assets/js/app.js`

#### Método `getSensorsHistory()` atualizado:
```javascript
static async getSensorsHistory(companyId = null, period = null, sensorId = null) {
    const params = new URLSearchParams();
    
    // Adicionar período se fornecido (24h, 7d, 30d)
    if (period) {
        params.append('period', period);
    }
    
    // Adicionar sensor específico se fornecido
    if (sensorId) {
        params.append('sensor_id', sensorId);
    }
    
    // Adicionar company_id se for admin
    if (companyId && AuthManager.isAdmin()) {
        params.append('company_id', companyId);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${CONFIG.ROUTES.SENSORS_HISTORY}?${queryString}` : CONFIG.ROUTES.SENSORS_HISTORY;
    
    return this.request(url);
}
```

**Parâmetros:**
- `companyId`: ID da empresa (opcional, usado por administradores)
- `period`: Período de tempo ('24h', '7d', '30d', ou null para todos os dados)
- `sensorId`: ID de um sensor específico (opcional)

### 2. `pages/dashboard.html`

#### Seletores de filtro atualizados:

**Gráfico de Umidade:**
```html
<select class="filter-selector" id="humidityFilter" onchange="updateHumidityChart()">
    <option value="24h">Últimas 24h</option>
    <option value="7d">Últimos 7 dias</option>
    <option value="30d">Últimos 30 dias</option>
    <option value="all">Todos os dados</option>
</select>
```

**Gráfico de Precipitação:**
```html
<select class="filter-selector" id="rainFilter" onchange="updateRainChart()">
    <option value="24h">Últimas 24h</option>
    <option value="7d">Últimos 7 dias</option>
    <option value="30d">Últimos 30 dias</option>
    <option value="all">Todos os dados</option>
</select>
```

#### Funções JavaScript atualizadas:

##### `updateHumidityChart()` - Agora assíncrona
- Carrega dados da API com o filtro de período selecionado
- Suporta visualização de múltiplos sensores simultaneamente
- Possui fallback para dados locais em caso de falha na API
- Formata labels do eixo X de acordo com o período:
  - **24h**: Exibe horas (ex: "14:30")
  - **7d/30d**: Exibe dia e mês (ex: "15 Jan")
  - **all**: Exibe dia, mês e ano (ex: "15 Jan 25")

##### `updateRainChart()` - Agora assíncrona
- Carrega dados da API com o filtro de período selecionado
- Agrupa dados por período de tempo para melhor visualização
- Possui fallback para dados locais em caso de falha na API
- Agrupamento por período:
  - **24h**: Agrupa por hora
  - **7d**: Agrupa por dia da semana
  - **30d**: Agrupa por dia do mês
  - **all**: Agrupa por semana

##### `groupReadingsByTimePeriod()` - Atualizada
- Suporta agrupamento para a opção "all"
- Agrupa dados de todos os sensores por período de tempo
- Calcula soma total de precipitação por período

##### `filterDataByTime()` - Atualizada
- Retorna todos os dados quando filter === 'all'
- Mantém compatibilidade com filtros existentes (24h, 7d, 30d)

## Recursos Implementados

### ✅ Filtros de Período
- Últimas 24 horas
- Últimos 7 dias
- Últimos 30 dias
- Todos os dados

### ✅ Integração com API
- Chamadas assíncronas para carregar dados filtrados
- Suporte a múltiplos sensores
- Suporte a filtro por sensor específico (sensor_id)
- Suporte a company_id para administradores

### ✅ Fallback e Tratamento de Erros
- Funções de fallback usando dados já carregados
- Tratamento de erros com console.error
- Validação de gráficos inicializados

### ✅ Formatação Inteligente
- Labels do eixo X adaptadas ao período selecionado
- Agrupamento de dados otimizado para cada período
- Suporte a múltiplos sensores com cores diferentes

## Fluxo de Dados

1. **Usuário seleciona filtro** → onchange dispara `updateHumidityChart()` ou `updateRainChart()`
2. **Função assíncrona** → Chama `ApiClient.getSensorsHistory(companyId, period)`
3. **API retorna dados** → Filtrados pelo período especificado
4. **Processamento** → Dados são agrupados e formatados
5. **Atualização** → Gráfico é atualizado com `chart.update()`
6. **Em caso de erro** → Fallback usa dados locais já carregados

## Compatibilidade

- ✅ Funciona com múltiplos sensores
- ✅ Suporte para administradores (company_id)
- ✅ Suporte para usuários comuns
- ✅ Funciona sem período (retorna todos os dados)
- ✅ Funciona com sensor específico (sensor_id)

## Testando

### No Console do Navegador:

```javascript
// Testar carregamento com diferentes períodos
await ApiClient.getSensorsHistory(null, '24h');
await ApiClient.getSensorsHistory(null, '7d');
await ApiClient.getSensorsHistory(null, '30d');
await ApiClient.getSensorsHistory(null, null); // Todos os dados

// Com sensor específico
await ApiClient.getSensorsHistory(null, '24h', '507f1f77bcf86cd799439011');

// Como admin, com company_id
await ApiClient.getSensorsHistory('507f1f77bcf86cd799439011', '7d');
```

### Verificar Filtros Funcionando:

1. Abra o dashboard
2. Selecione diferentes períodos nos seletores
3. Observe os gráficos se atualizando
4. Verifique no Network tab do DevTools as chamadas à API com os parâmetros corretos

## Exemplos de URLs Geradas

```
/api/sensores/historico?period=24h
/api/sensores/historico?period=7d
/api/sensores/historico?period=30d
/api/sensores/historico
/api/sensores/historico?period=24h&sensor_id=507f1f77bcf86cd799439011
/api/sensores/historico?period=7d&company_id=507f1f77bcf86cd799439011
/api/sensores/historico?period=24h&sensor_id=507f1f77bcf86cd799439011&company_id=507f1f77bcf86cd799439011
```

## Próximos Passos (Sugestões)

- [ ] Adicionar seletor de sensor específico na UI
- [ ] Implementar cache de dados para reduzir chamadas à API
- [ ] Adicionar loading indicator durante carregamento de dados
- [ ] Implementar exportação de dados filtrados
- [ ] Adicionar comparação entre períodos diferentes
- [ ] Implementar filtro por data personalizada (date range picker)

---

**Data de implementação:** 10/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Implementado e testado
