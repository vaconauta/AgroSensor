// ===== ROUTER CONFIGURATION =====
// Sistema de navegação otimizado para GitHub Pages

class Router {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/dashboard': 'pages/dashboard.html',
            '/dispositivos': 'pages/dispositivos.html',
            '/irrigacao': 'pages/irrigacao.html',
            '/dados': 'pages/dados.html',
            '/configuracoes': 'pages/configuracoes.html',
            '/admin': 'pages/admin-dashboard.html'
        };
        
        // Detecta automaticamente o baseURL do GitHub Pages
        this.baseURL = this.detectBaseURL();
        
        // Inicializa o router
        this.init();
    }
    
    /**
     * Detecta automaticamente o baseURL baseado no hostname
     * Para desenvolvimento local: ''
     * Para GitHub Pages: '/nome-do-repo'
     */
    detectBaseURL() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        // Desenvolvimento local
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return '';
        }
        
        // GitHub Pages - formato: username.github.io/repo-name
        if (hostname.includes('github.io')) {
            const parts = pathname.split('/').filter(Boolean);
            // Se houver um nome de repositório no path
            if (parts.length > 0 && !parts[0].endsWith('.html')) {
                return '/' + parts[0];
            }
        }
        
        return '';
    }
    
    /**
     * Resolve path relativo para absoluto considerando o baseURL
     */
    resolvePath(path) {
        // Se já é um path absoluto, retorna
        if (path.startsWith('http') || path.startsWith('//')) {
            return path;
        }
        
        // Remove barra inicial se houver
        path = path.replace(/^\//, '');
        
        // Adiciona baseURL se necessário
        if (this.baseURL && !path.startsWith(this.baseURL)) {
            return `${this.baseURL}/${path}`;
        }
        
        return '/' + path;
    }
    
    /**
     * Navega para uma rota específica
     */
    navigate(route, addToHistory = true) {
        const path = this.routes[route] || route;
        const fullPath = this.resolvePath(path);
        
        if (addToHistory) {
            window.history.pushState({ route }, '', fullPath);
        }
        
        this.loadPage(fullPath);
    }
    
    /**
     * Carrega uma página
     */
    loadPage(path) {
        // Para navegação SPA, você pode implementar carregamento dinâmico aqui
        // Por enquanto, faz navegação tradicional
        window.location.href = path;
    }
    
    /**
     * Volta para página anterior
     */
    back() {
        window.history.back();
    }
    
    /**
     * Avança para próxima página
     */
    forward() {
        window.history.forward();
    }
    
    /**
     * Inicializa o router
     */
    init() {
        // Escuta eventos de navegação do browser
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                this.navigate(event.state.route, false);
            }
        });
        
        // Intercepta cliques em links internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);
            }
        });
    }
    
    /**
     * Helper para obter URL completa de um recurso
     */
    getAssetURL(path) {
        if (path.startsWith('http') || path.startsWith('//')) {
            return path;
        }
        
        // Remove ./ do início se houver
        path = path.replace(/^\.\//, '');
        
        if (this.baseURL) {
            return `${this.baseURL}/${path}`;
        }
        
        return '/' + path;
    }
}

// Inicializa o router globalmente
const router = new Router();

// Exporta helpers globais
window.resolveURL = (path) => router.resolvePath(path);
window.getAssetURL = (path) => router.getAssetURL(path);
window.navigateTo = (route) => router.navigate(route);

console.log('Router inicializado com baseURL:', router.baseURL);
