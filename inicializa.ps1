# ============================================
# SCRIPT DE INICIALIZACAO DO PROJETO GIT
# ============================================

$ErrorActionPreference = "Continue"

function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Err { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Warn { param($msg) Write-Host $msg -ForegroundColor Yellow }

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  INICIALIZACAO DO PROJETO GIT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Pegar usuário do Windows
$windowsUser = $env:USERNAME
$computerName = $env:COMPUTERNAME
$domain = $env:USERDOMAIN

# Tentar pegar email do Git já configurado ou usar padrão
$existingGitUser = git config --global user.name
$existingGitEmail = git config --global user.email

if ($existingGitUser) {
    $gitUserName = $existingGitUser
    Write-Info "Usuario Git ja configurado: $gitUserName"
} else {
    $gitUserName = $windowsUser
    Write-Info "Usando usuario do Windows: $gitUserName"
}

if ($existingGitEmail) {
    $gitEmail = $existingGitEmail
    Write-Info "Email Git ja configurado: $gitEmail"
} else {
    # Tentar construir email baseado no usuário
    $gitEmail = "${windowsUser}@${domain}.local"
    Write-Info "Email gerado: $gitEmail"
    $customEmail = Read-Host "Pressione ENTER para usar este email ou digite outro"
    if ($customEmail) {
        $gitEmail = $customEmail
    }
}

Write-Host ""

# Solicitar informações do repositório
$repoUrl = Read-Host "URL do repositorio (ex: https://github.com/usuario/repo.git)"
$projectDir = Read-Host "Diretorio do projeto (ex: C:\ERPWEB\Oficina-Web-main)"

Write-Host ""
Write-Info "Configurando Git..."

# Configurar usuário Git globalmente
git config --global user.name "$gitUserName"
git config --global user.email "$gitEmail"

# Configurar Git Credential Manager
git config --global credential.helper manager-core

Write-Success "Usuario Git configurado: $gitUserName <$gitEmail>"
Write-Host ""

# Verificar se o diretório já existe
if (Test-Path $projectDir) {
    Write-Warn "Diretorio ja existe: $projectDir"
    $response = Read-Host "Deseja continuar? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Info "Operacao cancelada"
        exit 0
    }
    
    # Verificar se já é um repositório Git
    if (Test-Path (Join-Path $projectDir ".git")) {
        Write-Info "Ja e um repositorio Git. Atualizando..."
        Set-Location $projectDir
        git remote set-url origin $repoUrl
        git fetch origin
        git pull origin main
    } else {
        Write-Info "Inicializando repositorio Git..."
        Set-Location $projectDir
        git init
        git remote add origin $repoUrl
        git fetch origin
        git pull origin main
    }
} else {
    Write-Info "Clonando repositorio..."
    $parentDir = Split-Path -Parent $projectDir
    
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }
    
    Set-Location $parentDir
    git clone $repoUrl $projectDir
    
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Erro ao clonar repositorio"        
        pause
        exit 1
    }
    
    Set-Location $projectDir
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Success "Projeto inicializado com sucesso!"
    Write-Host ""
    Write-Info "Informacoes do repositorio:"
    Write-Host "  Usuario Windows: $windowsUser@$domain"
    Write-Host "  Usuario Git: $gitUserName <$gitEmail>"
    Write-Host "  Diretorio: $projectDir"
    Write-Host "  Branch atual: $(git branch --show-current)"
    Write-Host "  Remote: $(git remote get-url origin)"
    Write-Host ""
    Write-Info "Ultimos commits:"
    git log --oneline -5
} else {
    Write-Err "Erro na inicializacao do projeto"
    pause
    exit 1
}

Write-Host ""
Write-Success "Pronto! Agora voce pode usar o script de atualizacao."
Write-Host ""