# ============================================
# SCRIPT DE ATUALIZACAO DO SERVIDOR
# ============================================

$ErrorActionPreference = "Continue"

# Configurações
$projectPath = "C:\Dashboard_Estacao"

function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Err { param($msg) Write-Host $msg -ForegroundColor Red }

Write-Host ""
Write-Info "Atualizando repositorio..."
Write-Host ""

Set-Location $projectPath

# Verificar se o diretório existe
if (-not (Test-Path $projectPath)) {
    Write-Err "Diretorio do projeto nao encontrado: $projectPath"
    exit 1
}

# Verificar usuário Git configurado
$gitUser = git config user.name
$gitEmail = git config user.email

if ($gitUser -and $gitEmail) {
    Write-Info "Usando conta Git: $gitUser <$gitEmail>"
} else {
    Write-Err "Nenhuma conta Git configurada. Execute:"
    Write-Host "  git config --global user.name 'Seu Nome'"
    Write-Host "  git config --global user.email 'seu@email.com'"
    exit 1
}

Write-Host ""

# Buscar alterações
Write-Info "Buscando alteracoes..."
git fetch origin

if ($LASTEXITCODE -ne 0) {
    Write-Err "Erro ao buscar alteracoes do repositorio"
    exit 1
}

# Fazer pull (usa credenciais configuradas no sistema)
Write-Info "Baixando alteracoes..."
git pull origin main

if ($LASTEXITCODE -eq 0) {
    Write-Success "Atualizacao concluida com sucesso!"
    Write-Host ""
    Write-Info "Ultimos commits:"
    git log --oneline -5
    Write-Host ""
    Write-Info "Status do repositorio:"
    git status -s
} else {
    Write-Err "Erro na atualizacao"
    Write-Host ""
    Write-Info "Verifique se suas credenciais estao configuradas:"
    Write-Host "  - Git Credential Manager"
    Write-Host "  - SSH Keys"
    Write-Host "  - Token de acesso pessoal"
    exit 1
}