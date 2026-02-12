# 🚀 Guia de Deploy - iNurseApp Frontend

Deploy completo para 3 plataformas: **Netlify**, **Vercel** e **Railway**.

---

## 🎯 **QUAL ESCOLHER?**

| Plataforma | Melhor Para | Preço | Velocidade |
|------------|-------------|-------|------------|
| **Netlify** | Sites estáticos, PWA | Grátis | ⚡⚡⚡ |
| **Vercel** | Next.js, React | Grátis | ⚡⚡⚡ |
| **Railway** | Full-stack | Grátis* | ⚡⚡ |

**Recomendação:** **Netlify** (mais simples e otimizado para PWA)

---

## 📦 **PREPARAÇÃO (ANTES DO DEPLOY)**

### **✅ Checklist Pré-Deploy**

- [ ] Todos os arquivos criados
- [ ] Google Analytics configurado (opcional)
- [ ] Ícones PWA gerados (ou placeholders)
- [ ] API URL correta em `js/api.js`
- [ ] Testado localmente (`npx http-server`)
- [ ] Git commit de todas as mudanças

### **🔧 Verificar API URL**

Edite `js/api.js` e confirme:

```javascript
const API_BASE_URL = 'https://lively-embrace-production-a4a2.up.railway.app';
```

Se sua API está em outro lugar, **atualize este URL!**

---

## 🟦 **OPÇÃO 1: NETLIFY (RECOMENDADO)**

### **Por que Netlify?**
- ✅ Deploy em 1 minuto
- ✅ HTTPS automático
- ✅ CDN global
- ✅ PWA otimizado
- ✅ Formulários e functions serverless (se precisar)
- ✅ 100GB bandwidth/mês grátis

---

### **Método A: Deploy via Git (Recomendado)**

#### **1. Criar repositório Git (se ainda não tem)**

```powershell
cd C:\Projects\inurseapp\frontend

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: frontend completo v2.0"

# Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: inurseapp-frontend

# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/inurseapp-frontend.git

# Push
git push -u origin main
```

#### **2. Conectar ao Netlify**

1. Acesse: https://app.netlify.com/
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Autorize o Netlify
5. Selecione o repositório `inurseapp-frontend`
6. Configure:
   - **Branch:** `main`
   - **Build command:** (deixe vazio)
   - **Publish directory:** `.` (ponto)
7. Clique em **"Deploy site"**

#### **3. Aguardar Deploy**
- ⏱️ Tempo: ~1 minuto
- URL gerada: `https://random-name-123456.netlify.app`

#### **4. Configurar Domínio Customizado (Opcional)**

1. No dashboard do site
2. **Site settings** > **Domain management**
3. **Add custom domain**
4. Digite: `inurseapp.com`
5. Siga instruções de DNS

---

### **Método B: Deploy via CLI**

```powershell
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy (da pasta frontend)
cd C:\Projects\inurseapp\frontend
netlify deploy --prod

# Selecionar opções:
# - Create & configure new site
# - Team: (escolha seu time)
# - Site name: inurseapp
# - Publish directory: . (ponto)

# URL: https://inurseapp.netlify.app
```

---

### **Método C: Deploy via Drag & Drop**

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `frontend` inteira
3. Aguarde upload
4. Pronto! URL gerado automaticamente

---

## 🔷 **OPÇÃO 2: VERCEL**

### **Por que Vercel?**
- ✅ Deploy instantâneo
- ✅ Next.js integrado
- ✅ Edge Functions
- ✅ Analytics incluído
- ✅ 100GB bandwidth/mês grátis

---

### **Deploy via Git**

#### **1. Push para GitHub** (mesmo processo do Netlify acima)

#### **2. Conectar ao Vercel**

1. Acesse: https://vercel.com/
2. Clique em **"Add New"** > **"Project"**
3. **Import Git Repository**
4. Selecione `inurseapp-frontend`
5. Configure:
   - **Framework Preset:** Other
   - **Build Command:** (deixe vazio)
   - **Output Directory:** `.`
6. Clique em **"Deploy"**

#### **3. Aguardar Deploy**
- ⏱️ Tempo: ~30 segundos
- URL: `https://inurseapp-frontend.vercel.app`

---

### **Deploy via CLI**

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd C:\Projects\inurseapp\frontend
vercel --prod

# URL: https://inurseapp-frontend.vercel.app
```

---

## 🟪 **OPÇÃO 3: RAILWAY**

### **Por que Railway?**
- ✅ Backend + Frontend juntos
- ✅ PostgreSQL incluído
- ✅ Variáveis de ambiente
- ⚠️ Requer build setup

---

### **Deploy via Git**

#### **1. Criar `railway.toml`**

```toml
[build]
builder = "nixpacks"
buildCommand = "echo 'Static site ready'"

