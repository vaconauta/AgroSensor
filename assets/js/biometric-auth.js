// ===== GERENCIADOR DE AUTENTICAÇÃO BIOMÉTRICA =====
// Utiliza Web Authentication API (WebAuthn) para autenticação com digital/face

class BiometricAuth {
    constructor() {
        this.STORAGE_KEYS = {
            BIOMETRIC_ENABLED: 'biometricEnabled',
            CREDENTIAL_ID: 'credentialId',
            USER_HANDLE: 'userHandle',
            BIOMETRIC_USERNAME: 'biometricUsername'
        };
    }

    // Verificar se o dispositivo suporta autenticação biométrica
    isSupported() {
        return window.PublicKeyCredential !== undefined && 
               navigator.credentials !== undefined;
    }

    // Verificar se há biometria disponível (plataforma suporta)
    async isPlatformAuthenticatorAvailable() {
        if (!this.isSupported()) return false;
        
        try {
            return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch (error) {
            console.error('Erro ao verificar autenticador:', error);
            return false;
        }
    }

    // Verificar se o usuário já tem biometria configurada
    isBiometricEnabled() {
        return localStorage.getItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED) === 'true';
    }

    // Gerar um desafio aleatório (challenge)
    generateChallenge() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return array;
    }

    // Converter ArrayBuffer para Base64URL
    arrayBufferToBase64Url(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    // Converter Base64URL para ArrayBuffer
    base64UrlToArrayBuffer(base64url) {
        const base64 = base64url
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Registrar credencial biométrica (após login bem-sucedido)
    async registerBiometric(username, displayName = null) {
        if (!await this.isPlatformAuthenticatorAvailable()) {
            throw new Error('Autenticação biométrica não disponível neste dispositivo');
        }

        try {
            const challenge = this.generateChallenge();
            const userId = new TextEncoder().encode(username);

            const publicKeyCredentialCreationOptions = {
                challenge: challenge,
                rp: {
                    name: "WR10 Sistema de Monitoramento",
                    id: window.location.hostname
                },
                user: {
                    id: userId,
                    name: username,
                    displayName: displayName || username
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },  // ES256
                    { alg: -257, type: "public-key" } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required",
                    residentKey: "preferred"
                },
                timeout: 60000,
                attestation: "none"
            };

            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            if (!credential) {
                throw new Error('Falha ao criar credencial biométrica');
            }

            // Extrair chave pública da credencial
            const credentialIdBase64 = this.arrayBufferToBase64Url(credential.rawId);
            const publicKeyBase64 = this.arrayBufferToBase64Url(
                credential.response.getPublicKey ? 
                credential.response.getPublicKey() : 
                credential.response.publicKey || credential.rawId
            );

            // Enviar para o backend
            if (window.ApiClient) {
                try {
                    await window.ApiClient.request('/api/auth/biometric/register', {
                        method: 'POST',
                        body: JSON.stringify({
                            credentialId: credentialIdBase64,
                            publicKey: publicKeyBase64,
                            deviceType: 'platform'
                        })
                    });
                    console.log('✅ Credencial registrada no servidor');
                } catch (apiError) {
                    console.error('Erro ao registrar no servidor:', apiError);
                    throw new Error('Falha ao registrar credencial no servidor: ' + apiError.message);
                }
            }

            // Salvar credenciais no localStorage (backup local)
            localStorage.setItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
            localStorage.setItem(this.STORAGE_KEYS.CREDENTIAL_ID, credentialIdBase64);
            localStorage.setItem(this.STORAGE_KEYS.USER_HANDLE, 
                this.arrayBufferToBase64Url(userId));
            localStorage.setItem(this.STORAGE_KEYS.BIOMETRIC_USERNAME, username);

            console.log('✅ Biometria registrada com sucesso');
            return true;

        } catch (error) {
            console.error('Erro ao registrar biometria:', error);
            
            if (error.name === 'NotAllowedError') {
                throw new Error('Permissão negada ou operação cancelada pelo usuário');
            } else if (error.name === 'NotSupportedError') {
                throw new Error('Método de autenticação não suportado');
            } else if (error.name === 'InvalidStateError') {
                throw new Error('Credencial já existe para este usuário');
            }
            
            throw new Error('Erro ao configurar biometria: ' + error.message);
        }
    }

    // Autenticar usando biometria
    async authenticateWithBiometric() {
        if (!this.isBiometricEnabled()) {
            throw new Error('Biometria não está configurada');
        }

        if (!await this.isPlatformAuthenticatorAvailable()) {
            throw new Error('Autenticação biométrica não disponível');
        }

        try {
            const challenge = this.generateChallenge();
            const credentialIdBase64 = localStorage.getItem(this.STORAGE_KEYS.CREDENTIAL_ID);
            
            if (!credentialIdBase64) {
                throw new Error('Credencial biométrica não encontrada');
            }

            const credentialId = this.base64UrlToArrayBuffer(credentialIdBase64);

            const publicKeyCredentialRequestOptions = {
                challenge: challenge,
                allowCredentials: [{
                    id: credentialId,
                    type: 'public-key',
                    transports: ['internal']
                }],
                userVerification: "required",
                timeout: 60000
            };

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            if (!assertion) {
                throw new Error('Falha na autenticação biométrica');
            }

            // Obter username armazenado
            const username = localStorage.getItem(this.STORAGE_KEYS.BIOMETRIC_USERNAME);
            
            if (!username) {
                throw new Error('Usuário biométrico não encontrado');
            }

            // Autenticar no backend
            if (window.ApiClient) {
                try {
                    const response = await window.ApiClient.request('/api/auth/biometric/authenticate', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: username,
                            credentialId: credentialIdBase64,
                            signature: this.arrayBufferToBase64Url(assertion.response.signature)
                        }),
                        skipAuth: true
                    });

                    console.log('✅ Autenticação biométrica bem-sucedida no servidor');
                    
                    // Retornar resposta do servidor com token
                    return {
                        success: true,
                        username: username,
                        token: response.token,
                        userType: response.userType,
                        company_id: response.company_id,
                        fullName: response.fullName
                    };
                } catch (apiError) {
                    console.error('Erro na autenticação no servidor:', apiError);
                    throw new Error('Falha na autenticação: ' + apiError.message);
                }
            }
            
            // Fallback: retornar apenas sucesso local (não recomendado para produção)
            console.log('⚠️ Autenticação biométrica apenas local (sem backend)');
            return {
                success: true,
                username: username
            };

        } catch (error) {
            console.error('Erro na autenticação biométrica:', error);
            
            if (error.name === 'NotAllowedError') {
                throw new Error('Biometria não reconhecida ou operação cancelada');
            } else if (error.name === 'InvalidStateError') {
                throw new Error('Credencial inválida ou expirada');
            }
            
            throw new Error('Falha na autenticação biométrica: ' + error.message);
        }
    }

    // Remover biometria configurada
    async disableBiometric() {
        // Remover do backend primeiro
        if (window.ApiClient) {
            try {
                await window.ApiClient.request('/api/auth/biometric/remove', {
                    method: 'DELETE',
                    body: JSON.stringify({})
                });
                console.log('✅ Credencial removida do servidor');
            } catch (apiError) {
                console.error('Erro ao remover do servidor:', apiError);
                // Continuar removendo localmente mesmo se falhar no servidor
            }
        }

        // Remover do localStorage
        localStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
        localStorage.removeItem(this.STORAGE_KEYS.CREDENTIAL_ID);
        localStorage.removeItem(this.STORAGE_KEYS.USER_HANDLE);
        localStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_USERNAME);
        console.log('✅ Biometria removida localmente');
    }

    // Obter informações sobre a biometria configurada
    getBiometricInfo() {
        if (!this.isBiometricEnabled()) {
            return null;
        }

        return {
            enabled: true,
            username: localStorage.getItem(this.STORAGE_KEYS.BIOMETRIC_USERNAME),
            deviceSupported: this.isSupported()
        };
    }

    // Verificar se deve mostrar prompt de configuração biométrica
    shouldShowBiometricSetup() {
        // Não mostrar se já está configurado
        if (this.isBiometricEnabled()) {
            return false;
        }

        // Verificar se o usuário já recusou anteriormente (opcional)
        const biometricDismissed = localStorage.getItem('biometricSetupDismissed');
        if (biometricDismissed === 'true') {
            return false;
        }

        return true;
    }

    // Marcar que o usuário recusou a configuração
    dismissBiometricSetup() {
        localStorage.setItem('biometricSetupDismissed', 'true');
    }

    // Permitir reconfigurar biometria
    allowBiometricSetup() {
        localStorage.removeItem('biometricSetupDismissed');
    }
}

// Instância global
const biometricAuth = new BiometricAuth();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.BiometricAuth = BiometricAuth;
    window.biometricAuth = biometricAuth;
}
