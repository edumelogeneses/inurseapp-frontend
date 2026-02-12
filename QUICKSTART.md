# ⚡ Quick Start - iNurseApp Frontend

Guia rápido para começar a desenvolver no projeto em **5 minutos**.

## 🎯 Pré-requisitos

- ✅ Git instalado
- ✅ Navegador moderno
- ✅ Editor de código (VS Code recomendado)
- ✅ (Opcional) Live Server extension

## 🚀 Setup em 3 Passos

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/edumelogeneses/inurseapp-frontend.git
cd inurseapp-frontend
```

### 2️⃣ Abra no VS Code

```bash
code .
```

### 3️⃣ Rode Localmente

**Opção A - Live Server (Recomendado):**
- Clique direito em `index.html`
- "Open with Live Server"

**Opção B - Python:**
```bash
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Opção C - npx serve:**
```bash
npx serve
```

## 📁 Arquivos Principais

| Arquivo | Função |
|---------|--------|
| `index.html` | Landing page |
| `login.html` | Página de login |
| `register.html` | Página de cadastro |
| `js/api.js` | **⭐ Configuração da API** |
| `js/auth.js` | Funções de autenticação |
| `css/style.css` | Estilos globais |

## 🔧 Configuração da API

Abra `js/api.js` e verifique a URL:

```javascript
const API_BASE_URL = 'https://lively-embrace-production-a4a2.up.railway.app';
```

## 🧪 Testar Conexão com Backend

1. Abra: `http://localhost:8000/test.html`
2. Clique nos 4 botões de teste:
   - ✅ Teste de Raiz
   - ✅ Health Check
   - ✅ Registro
   - ✅ Login

## 📝 Fazer Alterações

```bash
# 1. Crie uma branch
git checkout -b feature/minha-feature

# 2. Faça suas alterações
# Edite os arquivos...

# 3. Commit
git add .
git commit -m "feat: adiciona nova feature"

# 4. Push
git push origin feature/minha-feature

# 5. Abra PR no GitHub
```

## 🎨 Design System

### Cores Principais

```css
--primary: #0066CC        /* Azul principal */
--success: #10B981        /* Verde (sucesso) */
--danger: #EF4444         /* Vermelho (erro) */
--gray-900: #111827       /* Texto principal */
```

### Componentes Prontos

- `btn btn-primary` - Botão principal
- `btn btn-secondary` - Botão secundário
- `form-input` - Input de formulário
- `card` - Card genérico
- `alert alert-success` - Alerta de sucesso

## 🔍 Estrutura de Componentes

```
Landing Page (index.html)
├── Header/Navigation
├── Hero Section (com animação)
├── Features Section
├── Pricing Section
└── Footer

Auth Pages (login/register)
├── Auth Container
├── Form
└── Social Login (preparado)
```

## 📊 Fluxo de Autenticação

```javascript
// 1. Usuário faz registro
register(userData) 
  → POST /api/v1/auth/register
  → Salva token em localStorage
  → Redireciona para dashboard

// 2. Usuário faz login
login(email, password)
  → POST /api/v1/auth/login
  → Salva token em localStorage
  → Redireciona para dashboard

// 3. Chamadas autenticadas
API.get('/api/v1/users/me')
  → Header: Authorization: Bearer {token}
```

## 🐛 Debug

### Console do Navegador

```javascript
// Ver token salvo
localStorage.getItem('access_token')

// Ver usuário
JSON.parse(localStorage.getItem('user'))

// Limpar sessão
localStorage.clear()
```

### Network Tab

- Abra DevTools → Network
- Veja todas as chamadas para API
- Verifique headers, response, etc

## 📚 Recursos Úteis

- **Backend API Docs**: https://lively-embrace-production-a4a2.up.railway.app/docs
- **Netlify Dashboard**: https://app.netlify.com
- **Google Analytics**: https://analytics.google.com

## ❓ FAQ

**Q: Como adicionar uma nova página?**  
A: Crie `nova-pagina.html`, adicione no `sitemap.xml`, e faça commit.

**Q: Como mudar a URL da API?**  
A: Edite `js/api.js` → `API_BASE_URL`

**Q: Como testar localmente?**  
A: Use Live Server ou `python -m http.server 8000`

**Q: Deploy demora quanto tempo?**  
A: 30-60 segundos após o push

## 🎉 Pronto!

Agora você está pronto para desenvolver! 🚀

**Próximos passos:**
1. ✅ Explore o código
2. ✅ Faça suas alterações
3. ✅ Teste localmente
4. ✅ Commit e push
5. ✅ Deploy automático!

---

**Dúvidas?** Abra uma issue no GitHub ou entre em contato!
