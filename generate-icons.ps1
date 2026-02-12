# ============================================
#  iNurseApp - Gerador de Ícones PWA
#  Versão: 1.0
# ============================================

Write-Host "🎨 iNurseApp - Gerador de Ícones PWA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar se ImageMagick está instalado
Write-Host "🔍 Verificando ImageMagick..." -ForegroundColor Yellow
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ImageMagick não encontrado!`n" -ForegroundColor Red
    Write-Host "Instale o ImageMagick primeiro:" -ForegroundColor Yellow
    Write-Host "  1. Via Chocolatey: choco install imagemagick" -ForegroundColor White
    Write-Host "  2. Via download: https://imagemagick.org/script/download.php`n" -ForegroundColor White
    Write-Host "Ou use o método online: https://www.pwabuilder.com/imageGenerator" -ForegroundColor Green
    exit 1
}
Write-Host "✅ ImageMagick encontrado!`n" -ForegroundColor Green

# Verificar se o arquivo fonte existe
$source = "assets\logo.svg"
if (-not (Test-Path $source)) {
    Write-Host "❌ Arquivo não encontrado: $source`n" -ForegroundColor Red
    exit 1
}

# Criar diretórios se não existirem
New-Item -Path "assets\icons" -ItemType Directory -Force | Out-Null

# Tamanhos para PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "🎨 Gerando ícones PWA..." -ForegroundColor Cyan
foreach ($size in $sizes) {
    $output = "assets\icons\icon-${size}x${size}.png"
    Write-Host "   Gerando: icon-${size}x${size}.png" -ForegroundColor Gray
    
    & magick $source -resize "${size}x${size}" -background none -flatten $output
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ icon-${size}x${size}.png" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Erro ao gerar icon-${size}x${size}.png" -ForegroundColor Red
    }
}

Write-Host "`n🎨 Gerando favicons..." -ForegroundColor Cyan

# Favicon 16x16
Write-Host "   Gerando: favicon-16x16.png" -ForegroundColor Gray
& magick $source -resize 16x16 -background none -flatten favicon-16x16.png
if ($LASTEXITCODE -eq 0) { Write-Host "   ✅ favicon-16x16.png" -ForegroundColor Green }

# Favicon 32x32
Write-Host "   Gerando: favicon-32x32.png" -ForegroundColor Gray
& magick $source -resize 32x32 -background none -flatten favicon-32x32.png
if ($LASTEXITCODE -eq 0) { Write-Host "   ✅ favicon-32x32.png" -ForegroundColor Green }

# Apple Touch Icon
Write-Host "   Gerando: apple-touch-icon.png" -ForegroundColor Gray
& magick $source -resize 180x180 -background none -flatten apple-touch-icon.png
if ($LASTEXITCODE -eq 0) { Write-Host "   ✅ apple-touch-icon.png" -ForegroundColor Green }

# Favicon.ico (multi-size)
Write-Host "   Gerando: favicon.ico" -ForegroundColor Gray
& magick $source -define icon:auto-resize=16,32,48 -background none -flatten favicon.ico
if ($LASTEXITCODE -eq 0) { Write-Host "   ✅ favicon.ico" -ForegroundColor Green }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Geração completa!" -ForegroundColor Green
Write-Host "`n📊 Resumo:" -ForegroundColor Cyan
Write-Host "   - 8 ícones PWA (72px até 512px)" -ForegroundColor White
Write-Host "   - 4 favicons (16px, 32px, 180px, .ico)" -ForegroundColor White
Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Verificar os ícones em: assets\icons\" -ForegroundColor White
Write-Host "   2. Abrir icon-preview.html no navegador" -ForegroundColor White
Write-Host "   3. Testar PWA em: DevTools > Application > Manifest" -ForegroundColor White
Write-Host "`n🚀 Pronto para deploy!" -ForegroundColor Green