[deploy]
startCommand = "npx http-server -p ${PORT:-3000}"

[[services]]
name = "frontend"
```

#### **2. Push para GitHub**

```powershell
cd C:\Projects\inurseapp\frontend
git add .
git commit -m "feat: railway config"
git push
```

#### **3. Deploy no Railway**

1. Acesse: https://railway.app/
2. **New Project** > **Deploy from GitHub repo**
3. Selecione repositório
4. Aguarde deploy
5. **Settings** > **Generate Domain**

#### **4. URL Gerada**
- `https://inurseapp-frontend.up.railway.app`

---

## ⚙️ **CONFIGURAÇÕES PÓS-DEPLOY**

### **1. CORS (Backend)**

Certifique-se que o backend aceita requisições do frontend:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://inurseapp.netlify.app",
        "https://inurseapp-frontend.vercel.app",
        "https://seu-dominio.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **2. Variáveis de Ambiente**

Se precisar de env vars no frontend:

**Netlify:**
1. Site settings > Environment variables
2. Adicionar: `VITE_API_URL=https://api.inurseapp.com`

**Vercel:**
1. Project Settings > Environment Variables
2. Adicionar variáveis

**Railway:**
1. Variables > Add Variable

### **3. Domínio Customizado**

#### **Netlify:**
1. Domain settings > Add custom domain
2. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: inurseapp.netlify.app
   ```

#### **Vercel:**
1. Project Settings > Domains
2. Add domain
3. Configure DNS (instruções automáticas)

### **4. SSL/TLS**

✅ **Automático em todas as plataformas!**
- Netlify: Let's Encrypt automático
- Vercel: SSL automático
- Railway: SSL automático

---

## 🧪 **TESTAR DEPLOY**

### **1. Testar Funcionalidades**

- [ ] Site carrega corretamente
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] PWA pode ser instalado
- [ ] Offline mode funciona
- [ ] HTTPS ativo
- [ ] API conecta corretamente

### **2. Lighthouse Audit**

```powershell
# Instalar Lighthouse
npm install -g lighthouse

# Rodar audit
lighthouse https://seu-site.netlify.app --view

# Esperado:
# - Performance: 90+
# - Accessibility: 100
# - Best Practices: 100
# - SEO: 95+
# - PWA: Installable
```

### **3. Testar PWA em Mobile**

1. Abra site no celular (Chrome/Safari)
2. Chrome: Menu > "Instalar aplicativo"
3. Safari: Compartilhar > "Adicionar à Tela Inicial"
4. Teste modo offline (modo avião)

---

## 🔧 **TROUBLESHOOTING**

### **"404 ao navegar entre páginas"**

Adicione `_redirects` na raiz:

```
/*  /index.html  200
```

### **"CORS error ao chamar API"**

- Verifique URL da API em `js/api.js`
- Confirme CORS no backend permite seu domínio

### **"PWA não instala"**

- Verifique manifest.json
- Confirme Service Worker registrado
- Use HTTPS (obrigatório)

### **"Ícones não aparecem"**

- Gere ícones PNG (não apenas SVG)
- Verifique caminhos em manifest.json

---

## 📊 **MONITORAMENTO**

### **Analytics**
- Google Analytics configurado ✅
- Vercel Analytics (se Vercel)
- Netlify Analytics (pago)

### **Error Tracking**
```powershell
# Instalar Sentry (recomendado)
npm install @sentry/browser

# Configurar em js/app.js
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});
```

### **Performance**
- Lighthouse CI
- Web Vitals
- Core Web Vitals (Google Search Console)

---

## 🎯 **CHECKLIST FINAL**

- [ ] Deploy realizado com sucesso
- [ ] HTTPS ativo
- [ ] Domínio customizado configurado (opcional)
- [ ] CORS configurado no backend
- [ ] PWA instalável
- [ ] Service Worker funcionando
- [ ] Google Analytics configurado
- [ ] Lighthouse score > 90
- [ ] Testado em mobile
- [ ] Offline mode funciona
- [ ] API conecta corretamente
- [ ] Documentação atualizada

---

## 🚀 **DEPLOY CONTÍNUO (CI/CD)**

### **GitHub Actions (Exemplo)**

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📚 **RECURSOS**

- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

**Pronto para deploy! 🚀**

Escolha sua plataforma favorita e siga o guia acima!
