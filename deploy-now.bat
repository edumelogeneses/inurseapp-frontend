@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ====================================
echo   iNurseApp - Deploy para GitHub
echo ====================================
echo.

echo [1/5] Verificando Git...
git --version
if errorlevel 1 (
    echo [X] Git nao instalado!
    pause
    exit /b 1
)
echo [OK] Git encontrado!
echo.

echo [2/5] Criando commit...
git commit -m "chore: initial commit - complete frontend setup"
if errorlevel 1 (
    echo [!] Nenhuma alteracao ou commit ja existe
)
echo.

echo [3/5] Configurando branch main...
git branch -M main
echo [OK] Branch configurada!
echo.

echo [4/5] Adicionando remote...
git remote add origin https://github.com/edumelogeneses/inurseapp-frontend.git 2>nul
if errorlevel 1 (
    echo [!] Remote ja existe, continuando...
) else (
    echo [OK] Remote adicionado!
)
echo.

echo [5/5] Enviando para GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo [X] Erro ao enviar!
    echo.
    echo Possíveis causas:
    echo - Repositório não existe no GitHub
    echo - Problemas de autenticação
    echo.
    echo Por favor:
    echo 1. Acesse: https://github.com/new
    echo 2. Crie repo: inurseapp-frontend (publico, sem README)
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo  DEPLOY CONCLUÍDO COM SUCESSO!
echo ====================================
echo.
echo Repositorio: https://github.com/edumelogeneses/inurseapp-frontend
echo.
echo Proximo passo: Conectar com Netlify
echo 1. https://app.netlify.com/teams/edumelogeneses/sites
echo 2. Site settings -^> Build ^& deploy -^> Link repository
echo 3. Selecione: edumelogeneses/inurseapp-frontend
echo 4. Deploy site
echo.
pause
