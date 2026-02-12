# ========================================
# Script de Deploy Automático para GitHub
# iNurseApp Frontend
# ========================================

Write-Host "🚀 Iniciando deploy automático para GitHub..." -ForegroundColor Cyan
Write-Host ""

# Configurações
$REPO_NAME = "inurseapp-frontend"
$GITHUB_USER = "edumelogeneses"
$BRANCH = "main"

# ========================================
# PASSO 1: Verificar Git
# ========================================

Write-Host "📋 Passo 1: Verificando Git..." -ForegroundColor Yellow

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    Write-Host "Instale em: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git encontrado: $(git --version)" -ForegroundColor Green
Write-Host ""

# ========================================
# PASSO 2: Inicializar Repositório
# ========================================

Write-Host "📋 Passo 2: Inicializando repositório..." -ForegroundColor Yellow

if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Repositório Git inicializado!" -ForegroundColor Green
} else {
    Write-Host "✅ Repositório Git já existe!" -ForegroundColor Green
}
Write-Host ""

# ========================================
# PASSO 3: Adicionar Arquivos
# ========================================

Write-Host "📋 Passo 3: Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "✅ Arquivos adicionados!" -ForegroundColor Green
Write-Host ""

# ========================================
# PASSO 4: Criar Commit
# ========================================

Write-Host "📋 Passo 4: Criando commit..." -ForegroundColor Yellow
git commit -m "chore: initial commit - complete frontend setup"
Write-Host "✅ Commit criado!" -ForegroundColor Green
Write-Host ""

# ========================================
# PASSO 5: Configurar Branch Main
# ========================================

Write-Host "📋 Passo 5: Configurando branch main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branch configurada!" -ForegroundColor Green
Write-Host ""

# ========================================
# PASSO 6: Criar Repositório no GitHub
# ========================================

Write-Host "📋 Passo 6: Criando repositório no GitHub..." -ForegroundColor Yellow

# Verificar se GitHub CLI está instalado
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "🔍 GitHub CLI encontrado! Criando repositório..." -ForegroundColor Cyan
    
    # Criar repositório público
    gh repo create $REPO_NAME --public --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repositório criado e código enviado!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Erro ao criar repositório. Verifique se já existe." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ GitHub CLI não encontrado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "👉 OPÇÃO 1: Instalar GitHub CLI (Recomendado)" -ForegroundColor Cyan
    Write-Host "   Download: https://cli.github.com/" -ForegroundColor White
    Write-Host "   Depois execute: gh auth login" -ForegroundColor White
    Write-Host ""
    Write-Host "👉 OPÇÃO 2: Criar manualmente" -ForegroundColor Cyan
    Write-Host "   1. Acesse: https://github.com/new" -ForegroundColor White
    Write-Host "   2. Repository name: $REPO_NAME" -ForegroundColor White
    Write-Host "   3. Public" -ForegroundColor White
    Write-Host "   4. NÃO inicialize com README" -ForegroundColor White
    Write-Host "   5. Create repository" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "Pressione ENTER após criar o repositório no GitHub..."
    
    # Adicionar remote e fazer push
    Write-Host ""
    Write-Host "📋 Configurando remote e fazendo push..." -ForegroundColor Yellow
    
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Código enviado para GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao enviar código." -ForegroundColor Red
        Write-Host "Verifique se o repositório foi criado corretamente." -ForegroundColor Yellow
    }
}

Write-Host ""

# ========================================
# PASSO 7: Conectar com Netlify
# ========================================

Write-Host "📋 Passo 7: Próximo passo - Conectar com Netlify" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Para ativar deploy automático:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://app.netlify.com/teams/edumelogeneses/sites" -ForegroundColor White
Write-Host "   2. Clique no site: inurseapp.com" -ForegroundColor White
Write-Host "   3. Site settings → Build & deploy → Link repository" -ForegroundColor White
Write-Host "   4. Autorize GitHub" -ForegroundColor White
Write-Host "   5. Selecione: edumelogeneses/$REPO_NAME" -ForegroundColor White
Write-Host "   6. Branch: main" -ForegroundColor White
Write-Host "   7. Build command: (deixe vazio)" -ForegroundColor White
Write-Host "   8. Publish directory: . (ponto)" -ForegroundColor White
Write-Host "   9. Deploy site" -ForegroundColor White
Write-Host ""
Write-Host "✨ Após conectar, cada 'git push' fará deploy automático!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Repositório: https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor White
Write-Host "🌐 Site Netlify: https://inurseapp.com" -ForegroundColor White
Write-Host ""
