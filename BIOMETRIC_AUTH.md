# Autenticação Biométrica - Sistema WR10

## 📱 Visão Geral

A autenticação biométrica foi implementada no PWA WR10 usando a **Web Authentication API (WebAuthn)**, permitindo que os usuários façam login usando:

- 🔐 **Digital** (leitor de impressão digital)
- 👤 **Reconhecimento facial** (Face ID, Windows Hello)
- 🔑 **Outros autenticadores de plataforma**

## ✨ Funcionalidades

### 1. **Configuração Inicial**
Após o primeiro login com credenciais:
- Um modal pergunta ao usuário se deseja ativar a biometria
- O usuário pode aceitar ou dispensar
- Se aceitar, o sistema registra as credenciais biométricas no dispositivo

### 2. **Login Biométrico**
Na tela de login:
- Se a biometria estiver configurada, aparece um botão "Entrar com Biometria"
- O usuário clica e é solicitado a autenticar com sua biometria
- Login instantâneo sem digitar usuário/senha

### 3. **Gerenciamento**
Na página de Configurações:
- Seção dedicada à autenticação biométrica
- Visualizar status (ativada/desativada)
- Ativar ou desativar a biometria a qualquer momento
- Feedback visual sobre disponibilidade no dispositivo

## 🔧 Arquitetura Técnica

### Arquivos Criados/Modificados

#### 1. **`assets/js/biometric-auth.js`**
Módulo principal com a classe `BiometricAuth`:

```javascript
- isSupported() // Verifica se WebAuthn está disponível
- isPlatformAuthenticatorAvailable() // Verifica biometria no dispositivo
- registerBiometric(username, displayName) // Registra credencial
- authenticateWithBiometric() // Autentica com biometria
- disableBiometric() // Remove credencial
- isBiometricEnabled() // Verifica se está configurado
```

#### 2. **`index.html`**
- Importação do módulo biométrico
- Modal de configuração pós-login
- Botão de login biométrico
- Lógica de integração com fluxo de autenticação

#### 3. **`pages/configuracoes.html`**
- Seção de gerenciamento de biometria
- Funções de ativar/desativar
- Interface com feedback visual

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ **Chrome/Edge** 85+ (Android, Windows)
- ✅ **Safari** 13+ (iOS, macOS)
- ✅ **Firefox** 87+ (limitado)
- ✅ **Samsung Internet** 13+

### Plataformas
- ✅ **Android** - Impressão digital, reconhecimento facial
- ✅ **iOS** - Touch ID, Face ID
- ✅ **Windows** - Windows Hello (face, PIN, impressão digital)
- ✅ **macOS** - Touch ID
- ⚠️ **Linux** - Suporte limitado

### Requisitos
- 🔒 **HTTPS obrigatório** (ou localhost para desenvolvimento)
- 📱 Dispositivo com autenticador de plataforma
- 🌐 Navegador com suporte a WebAuthn

## 🔒 Segurança

### Dados Armazenados Localmente
```javascript
localStorage:
  - biometricEnabled: 'true/false'
  - credentialId: 'Base64URL-encoded ID'
  - userHandle: 'Base64URL-encoded user ID'
  - biometricUsername: 'username'
```

### Características de Segurança
1. **Chave privada nunca deixa o dispositivo** - Armazenada no chip de segurança (TPM/Secure Enclave)
2. **Challenge-response** - Cada autenticação usa um desafio único
3. **Vinculação ao domínio** - Credenciais só funcionam no domínio registrado
4. **Biometria local** - Processamento feito no dispositivo, não na nuvem

## 📝 Fluxo de Uso

### Primeiro Login
```
1. Usuário faz login com username/senha
2. Login bem-sucedido ✓
3. Sistema verifica:
   - Dispositivo suporta biometria? 
   - Usuário já configurou biometria?
   - Usuário já dispensou anteriormente?
4. Se aplicável, mostra modal:
   "Deseja ativar login biométrico?"
5. Usuário escolhe:
   - "Ativar" → Registra biometria
   - "Agora não" → Continua sem biometria
6. Redireciona para dashboard
```

### Login Subsequente (com biometria ativa)
```
1. Usuário abre aplicativo
2. Vê botão "Entrar com Biometria"
3. Clica no botão
4. Sistema solicita autenticação biométrica
5. Usuário autentica (digital/face)
6. Login instantâneo ✓
7. Redireciona para dashboard
```

### Desativação
```
1. Menu → Configurações
2. Seção "Autenticação Biométrica"
3. Botão "Desativar Biometria"
4. Confirma ação
5. Credencial removida ✓
```

## 🔄 Recuperação e Fallback

### Cenários de Erro
1. **Biometria não reconhecida** → Usuário pode usar login tradicional
2. **Sessão expirada** → Requer login com credenciais
3. **Dispositivo sem suporte** → Login tradicional disponível
4. **Credencial inválida** → Mensagem clara + opção de login normal

### Tratamento de Erros
```javascript
NotAllowedError → "Biometria não reconhecida ou operação cancelada"
NotSupportedError → "Método não suportado neste dispositivo"
InvalidStateError → "Credencial inválida ou expirada"
NetworkError → "Erro de conexão"
```

## 🔧 Configuração para Desenvolvimento

### Teste Local (localhost)
```javascript
// Funciona em localhost mesmo sem HTTPS
http://localhost:3000 ✓
```

### Teste em Dispositivo Móvel (requer HTTPS)
```javascript
// Usar túnel ou certificado SSL
https://seu-dominio.com ✓
https://192.168.x.x ✗ (só com certificado válido)
```

### Simular Biometria (Chrome DevTools)
1. Abrir DevTools (F12)
2. Menu → More Tools → WebAuthn
3. Enable virtual authenticator environment
4. Adicionar autenticador virtual

## 📊 Métricas e Logs

### Console Logs
```javascript
✅ Biometria registrada com sucesso
✅ Autenticação biométrica bem-sucedida
✅ Biometria removida
🔐 Biometria disponível: true/false
🔐 Biometria configurada: true/false
⚠️ BiometricAuth não disponível
```

### Monitoramento Recomendado
- Taxa de adoção de biometria
- Taxa de sucesso de autenticação
- Dispositivos/navegadores mais usados
- Erros mais comuns

## 🚀 Melhorias Futuras

### Possíveis Implementações
1. **Backup de credenciais** - Sync entre dispositivos
2. **Multi-dispositivo** - Registrar biometria em vários aparelhos
3. **Biometria + 2FA** - Camada adicional de segurança
4. **Analytics** - Rastreamento de uso
5. **Notificações** - Alertas de novos logins biométricos

## 📚 Referências

- [Web Authentication API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [WebAuthn Specification](https://www.w3.org/TR/webauthn-2/)
- [FIDO Alliance](https://fidoalliance.org/)
- [Can I Use - WebAuthn](https://caniuse.com/webauthn)

## 🆘 Troubleshooting

### Problema: Modal não aparece após login
**Solução**: Verificar se `biometricAuth` está carregado e se o dispositivo suporta

### Problema: Botão de biometria não aparece
**Solução**: Verificar se biometria está ativa: `biometricAuth.isBiometricEnabled()`

### Problema: Erro "NotAllowedError"
**Solução**: Usuário cancelou ou biometria falhou - tentar novamente

### Problema: Não funciona em produção
**Solução**: Verificar se está usando HTTPS

---

**Desenvolvido para**: Sistema WR10 - Monitoramento Inteligente  
**Tecnologia**: Web Authentication API (WebAuthn)  
**Versão**: 1.0.0  
**Data**: Fevereiro 2026
