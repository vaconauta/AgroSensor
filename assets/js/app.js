// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    API_BASE_URL: 'https://api-estacao.onrender.com',
    // Para desenvolvimento local, descomente a linha abaixo:
    // API_BASE_URL: 'http://localhost:3000',
    
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'accessToken',
        USERNAME: 'username',
        USER_DATA: 'userData',
        USER_TYPE: 'userType',
        COMPANY_ID: 'company_id',
        FULL_NAME: 'fullName'
    },
    
    ROUTES: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/users/register',
        SENSORS_DATA: '/api/sensores/dados',
        SENSORS_HISTORY: '/api/sensores/historico',
        SENSORS_CONFIG: '/api/sensores/config',
        CONFIGURATIONS: '/api/configuracoes',
        COMPANY_CONFIG: '/api/company/config',
        ADMIN_SENSOR: '/api/admin/sensor',
        ADMIN_COMPANY: '/api/admin/company',
        ADMIN_USER: '/api/admin/user',
        ADMIN_COMPANIES: '/api/admin/companies',
        ADMIN_USERS: '/api/admin/users',
        ADMIN_SENSORS: '/api/admin/sensors'
    }
};

// ===== UTILITÁRIOS GLOBAIS =====
class Utils {
    // Formatar data
    static formatDate(date, format = 'dd/MM/yyyy HH:mm') {
        if (!date) return '-';
        const d = new Date(date);
        
        if (format === 'dd/MM/yyyy') {
            return d.toLocaleDateString('pt-BR');
        }
        
        if (format === 'dd/MM/yyyy HH:mm') {
            return d.toLocaleString('pt-BR');
        }
        
        return d.toISOString();
    }
    
    // Formatar números
    static formatNumber(number, decimals = 1) {
        if (number === null || number === undefined) return '-';
        return Number(number).toFixed(decimals);
    }
    
    // Validar email
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Gerar ID único
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Scroll suave
    static scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Copiar para clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            NotificationManager.success('Copiado!', 'Texto copiado para a área de transferência');
            return true;
        } catch (err) {
            console.error('Erro ao copiar:', err);
            return false;
        }
    }
}

// ===== GERENCIADOR DE ESTADO GLOBAL =====
class StateManager {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            sensorsData: [],
            configurations: {},
            loading: false
        };
        this.subscribers = [];
    }
    
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
    
    getState() {
        return { ...this.state };
    }
    
    notify() {
        this.subscribers.forEach(callback => callback(this.state));
    }
}

const stateManager = new StateManager();

// ===== GERENCIADOR DE AUTENTICAÇÃO =====
class AuthManager {
    static setToken(token) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    }
    
    static getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    }
    
    static removeToken() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TYPE);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.COMPANY_ID);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.FULL_NAME);
    }
    
    static isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            this.removeToken();
            return false;
        }
    }
    
    static getUserFromToken() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.id,
                username: payload.username || localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME),
                userType: payload.userType || localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TYPE),
                company_id: payload.company_id || localStorage.getItem(CONFIG.STORAGE_KEYS.COMPANY_ID),
                fullName: payload.fullName || localStorage.getItem(CONFIG.STORAGE_KEYS.FULL_NAME),
                // Compatibilidade com versão anterior
                client_id: payload.client_id || payload.company_id
            };
        } catch (error) {
            return null;
        }
    }
    
    static logout() {
        this.removeToken();
        stateManager.setState({ 
            user: null, 
            isAuthenticated: false,
            sensorsData: [],
            configurations: {}
        });
        window.location.href = '/index.html';
    }
    
    static redirectIfNotAuthenticated() {
        if (!this.isAuthenticated()) {
            this.logout();
            return false;
        }
        return true;
    }

    static isAdmin() {
        const userType = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TYPE);
        return userType === 'admin';
    }

    static isUser() {
        const userType = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TYPE);
        return userType === 'user';
    }

    static getCompanyId() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.COMPANY_ID);
    }

    static getUserType() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TYPE);
    }

    static getFullName() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.FULL_NAME);
    }

    static setUserData(userData) {
        if (userData.userType) localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TYPE, userData.userType);
        if (userData.company_id !== undefined) localStorage.setItem(CONFIG.STORAGE_KEYS.COMPANY_ID, userData.company_id || '');
        if (userData.fullName) localStorage.setItem(CONFIG.STORAGE_KEYS.FULL_NAME, userData.fullName);
        if (userData.username) localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, userData.username);
    }
}

