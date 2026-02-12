# 🩺 iNurseApp Frontend v2.0

Frontend moderno, seguro e otimizado do iNurseApp - Transforme áudios de consultas em prontuários SOAP com IA.

**Status:** ✅ Pronto para Produção  
**Última atualização:** 06/02/2026

---

## ✨ Características

### 🔒 **Segurança**
- ✅ Proteção contra XSS (Cross-Site Scripting)
- ✅ Sanitização de inputs
- ✅ Rate limiting client-side
- ✅ Validação robusta de formulários
- ✅ HTTPS obrigatório

### ⚡ **Performance**
- ✅ Service Worker com cache strategies
- ✅ Lazy loading de imagens
- ✅ Code splitting preparado
- ✅ GPU acceleration em animações
- ✅ Preconnect e DNS prefetch

### ♿ **Acessibilidade**
- ✅ WCAG 2.1 AA compliant
- ✅ ARIA labels e roles
- ✅ Navegação por teclado
- ✅ Screen reader friendly
- ✅ Prefers-reduced-motion

### 📱 **PWA (Progressive Web App)**
- ✅ Installable
- ✅ Offline support
- ✅ Push notifications preparado
- ✅ Background sync preparado
- ✅ Manifest completo

### 🎨 **UX/UI**
- ✅ Design moderno e profissional
- ✅ Animações suaves
- ✅ Feedback visual claro
- ✅ Responsivo (mobile-first)
- ✅ Dark mode ready

---

## 🚀 **DEPLOY RÁPIDO**

### **Método Mais Fácil (2 minutos):**
1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `frontend` inteira
3. Pronto! URL gerado automaticamente

**Guia completo:** `DEPLOY-NOW.md` | `DEPLOYMENT-GUIDE.md`

---

## 📁 Estrutura de Arquivos

```
frontend/
├── index.html              # Landing page
├── login.html              # Página de login
├── register.html           # Página de registro
├── dashboard.html          # Dashboard do usuário
├── offline.html            # Página offline (PWA)
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── css/
│   ├── style.css          # Estilos globais
│   ├── landing.css        # Estilos da landing page
│   └── variables.css      # Design system (opcional)
└── js/
    ├── api.js             # API helper (seguro)
    ├── auth.js            # Autenticação (seguro)
    └── app.js             # Lógica geral
```

---

## 🚀 Como Usar

### **1. Desenvolvimento Local**

```bash
# Usar qualquer servidor HTTP simples
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Opção 3: Live Server (VS Code)
# Instale a extensão "Live Server" e clique com botão direito > "Open with Live Server"
```

### **2. Deploy em Produção**

#### **Opção A: Netlify**
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod
```

#### **Opção B: Vercel**
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

#### **Opção C: Railway**
```bash
# 1. Criar arquivo railway.toml
[build]
builder = "nixpacks"
buildCommand = "echo 'Static site, no build needed'"

[deploy]
startCommand = "npx http-server -p ${PORT:-3000}"

# 2. Deploy via GitHub
# Conecte o repositório no dashboard do Railway
```

---

## 🔧 Configuração

### **1. Atualizar API URL**

Edite `js/api.js`:

```javascript
const API_BASE_URL = 'https://sua-api.com'; // ← Mudar aqui
```

### **2. Configurar Google Analytics (Opcional)**

Adicione no `<head>` de cada página:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### **3. Gerar Ícones PWA**

Use [https://www.pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator) para gerar todos os tamanhos de ícones necessários.

---

## 🧪 Testes

### **Manual Testing Checklist**

- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Dashboard carrega dados do usuário
- [ ] PWA pode ser instalado
- [ ] Funciona offline
- [ ] Responsivo em mobile
- [ ] Acessível por teclado
- [ ] Screen reader funciona

### **Testes Automatizados (Recomendado)**

```bash
# Instalar dependências de teste
npm install --save-dev vitest @testing-library/dom

# Rodar testes
npm test
```

---

## 📊 Métricas de Performance

### **Lighthouse Score Esperado**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 95+
- PWA: ✅ Installable

### **Core Web Vitals**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 🔐 Segurança

### **Cabeçalhos HTTP Recomendados**

Configure no servidor:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### **HTTPS**
- ✅ Sempre use HTTPS em produção
- ✅ Configure HSTS (HTTP Strict Transport Security)

---

## 🐛 Troubleshooting

### **Service Worker não registra**
```javascript
// Verificar no console do browser
navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Workers:', registrations);
});
```

### **PWA não aparece para instalar**
- Verifique se está usando HTTPS
- Verifique manifest.json
- Verifique se Service Worker está registrado

### **Erro de CORS**
- Backend deve ter `Access-Control-Allow-Origin` configurado
- Backend deve aceitar `credentials: include`

---

## 📚 Recursos

- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP - XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## 📝 Changelog

### v2.0.0 (2026-02-06)
- ✅ Segurança completa (XSS protection)
- ✅ PWA implementado
- ✅ Acessibilidade WCAG 2.1 AA
- ✅ SEO otimizado
- ✅ Performance otimizada

### v1.0.0 (2026-02-05)
- ✅ Versão inicial

---

## 👨‍💻 Autor

**Eduardo Melo** - iNurseApp

---

## 📄 Licença

Proprietary - Todos os direitos reservados © 2026 iNurseApp
