// Exemplo de como o dashboard deveria funcionar com múltiplos sensores

// ===============================
// ESTRUTURA DE DADOS SUGERIDA
// ===============================

// Em vez de um array simples, os dados deveriam ser agrupados por dispositivo:
const sensorsDataByDevice = {
    'SENSOR_001': {
        name: 'Sensor Estufa A',
        location: 'Estufa Principal',
        isOnline: true,
        readings: [
            {
                timestamp: '2025-10-06T10:00:00Z',
                umidade_solo: 65.2,
                quantidade_chuva: 2.3
            },
            // ... mais leituras
        ]
    },
    'SENSOR_002': {
        name: 'Sensor Campo B',
        location: 'Campo Externo',
        isOnline: false,
        readings: [
            {
                timestamp: '2025-10-06T10:00:00Z',
                umidade_solo: 48.7,
                quantidade_chuva: 0.0
            },
            // ... mais leituras
        ]
    }
};

// ===============================
// GRÁFICOS COM MÚLTIPLOS SENSORES
// ===============================

function initializeMultiSensorCharts() {
    // Gráfico de Umidade com múltiplas linhas (uma por sensor)
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: [], // Timestamps comuns
            datasets: [] // Será populado dinamicamente para cada sensor
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return 'Horário: ' + context[0].label;
                        },
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateMultiSensorHumidityChart() {
    const filter = document.getElementById('humidityFilter').value;
    const colors = [
        '#3182ce', '#38a169', '#e53e3e', '#f6ad55', 
        '#9f7aea', '#00d9ff', '#ff6b6b', '#4ecdc4'
    ];
    
    // Limpar datasets anteriores
    humidityChart.data.datasets = [];
    
    let allTimestamps = new Set();
    
    // Coletar todos os timestamps únicos
    Object.values(sensorsDataByDevice).forEach(sensor => {
        const filteredReadings = filterDataByTime(sensor.readings, filter);
        filteredReadings.forEach(reading => {
            allTimestamps.add(reading.timestamp);
        });
    });
    
    // Converter para array ordenado
    const timestamps = Array.from(allTimestamps).sort();
    
    // Criar labels para o eixo X
    humidityChart.data.labels = timestamps.map(timestamp => {
        const date = new Date(timestamp);
        return filter === '24h' 
            ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' });
    });
    
    // Criar dataset para cada sensor
    let colorIndex = 0;
    Object.entries(sensorsDataByDevice).forEach(([deviceKey, sensor]) => {
        const filteredReadings = filterDataByTime(sensor.readings, filter);
        
        // Criar array de dados alinhado com os timestamps
        const data = timestamps.map(timestamp => {
            const reading = filteredReadings.find(r => r.timestamp === timestamp);
            return reading ? reading.umidade_solo : null;
        });
        
        // Adicionar dataset para este sensor
        humidityChart.data.datasets.push({
            label: `${sensor.name} (${sensor.location})`,
            data: data,
            borderColor: colors[colorIndex % colors.length],
            backgroundColor: colors[colorIndex % colors.length] + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            spanGaps: true, // Conectar pontos mesmo com valores nulos
            pointRadius: 3,
            pointHoverRadius: 6
        });
        
        colorIndex++;
    });
    
    humidityChart.update();
}

// ===============================
// CARDS DE ESTATÍSTICAS MELHORADAS
// ===============================

function updateMultiSensorStatistics() {
    // Contar dispositivos online/offline
    const devices = Object.values(sensorsDataByDevice);
    const onlineDevices = devices.filter(d => d.isOnline).length;
    const totalDevices = devices.length;
    
    // Calcular umidade média de todos os sensores
    let totalHumidity = 0;
    let readingCount = 0;
    
    devices.forEach(sensor => {
        const latestReading = sensor.readings[sensor.readings.length - 1];
        if (latestReading) {
            totalHumidity += latestReading.umidade_solo;
            readingCount++;
        }
    });
    
    const avgHumidity = readingCount > 0 ? totalHumidity / readingCount : 0;
    
    // Calcular chuva total do dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let totalRainToday = 0;
    devices.forEach(sensor => {
        const todayReadings = sensor.readings.filter(reading => 
            new Date(reading.timestamp) >= today
        );
        const sensorRainToday = todayReadings.reduce((sum, reading) => 
            sum + reading.quantidade_chuva, 0
        );
        totalRainToday += sensorRainToday;
    });
    
    // Atualizar UI
    document.getElementById('deviceCount').textContent = `${onlineDevices}/${totalDevices}`;
    document.getElementById('avgHumidity').textContent = avgHumidity.toFixed(1) + '%';
    document.getElementById('totalRain').textContent = totalRainToday.toFixed(1) + 'mm';
}

