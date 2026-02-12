@echo off
REM ========================================
REM Script de Deploy para GitHub
REM iNurseApp Frontend
REM ========================================

echo.
echo ====================================
echo   iNurseApp - Deploy para GitHub
echo ====================================
echo.

REM Verificar Git
echo [1/7] Verificando Git...
git --version > nul 2>&1
if errorlevel 1 (
    echo [X] Git nao instalado!
    echo Instale em: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git encontrado!
echo.

REM Inicializar Git (se necessário)
echo [2/7] Inicializando repositorio...
if not exist ".git" (
    git init
    echo [OK] Repositorio inicializado!
) else (
    echo [OK] Repositorio ja existe!
)
echo.

REM Adicionar arquivos
echo [3/7] Adicionando arquivos...
git add .
echo [OK] Arquivos adicionados!
echo.

REM Commit
echo [4/7] Criando commit...
git commit -m "chore: initial commit - complete frontend setup"
echo [OK] Commit criado!
echo.

REM Configurar branch
echo [5/7] Configurando branch main...
git branch -M main
echo [OK] Branch configurada!
echo.

REM Adicionar remote
echo [6/7] Adicionando remote do GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/edumelogeneses/inurseapp-frontend.git
echo [OK] Remote adicionado!
echo.

REM Push
echo [7/7] Enviando para GitHub...
echo.
echo IMPORTANTE: Certifique-se que o repositorio foi criado em:
echo https://github.com/edumelogeneses/inurseapp-frontend
echo.
pause

git push -u origin main

echo.
echo ====================================
echo   DEPLOY CONCLUIDO COM SUCESSO!
echo ====================================
echo.
echo Proximo passo:
echo 1. Acesse: https://app.netlify.com
echo 2. Link repository: edumelogeneses/inurseapp-frontend
echo 3. Deploy automatico estara ativo!
echo.
echo Deseja abrir Netlify agora? (S/N)
set /p openNetlify=
if /i "%openNetlify%"=="S" (
    start https://app.netlify.com/teams/edumelogeneses/sites
)

echo.
echo Deseja abrir GitHub agora? (S/N)
set /p openGitHub=
if /i "%openGitHub%"=="S" (
    start https://github.com/edumelogeneses/inurseapp-frontend
)

echo.
echo Tudo pronto! Boa sorte! :)
pause
