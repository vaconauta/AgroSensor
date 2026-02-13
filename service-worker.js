// Service Worker para PWA - WR10 Dashboard
// MODO: SEM CACHE - Sempre busca da rede
const CACHE_NAME = 'wr10-no-cache-v1';

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] 🔧 Instalando Service Worker (NO CACHE MODE)...');
  // Ativa imediatamente sem fazer cache
  event.waitUntil(self.skipWaiting());
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] 🚀 Ativando Service Worker (NO CACHE MODE)...');
  
  event.waitUntil(
    // Remove TODOS os caches existentes
    caches.keys()
      .then((cacheNames) => {
        console.log('[SW] 🗑️ Removendo TODOS os caches:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => {
        console.log('[SW] ✅ Service Worker ativado - Cache desabilitado');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições - SEMPRE DA REDE, NUNCA CACHE
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições de extensões do Chrome
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // SEMPRE buscar da rede, NUNCA do cache
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store' // Força a não usar cache
    })
      .then((response) => {
        console.log('[SW] 🌐 Requisição da rede:', event.request.url);
        return response;
      })
      .catch((error) => {
        console.error('[SW] ❌ Erro na requisição:', error);
        return new Response('Erro de rede - verifique sua conexão', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      })
  );
});

// Receber mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
