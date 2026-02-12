# 📊 Google Analytics - Resumo

## ✅ **O QUE FOI CONFIGURADO**

### **1. Arquivo Analytics (js/analytics.js)**
- ✅ Inicialização automática do GA4
- ✅ 15+ eventos customizados configurados
- ✅ Rastreamento de erros JavaScript
- ✅ Web Vitals (LCP, FID, CLS)
- ✅ Scroll depth tracking
- ✅ Time on page tracking
- ✅ Debug mode para desenvolvimento

### **2. Integração com Auth (js/auth.js)**
- ✅ `trackSignUp()` no registro
- ✅ `trackLogin()` no login
- ✅ `trackLogout()` no logout
- ✅ `setUserId()` e `setUserProperties()` automáticos

### **3. Documentação**
- ✅ Guia completo de setup (GOOGLE-ANALYTICS-SETUP.md)
- ✅ Template HTML (google-analytics-template.html)
- ✅ Este resumo (ANALYTICS-README.md)

---

## 🚀 **COMO ATIVAR (3 PASSOS)**

### **PASSO 1: Criar Conta Google Analytics**
1. Acesse: https://analytics.google.com/
2. Crie conta e propriedade
3. Configure fluxo de dados Web
4. **Copie o ID de medição** (ex: `G-AB12CD34EF`)

**Guia detalhado:** `GOOGLE-ANALYTICS-SETUP.md`

---

### **PASSO 2: Configurar ID no Código**

**Edite `js/analytics.js` (linha 14):**
```javascript
measurementId: 'G-AB12CD34EF', // ← SEU ID AQUI
```

---

### **PASSO 3: Adicionar Script nos HTML**

Adicione ANTES de `</head>` em **TODOS** os arquivos HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-AB12CD34EF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-AB12CD34EF');
</script>
```

Adicione ANTES de `</body>`:

```html
<script src="js/analytics.js"></script>
```

**Arquivos para editar:**
- ✅ `index.html`
- ✅ `register.html`
- ✅ `login.html`
- ✅ `dashboard.html`

**Dica:** Use template em `google-analytics-template.html`

---

## ✅ **TESTE**

1. Inicie servidor: `npx http-server -p 8000`
2. Abra: http://localhost:8000
3. Console deve mostrar: `📊 Google Analytics iniciado (debug mode)`
4. Google Analytics > Tempo Real: deve aparecer 1 usuário ativo

---

## 📊 **EVENTOS DISPONÍVEIS**

### **Autenticação:**
```javascript
Analytics.trackSignUp('email');      // Registro
Analytics.trackLogin('email');       // Login
Analytics.trackLogout();             // Logout
```

### **Assinatura:**
```javascript
Analytics.trackViewPlan('PRO');                     // Ver plano
Analytics.trackBeginCheckout('PRO', 97);            // Iniciar checkout
Analytics.trackPurchase('PRO', 97, 'txn_123');      // Compra
Analytics.trackCancelSubscription('PRO', 'caro');   // Cancelar
```

### **Features:**
```javascript
Analytics.trackRecordConsultation(180);         // Gravar consulta (180s)
Analytics.trackGenerateSOAP(true, 5000);        // Gerar SOAP (5k tokens)
Analytics.trackDownloadRecord('PDF');           // Download
```

### **Genéricos:**
```javascript
Analytics.trackEvent('custom_event', { key: 'value' });
Analytics.trackError('Descrição do erro', false);
Analytics.trackTiming('api_call', 1500, 'API');
```

---

## 📈 **DASHBOARDS NO GOOGLE ANALYTICS**

### **Relatórios Principais:**

1. **Tempo Real**
   - Usuários ativos agora
   - Eventos em tempo real
   - Páginas sendo visitadas

2. **Engajamento > Eventos**
   - Todos os eventos rastreados
   - Count, conversões, receita

3. **Usuários > Resumo**
   - Novos vs retornando
   - Demografia
   - Tecnologia

4. **E-commerce (se configurado)**
   - Funil de conversão
   - Receita total
   - Transações

---

## 🔒 **PRIVACIDADE (LGPD)**

### **Cookie Consent (Opcional)**

Adicione antes de `</body>` em `index.html`:

```html
<div id="cookie-banner" style="display:none; position:fixed; bottom:0; width:100%; background:#1f2937; color:white; padding:1rem; text-align:center; z-index:9999;">
  <p>
    Usamos cookies para melhorar sua experiência. 
    <a href="/privacy.html" style="color:#3b82f6;">Política de Privacidade</a>
  </p>
  <button onclick="acceptCookies()" class="btn btn-primary">Aceitar</button>
</div>

<script>
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
}
if (!localStorage.getItem('cookieConsent')) {
  document.getElementById('cookie-banner').style.display = 'block';
}
</script>
```

---

## 📚 **RECURSOS**

- **Setup completo:** `GOOGLE-ANALYTICS-SETUP.md`
- **Template HTML:** `google-analytics-template.html`
- **Código fonte:** `js/analytics.js`
- **Docs oficiais:** https://support.google.com/analytics/

---

## ✅ **CHECKLIST**

- [ ] Conta GA criada
- [ ] ID de medição copiado
- [ ] `js/analytics.js` atualizado (measurementId)
- [ ] Scripts adicionados em todos HTML
- [ ] Testado em localhost (console + tempo real)
- [ ] Conversões configuradas (sign_up, purchase)
- [ ] Cookie consent implementado (LGPD)

---

**Pronto! Google Analytics configurado! 🎉**

Qualquer dúvida, veja `GOOGLE-ANALYTICS-SETUP.md` ou console (F12).