// ===============================
// STATUS DOS DISPOSITIVOS INDIVIDUAL
// ===============================

function updateMultiDeviceStatus() {
    const container = document.getElementById('deviceStatusContainer');
    
    if (Object.keys(sensorsDataByDevice).length === 0) {
        container.innerHTML = `
            <div class="device-status">
                <div class="status-dot offline"></div>
                <div>
                    <strong>Nenhum dispositivo cadastrado</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--text-gray);">
                        Configure dispositivos para começar a receber dados
                    </p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '<div style="margin-bottom: var(--spacing-lg);"><h3 style="margin-bottom: var(--spacing-md);">Status dos Dispositivos</h3>';
    
    Object.entries(sensorsDataByDevice).forEach(([deviceKey, sensor]) => {
        const lastReading = sensor.readings[sensor.readings.length - 1];
        const lastTime = lastReading ? new Date(lastReading.timestamp) : null;
        const timeDiff = lastTime ? Date.now() - lastTime.getTime() : Infinity;
        const isOnline = timeDiff < 30 * 60 * 1000; // 30 minutos
        
        html += `
            <div class="device-status" style="margin-bottom: var(--spacing-sm);">
                <div class="status-dot ${isOnline ? '' : 'offline'}"></div>
                <div style="flex: 1;">
                    <strong>${sensor.name}</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--text-gray);">
                        ${sensor.location} • ${isOnline ? 'Online' : 'Offline'}
                        ${lastTime ? `• Última leitura: ${lastTime.toLocaleString('pt-BR')}` : '• Sem leituras'}
                    </p>
                </div>
                ${lastReading ? `
                    <div style="text-align: right; font-size: 0.875rem;">
                        <div style="font-weight: 600;">${lastReading.umidade_solo.toFixed(1)}%</div>
                        <div style="color: var(--text-gray);">Umidade</div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ===============================
// SELETOR DE SENSORES
// ===============================

function addSensorSelector() {
    // Adicionar seletor para escolher quais sensores mostrar
    const chartHeaders = document.querySelectorAll('.chart-header');
    
    chartHeaders.forEach(header => {
        const existingSelector = header.querySelector('.sensor-selector');
        if (existingSelector) return; // Já existe
        
        const sensorSelector = document.createElement('div');
        sensorSelector.className = 'sensor-selector';
        sensorSelector.style.cssText = 'margin-left: auto; margin-right: 10px;';
        
        let selectorHTML = `
            <select multiple style="min-width: 150px; padding: 4px 8px; border: 1px solid var(--border-gray); border-radius: 4px;">
                <option value="all" selected>Todos os Sensores</option>
        `;
        
        Object.entries(sensorsDataByDevice).forEach(([deviceKey, sensor]) => {
            selectorHTML += `<option value="${deviceKey}" selected>${sensor.name}</option>`;
        });
        
        selectorHTML += '</select>';
        sensorSelector.innerHTML = selectorHTML;
        
        // Inserir antes do filtro de tempo
        const actions = header.querySelector('.chart-actions');
        actions.insertBefore(sensorSelector, actions.firstChild);
    });
}

// ===============================
// EXEMPLO DE DADOS MOCKADOS MULTI-SENSOR
// ===============================

function loadMockMultiSensorData() {
    sensorsDataByDevice = {
        'AGRO_001': {
            name: 'Sensor Principal',
            location: 'Estufa A - Setor 1',
            isOnline: true,
            readings: generateMockReadings('AGRO_001', 0.8) // 80% das leituras
        },
        'AGRO_002': {
            name: 'Sensor Secundário',
            location: 'Campo Aberto B',
            isOnline: true,
            readings: generateMockReadings('AGRO_002', 0.9) // 90% das leituras
        },
        'AGRO_003': {
            name: 'Sensor Reserva',
            location: 'Estufa C - Setor 2',
            isOnline: false,
            readings: generateMockReadings('AGRO_003', 0.3) // 30% das leituras (offline)
        }
    };
}

function generateMockReadings(deviceKey, availability) {
    const readings = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
        // Simular disponibilidade (alguns sensores podem ter falhas)
        if (Math.random() > availability) continue;
        
        const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000));
        
        readings.push({
            timestamp: timestamp.toISOString(),
            umidade_solo: Math.random() * 40 + 30 + (deviceKey.includes('001') ? 10 : 0), // Sensor 001 tem umidade maior
            quantidade_chuva: Math.random() * 3
        });
    }
    
    return readings.reverse(); // Mais antigo primeiro
}