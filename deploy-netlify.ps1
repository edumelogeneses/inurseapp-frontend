# ============================================
#  Deploy Automático para Netlify
#  iNurseApp Frontend v2.0
# ============================================

Write-Host "`n🚀 iNurseApp - Deploy para Netlify" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar se Netlify CLI está instalado
Write-Host "🔍 Verificando Netlify CLI..." -ForegroundColor Yellow
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Netlify CLI não encontrado!`n" -ForegroundColor Red
    Write-Host "Instale primeiro:" -ForegroundColor Yellow
    Write-Host "  npm install -g netlify-cli`n" -ForegroundColor White
    Write-Host "Ou faça deploy manual:" -ForegroundColor Yellow
    Write-Host "  1. Acesse: https://app.netlify.com/drop" -ForegroundColor White
    Write-Host "  2. Arraste a pasta 'frontend' inteira" -ForegroundColor White
    Write-Host "  3. Aguarde upload`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Netlify CLI encontrado!`n" -ForegroundColor Green

# Verificar se está logado
Write-Host "🔐 Verificando autenticação..." -ForegroundColor Yellow
$authStatus = netlify status 2>&1
if ($authStatus -match "Not logged in") {
    Write-Host "❌ Não autenticado!`n" -ForegroundColor Red
    Write-Host "Fazendo login..." -ForegroundColor Yellow
    netlify login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Falha no login!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Autenticado!`n" -ForegroundColor Green

# Confirmar deploy
Write-Host "📦 Pronto para fazer deploy!" -ForegroundColor Cyan
Write-Host "`nArquivos que serão publicados:" -ForegroundColor White
Write-Host "  - index.html (Landing page)" -ForegroundColor Gray
Write-Host "  - register.html" -ForegroundColor Gray
Write-Host "  - login.html" -ForegroundColor Gray
Write-Host "  - dashboard.html" -ForegroundColor Gray
Write-Host "  - js/, css/, assets/" -ForegroundColor Gray
Write-Host "  - manifest.json, sw.js (PWA)" -ForegroundColor Gray
Write-Host "`n"

$confirm = Read-Host "Continuar com deploy para PRODUÇÃO? (s/n)"
if ($confirm -ne 's' -and $confirm -ne 'S' -and $confirm -ne 'sim') {
    Write-Host "`n❌ Deploy cancelado pelo usuário." -ForegroundColor Yellow
    exit 0
}

# Deploy
Write-Host "`n🚀 Fazendo deploy..." -ForegroundColor Cyan
netlify deploy --prod --dir=.

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "✅ Deploy realizado com sucesso!" -ForegroundColor Green
    Write-Host "`n📊 Próximos passos:" -ForegroundColor Yellow
    Write-Host "  1. Testar o site na URL fornecida acima" -ForegroundColor White
    Write-Host "  2. Configurar domínio customizado (opcional)" -ForegroundColor White
    Write-Host "  3. Testar PWA em dispositivo mobile" -ForegroundColor White
    Write-Host "  4. Configurar Google Analytics" -ForegroundColor White
    Write-Host "  5. Rodar Lighthouse audit" -ForegroundColor White
    Write-Host "`n🎉 Seu site está no ar!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro no deploy!" -ForegroundColor Red
    Write-Host "Tente deploy manual: https://app.netlify.com/drop" -ForegroundColor Yellow
}
