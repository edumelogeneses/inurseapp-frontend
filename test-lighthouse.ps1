# ============================================
#  Testar Performance com Lighthouse
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "`n🔍 Testando performance com Lighthouse..." -ForegroundColor Cyan
Write-Host "URL: $Url`n" -ForegroundColor White

# Verificar se Lighthouse está instalado
if (-not (Get-Command lighthouse -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando Lighthouse..." -ForegroundColor Yellow
    npm install -g lighthouse
}

# Rodar Lighthouse
Write-Host "Executando audit (pode levar 1-2 minutos)...`n" -ForegroundColor Yellow
lighthouse $Url --view --quiet

Write-Host "`n✅ Audit completo! O relatório foi aberto no navegador." -ForegroundColor Green
Write-Host "`nScores esperados:" -ForegroundColor Cyan
Write-Host "  - Performance: 90+" -ForegroundColor White
Write-Host "  - Accessibility: 100" -ForegroundColor White
Write-Host "  - Best Practices: 100" -ForegroundColor White
Write-Host "  - SEO: 95+" -ForegroundColor White
Write-Host "  - PWA: Installable" -ForegroundColor White
