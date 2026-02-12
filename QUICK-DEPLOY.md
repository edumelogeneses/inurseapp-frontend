# ⚡ Quick Deploy - TL;DR

## 🚀 Deploy em 30 Segundos

### Opção 1: Script Automático
```powershell
.\deploy-to-github.ps1
```

### Opção 2: Comandos Manuais
```bash
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/edumelogeneses/inurseapp-frontend.git
git push -u origin main
```

## 🌐 Conectar Netlify

1. https://app.netlify.com/teams/edumelogeneses/sites
2. Click site **inurseapp.com**
3. **Site settings** → **Build & deploy** → **Link repository**
4. Autorize GitHub
5. Selecione: **edumelogeneses/inurseapp-frontend**
6. Branch: `main`
7. Build command: (vazio)
8. Publish directory: `.`
9. **Deploy site**

## 🎯 Três Pontinhos (...)

**Netlify → Deploys → Hover sobre deploy → (...)**

- 🔄 **Redeploy** - Refazer deploy
- 🗑️ **Delete** - Remover deploy
- 🔁 **Restart** - Reiniciar deploy
- 📋 **View log** - Ver logs

## ✅ Pronto!

Cada `git push` = deploy automático! 🎉