// ===== API CLIENT =====
class ApiClient {
    static async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const token = AuthManager.getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        if (token && !options.skipAuth) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    AuthManager.logout();
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                if (response.status === 403) {
                    throw new Error('Você não tem permissão para realizar esta ação.');
                }
                throw new Error(data.message || `Erro HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }
    
    // Auth endpoints
    static async login(username, password) {
        return this.request(CONFIG.ROUTES.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            skipAuth: true
        });
    }
    
    static async register(userData) {
        return this.request(CONFIG.ROUTES.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData),
            skipAuth: true
        });
    }

    static async changePassword(currentPassword, newPassword) {
        return this.request('/api/users/change-password', {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
    }
    
    // Sensor endpoints
    static async getSensorsHistory() {
        return this.request(CONFIG.ROUTES.SENSORS_HISTORY);
    }
    
    static async getSensorsHistoryFiltered(startDate, endDate) {
        const params = new URLSearchParams({
            start: startDate,
            end: endDate
        });
        return this.request(`${CONFIG.ROUTES.SENSORS_HISTORY}/filtrar?${params}`);
    }
    
    // Configuration endpoints
    static async getConfigurations() {
        return this.request(CONFIG.ROUTES.CONFIGURATIONS);
    }
    
    static async updateConfigurations(config) {
        return this.request(CONFIG.ROUTES.CONFIGURATIONS, {
            method: 'PUT',
            body: JSON.stringify(config)
        });
    }
    
    // Admin endpoints
    static async createSensor(companyId, sensorName) {
        return this.request(CONFIG.ROUTES.ADMIN_SENSOR, {
            method: 'POST',
            body: JSON.stringify({
                company_id: companyId,
                nome_sensor: sensorName
            })
        });
    }

    static async createCompany(companyData) {
        return this.request(CONFIG.ROUTES.ADMIN_COMPANY, {
            method: 'POST',
            body: JSON.stringify(companyData)
        });
    }

    static async createUser(userData) {
        return this.request(CONFIG.ROUTES.ADMIN_USER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async getCompanies() {
        return this.request(CONFIG.ROUTES.ADMIN_COMPANIES);
    }

    static async getUsers() {
        return this.request(CONFIG.ROUTES.ADMIN_USERS);
    }

    static async getSensors() {
        return this.request(CONFIG.ROUTES.ADMIN_SENSORS);
    }

    static async deactivateUser(userId) {
        return this.request(`${CONFIG.ROUTES.ADMIN_USER}/${userId}`, {
            method: 'DELETE'
        });
    }

    // Sensor endpoints with company support
    static async getSensorsHistory(companyId = null) {
        let url = CONFIG.ROUTES.SENSORS_HISTORY;
        if (companyId && AuthManager.isAdmin()) {
            url += `?company_id=${companyId}`;
        }
        return this.request(url);
    }

    static async getSensorsHistoryFiltered(startDate, endDate, companyId = null) {
        const params = new URLSearchParams({
            start: startDate,
            end: endDate
        });
        if (companyId && AuthManager.isAdmin()) {
            params.append('company_id', companyId);
        }
        return this.request(`${CONFIG.ROUTES.SENSORS_HISTORY}/filtrar?${params}`);
    }

    static async getConfigurations(companyId = null) {
        let url = CONFIG.ROUTES.CONFIGURATIONS;
        if (companyId && AuthManager.isAdmin()) {
            url += `?company_id=${companyId}`;
        }
        return this.request(url);
    }

    static async updateConfigurations(config, companyId = null) {
        let url = CONFIG.ROUTES.CONFIGURATIONS;
        if (companyId && AuthManager.isAdmin()) {
            url += `?company_id=${companyId}`;
        }
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(config)
        });
    }

    // Company endpoints
    static async createCompanyConfig(config) {
        return this.request(CONFIG.ROUTES.COMPANY_CONFIG, {
            method: 'POST',
            body: JSON.stringify(config)
        });
    }
}

// ===== GERENCIADOR DE NOTIFICAÇÕES =====
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(type, title, message, duration = 5000) {
        const notification = this.createNotification(type, title, message);
        this.container.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        return notification;
    }
    
    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        const icons = {
            success: 'fas fa-check-circle',
            danger: 'fas fa-exclamation-triangle', 
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="${icons[type]}" style="margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 14px; opacity: 0.9;">${message}</div>
            </div>
            <button onclick="notificationManager.remove(this.parentNode)" 
                    style="background: none; border: none; cursor: pointer; opacity: 0.7; padding: 0; margin-left: 8px;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return notification;
    }
    
    remove(notification) {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    success(title, message) {
        return this.show('success', title, message);
    }
    
    error(title, message) {
        return this.show('danger', title, message);
    }
    
    warning(title, message) {
        return this.show('warning', title, message);
    }
    
    info(title, message) {
        return this.show('info', title, message);
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

const notificationManager = new NotificationManager();

// ===== GERENCIADOR DE LOADING =====
class LoadingManager {
    static show(element = null, text = 'Carregando...') {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            this.showGlobalLoading(text);
        }
    }
    
    static hide(element = null) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        } else {
            this.hideGlobalLoading();
        }
    }
    
    static showGlobalLoading(text = 'Carregando...') {
        let overlay = document.getElementById('global-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'global-loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
            `;
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top: 3px solid #2d5a27; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                    <div style="color: #4a5568; font-weight: 500;">${text}</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    }
    
    static hideGlobalLoading() {
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// ===== GERENCIADOR DE ROTAS =====
class RouterManager {
    static navigate(path) {
        window.location.href = path;
    }
    
    static getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    
    static setActiveNavigation() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link, .sidebar-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }
}

// ===== GERENCIADOR DE MODALS =====
class ModalManager {
    static open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    static close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    static create(id, title, content, actions = '') {
        const modalHtml = `
            <div id="${id}" class="modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;">
                <div class="modal-dialog" style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header" style="padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                        <h5 class="modal-title" style="margin: 0; font-weight: 600;">${title}</h5>
                        <button type="button" onclick="ModalManager.close('${id}')" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
                    </div>
                    <div class="modal-body" style="padding: 24px;">
                        ${content}
                    </div>
                    ${actions ? `<div class="modal-footer" style="padding: 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end;">${actions}</div>` : ''}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        return document.getElementById(id);
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (AuthManager.isAuthenticated()) {
        const user = AuthManager.getUserFromToken();
        stateManager.setState({
            user: user,
            isAuthenticated: true
        });
    }
    
    // Configurar navegação ativa
    RouterManager.setActiveNavigation();
    
    // Configurar eventos globais
    setupGlobalEvents();
});

function setupGlobalEvents() {
    // Fechar modals ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Esc para fechar modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="flex"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
    
    // Toggle sidebar em mobile
    const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('show');
            }
        });
    }
}

// ===== EXPORTAR PARA ESCOPO GLOBAL =====
window.CONFIG = CONFIG;
window.Utils = Utils;
window.StateManager = stateManager;
window.AuthManager = AuthManager;
window.ApiClient = ApiClient;
window.NotificationManager = notificationManager;
window.LoadingManager = LoadingManager;
window.RouterManager = RouterManager;
window.ModalManager = ModalManager;