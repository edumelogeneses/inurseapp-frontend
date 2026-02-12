# 🚀 Deploy Automático - iNurseApp Frontend

## 📋 Pré-requisitos

Antes de executar o script, certifique-se de ter:

1. **Git instalado**
   - Download: https://git-scm.com/download/win
   - Durante instalação: marque "Git from the command line and also from 3rd-party software"

2. **GitHub CLI (Opcional - Recomendado)**
   - Download: https://cli.github.com/
   - Facilita a criação automática do repositório
   - Execute `gh auth login` após instalar

3. **Conta GitHub**
   - Username: edumelogeneses
   - Certifique-se de estar logado

## 🎯 Como Usar

### Opção 1: PowerShell (Recomendado)

1. **Abra PowerShell no diretório do projeto**
   ```
   Shift + Right Click → "Abrir janela do PowerShell aqui"
   ```

2. **Execute o script**
   ```powershell
   .\deploy-to-github.ps1
   ```

3. **Siga as instruções na tela**
   - O script fará tudo automaticamente
   - Se tiver GitHub CLI, criará o repositório
   - Caso contrário, dará instruções passo a passo

### Opção 2: Batch File (Simples)

1. **Duplo clique em:**
   ```
   deploy-to-github.bat
   ```

2. **Siga as instruções**
   - Leia cada passo
   - Pressione ENTER para continuar

## 📦 O que o Script Faz

1. ✅ Verifica se Git está instalado
2. ✅ Inicializa repositório Git (se necessário)
3. ✅ Adiciona todos os arquivos
4. ✅ Cria commit inicial
5. ✅ Configura branch main
6. ✅ Cria repositório no GitHub (se tiver GitHub CLI)
7. ✅ Faz push do código
8. ✅ Fornece instruções para conectar Netlify

## 🔧 Passo a Passo Manual

Se preferir fazer manualmente:

### 1. Inicializar Git
```bash
git init
git add .
git commit -m "chore: initial commit - complete frontend setup"
git branch -M main
```

### 2. Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Repository name: `inurseapp-frontend`
3. Public
4. **NÃO** inicialize com README
5. Create repository

### 3. Conectar e Enviar
```bash
git remote add origin https://github.com/edumelogeneses/inurseapp-frontend.git
git push -u origin main
```

## 🌐 Conectar com Netlify

### Passo 1: Acessar Netlify
1. Vá para: https://app.netlify.com/teams/edumelogeneses/sites
2. Clique no seu site: **inurseapp.com**

### Passo 2: Link Repository
1. **Site settings** → **Build & deploy**
2. **Link repository** (ou "Continuous Deployment")
3. **GitHub** → Autorize a conexão

### Passo 3: Configurar Deploy
1. Selecione: **edumelogeneses/inurseapp-frontend**
2. Branch: `main`
3. Build command: (deixe vazio - é HTML estático)
4. Publish directory: `.` (ponto - raiz do projeto)
5. **Deploy site**

### Passo 4: Configurar Domínio
1. **Domain settings**
2. Verifique se `inurseapp.com` está configurado
3. Se necessário, configure custom domain

## ✨ Deploy Automático

Após conectar o GitHub com Netlify:

### Cada `git push` fará deploy automático! 🎉

```bash
# Fazer alterações nos arquivos
# Depois:
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push
```

O Netlify irá:
1. 🔍 Detectar o push automaticamente
2. 📦 Fazer build (se necessário)
3. 🚀 Fazer deploy
4. ✅ Atualizar o site em produção

## 📊 Monitorar Deploys

### No Netlify Dashboard:
1. Acesse: https://app.netlify.com/sites/inurseapp
2. Aba **Deploys**
3. Veja histórico de todos os deploys

### Cada deploy mostra:
- ✅ Status (Success/Failed)
- 📅 Data e hora
- 🔗 Preview URL
- 📋 Logs detalhados

### Opções de Deploy (três pontinhos ...):
- 🔄 **Redeploy** - Refazer deploy
- 🗑️ **Delete** - Remover deploy
- 🔁 **Restart** - Reiniciar deploy  
- 📋 **View log** - Ver logs detalhados

## 🔄 Workflow Completo

```
1. Editar código localmente
   ↓
2. git add .
   ↓
3. git commit -m "mensagem"
   ↓
4. git push
   ↓
5. Netlify detecta automaticamente
   ↓
6. Deploy inicia
   ↓
7. Site atualizado em https://inurseapp.com
```

## ❗ Troubleshooting

### Erro: "Git não encontrado"
```powershell
# Instale Git:
https://git-scm.com/download/win
```

### Erro: "Permission denied (publickey)"
```bash
# Configure suas credenciais:
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Use HTTPS em vez de SSH:
git remote set-url origin https://github.com/edumelogeneses/inurseapp-frontend.git
```

### Erro: "Repository already exists"
```bash
# Repositório já existe no GitHub
# Apenas adicione o remote:
git remote add origin https://github.com/edumelogeneses/inurseapp-frontend.git
git push -u origin main
```

### Deploy falhou no Netlify
1. Verifique os **logs** do deploy
2. Confirme que o arquivo `index.html` está na raiz
3. Verifique se a branch está correta (main)

## 📚 Recursos Adicionais

- **Git**: https://git-scm.com/doc
- **GitHub**: https://docs.github.com
- **GitHub CLI**: https://cli.github.com/manual
- **Netlify**: https://docs.netlify.com

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub
- [ ] Netlify conectado ao repositório
- [ ] Deploy automático funcionando
- [ ] Site acessível em https://inurseapp.com

---

**🎉 Pronto! Agora cada mudança no código será automaticamente publicada!**
