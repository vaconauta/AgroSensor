// Registro do Service Worker e controle de instalação PWA - WR10
(function() {
    'use strict';

    let deferredPrompt = null;

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Calcular path correto do service-worker.js (relativo ao base do site)
            const baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            const swPath = baseUrl + 'service-worker.js';
            
            navigator.serviceWorker.register(swPath)
                .then((registration) => {
                    console.log('[PWA] ✅ Service Worker registrado:', registration.scope);
                    console.log('[PWA] 📍 Path:', swPath);
                    
                    // Verificar atualizações
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('[PWA] 🔄 Nova versão encontrada');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] ❌ Erro ao registrar Service Worker:', error);
                });
        });
    }

    // Capturar evento de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] 📱 Evento beforeinstallprompt capturado');
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    // Detectar quando o app foi instalado
    window.addEventListener('appinstalled', (e) => {
        console.log('[PWA] 🎉 App instalado com sucesso!');
        deferredPrompt = null;
        hideInstallButton();
        
        // Mostrar notificação de sucesso se disponível
        if (window.NotificationManager && typeof window.NotificationManager.success === 'function') {
            window.NotificationManager.success(
                'App instalado!',
                'WR10 foi instalado com sucesso no seu dispositivo'
            );
        }
    });

    function showInstallButton() {
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-button';
            installBtn.innerHTML = '<i class="fas fa-download"></i> <span>Instalar App</span>';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: linear-gradient(135deg, #2d7a3e 0%, #1e5a2d 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 14px 28px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(45, 122, 62, 0.4);
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
                animation: slideInUp 0.5s ease-out;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                #pwa-install-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 25px rgba(45, 122, 62, 0.5);
                }
                
                #pwa-install-btn:active {
                    transform: translateY(-1px);
                }
                
                @media (max-width: 768px) {
                    #pwa-install-btn {
                        bottom: 15px;
                        right: 15px;
                        padding: 12px 24px;
                        font-size: 14px;
                    }
                }
            `;
            
            document.head.appendChild(style);
            installBtn.addEventListener('click', installPWA);
            document.body.appendChild(installBtn);
        }
        
        installBtn.style.display = 'flex';
    }

    function hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    async function installPWA() {
        if (!deferredPrompt) {
            console.log('[PWA] ⚠️ Prompt não disponível');
            return;
        }

        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Instalando...</span>';
            installBtn.disabled = true;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('[PWA] 📊 Resposta do usuário:', outcome);
        
        if (outcome === 'accepted') {
            console.log('[PWA] ✅ Usuário aceitou a instalação');
        } else {
            console.log('[PWA] ❌ Usuário recusou a instalação');
            if (installBtn) {
                installBtn.innerHTML = '<i class="fas fa-download"></i> <span>Instalar App</span>';
                installBtn.disabled = false;
            }
        }
        
        deferredPrompt = null;
    }

    function showUpdateNotification() {
        if (document.getElementById('pwa-update-notification')) return;

        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
            padding: 18px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            max-width: 350px;
            animation: slideInLeft 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-sync-alt" style="font-size: 24px;"></i>
                <div style="flex: 1;">
                    <strong style="display: block; margin-bottom: 4px;">Nova versão disponível!</strong>
                    <small style="opacity: 0.9;">Atualize para obter os recursos mais recentes</small>
                </div>
            </div>
            <button onclick="window.location.reload()" style="
                margin-top: 12px;
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 8px;
                background: white;
                color: #138496;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.3s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                <i class="fas fa-redo"></i> Atualizar Agora
            </button>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
                padding: 4px 8px;
            ">×</button>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
    }

    // API pública
    window.installPWA = installPWA;
    window.isPWA = () => window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true ||
                          document.referrer.includes('android-app://');
    
    // Log do status PWA
    console.log('[PWA] 📱 Executando como PWA:', window.isPWA());
})();
