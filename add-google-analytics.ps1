# ============================================
#  Adicionar Google Analytics aos HTML
#  Usage: .\add-google-analytics.ps1 -MeasurementId "G-XXXXXXXXXX"
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$MeasurementId
)

Write-Host "`n📊 Adicionando Google Analytics..." -ForegroundColor Cyan
Write-Host "ID de Medição: $MeasurementId`n" -ForegroundColor White

# Validar ID
if ($MeasurementId -notmatch '^G-[A-Z0-9]+$') {
    Write-Host "❌ ID inválido! Deve ser formato: G-XXXXXXXXXX" -ForegroundColor Red
    exit 1
}

# Template do script Google Analytics
$gaScript = @"

<!-- Google Analytics -->
<script async src=`"https://www.googletagmanager.com/gtag/js?id=$MeasurementId`"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '$MeasurementId');
</script>
"@

# Arquivos para atualizar
$files = @(
    "index.html",
    "register.html",
    "login.html",
    "dashboard.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Adicionar antes de </head>
        if ($content -notmatch 'googletagmanager.com') {
            $content = $content -replace '</head>', "$gaScript`n</head>"
            Set-Content $file $content -NoNewline
            Write-Host "✅ $file atualizado" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $file já tem Google Analytics" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $file não encontrado" -ForegroundColor Red
    }
}

# Atualizar analytics.js com o ID
Write-Host "`nAtualizando js/analytics.js..." -ForegroundColor Cyan
$analyticsContent = Get-Content "js\analytics.js" -Raw
$analyticsContent = $analyticsContent -replace "measurementId: 'G-XXXXXXXXXX'", "measurementId: '$MeasurementId'"
Set-Content "js\analytics.js" $analyticsContent -NoNewline
Write-Host "✅ js/analytics.js atualizado`n" -ForegroundColor Green

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Google Analytics configurado!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "  1. Fazer novo deploy no Netlify" -ForegroundColor White
Write-Host "  2. Testar no Console (F12)" -ForegroundColor White
Write-Host "  3. Verificar Tempo Real no Google Analytics" -ForegroundColor White
Write-Host "`n🎉 Pronto para rastrear usuários!`n" -ForegroundColor Green
