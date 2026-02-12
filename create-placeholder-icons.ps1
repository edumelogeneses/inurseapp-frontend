# ============================================
#  Criar Ícones Placeholder (Temporários)
#  Use até gerar os ícones finais
# ============================================

Write-Host "`n🎨 Criando ícones placeholder temporários..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Criar diretório
New-Item -Path "assets\icons" -ItemType Directory -Force | Out-Null

# Criar SVG base para placeholder
$svgTemplate = @'
<svg width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="{SIZE}" height="{SIZE}" fill="#2563EB"/>
  <text x="50%" y="50%" font-family="Arial" font-size="{FONTSIZE}" fill="white" text-anchor="middle" dy=".3em">iN</text>
  <text x="50%" y="70%" font-family="Arial" font-size="{FONTSIZE2}" fill="rgba(255,255,255,0.8)" text-anchor="middle" dy=".3em">{SIZE}px</text>
</svg>
'@

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
    $fontSize = [math]::Round($size * 0.35)
    $fontSize2 = [math]::Round($size * 0.15)
    
    $svg = $svgTemplate -replace '{SIZE}', $size
    $svg = $svg -replace '{FONTSIZE}', $fontSize
    $svg = $svg -replace '{FONTSIZE2}', $fontSize2
    
    $outputFile = "assets\icons\icon-${size}x${size}.svg"
    $svg | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "✅ Criado: icon-${size}x${size}.svg (placeholder)" -ForegroundColor Green
}

# Criar favicons SVG
$faviconSvg = @'
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#2563EB" rx="4"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">iN</text>
</svg>
'@

$faviconSvg | Out-File -FilePath "favicon.svg" -Encoding UTF8
Write-Host "✅ Criado: favicon.svg (placeholder)" -ForegroundColor Green

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ Placeholders criados!" -ForegroundColor Green
Write-Host "`nATENCAO:" -ForegroundColor Yellow
Write-Host "   Estes sao icones TEMPORARIOS (SVG simples)" -ForegroundColor White
Write-Host "   Para icones finais (PNG), use:" -ForegroundColor White
Write-Host "   https://www.pwabuilder.com/imageGenerator" -ForegroundColor Cyan
Write-Host "`nVoce ja pode testar o PWA com estes placeholders!" -ForegroundColor Green
Write-Host "`nProximos passos:" -ForegroundColor Yellow
Write-Host "   1. npx http-server -p 8000" -ForegroundColor White
Write-Host "   2. Abrir: http://localhost:8000" -ForegroundColor White
Write-Host "   3. DevTools > Application > Manifest" -ForegroundColor White
Write-Host "   4. Testar instalacao PWA" -ForegroundColor White
Write-Host "`nGuia completo: GENERATE-ICONS-NOW.md`n" -ForegroundColor Cyan
