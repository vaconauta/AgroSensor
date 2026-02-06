# Script para fazer commit e push automaticamente
# Uso: .\commit-push.ps1

Write-Host "=== Git Commit & Push ===" -ForegroundColor Cyan
Write-Host ""

# Verifica se há mudanças para commitar
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nenhuma mudanca detectada para commitar." -ForegroundColor Yellow
    exit 0
}

# Mostra o status atual
Write-Host "Arquivos modificados:" -ForegroundColor Green
git status --short
Write-Host ""

# Solicita a descrição do commit
$commitMessage = Read-Host "Digite a descricao do commit"

# Verifica se a mensagem não está vazia
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "Erro: A mensagem do commit nao pode estar vazia!" -ForegroundColor Red
    exit 1
}

# Adiciona todos os arquivos
Write-Host ""
Write-Host "Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Faz o commit
Write-Host "Criando commit..." -ForegroundColor Cyan
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao criar commit!" -ForegroundColor Red
    exit 1
}

# Faz o push
Write-Host "Enviando para o GitHub..." -ForegroundColor Cyan
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Sucesso! Commit enviado para o GitHub." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Erro ao enviar para o GitHub!" -ForegroundColor Red
    exit 1
}
