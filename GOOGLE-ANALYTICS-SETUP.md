# 📊 Google Analytics Setup - iNurseApp

Guia completo para configurar o Google Analytics 4 (GA4).

---

## 🚀 **PASSO 1: Criar Conta Google Analytics**

### **1.1 Acessar Google Analytics**
1. Acesse: https://analytics.google.com/
2. Faça login com sua conta Google
3. Clique em **"Começar a medir"** (ou "Start measuring")

### **1.2 Criar Conta**
1. **Nome da conta:** `iNurseApp`
2. Marque as opções de compartilhamento (recomendado)
3. Clique em **"Avançar"**

### **1.3 Criar Propriedade**
1. **Nome da propriedade:** `iNurseApp - Frontend`
2. **Fuso horário:** `(GMT-03:00) Brasília`
3. **Moeda:** `Real brasileiro (BRL)`
4. Clique em **"Avançar"**

### **1.4 Informações da Empresa**
1. **Setor:** `Saúde e fitness`
2. **Tamanho da empresa:** Selecione conforme seu caso
3. **Como você pretende usar o Google Analytics:**
   - ✅ Examinar o comportamento do usuário
   - ✅ Medir conversões
4. Clique em **"Criar"**

### **1.5 Aceitar Termos**
1. Selecione seu país: **Brasil**
2. Aceite os **Termos de Serviço**
3. Clique em **"Aceito"**

---

## 📱 **PASSO 2: Configurar Fluxo de Dados (Web)**

### **2.1 Criar Fluxo de Dados Web**
1. Selecione plataforma: **Web**
2. Preencha:
   - **URL do site:** `https://inurseapp.com` (ou seu domínio)
   - **Nome do fluxo:** `iNurseApp Website`
   - ✅ **Medição aprimorada:** Ative tudo
3. Clique em **"Criar fluxo"**

### **2.2 Copiar ID de Medição**
Você verá algo como:

```
ID de medição
G-XXXXXXXXXX
```

**⚠️ IMPORTANTE: Copie este ID! Você vai usar no código.**

---

## 💻 **PASSO 3: Configurar no Código**

### **3.1 Editar `js/analytics.js`**

Abra o arquivo `js/analytics.js` e encontre esta linha:

```javascript
measurementId: 'G-XXXXXXXXXX', // ← MUDAR AQUI!
```

**Substitua** `G-XXXXXXXXXX` pelo seu ID real:

```javascript
measurementId: 'G-AB12CD34EF', // Exemplo
```

### **3.2 Adicionar Script nos HTML**

Já está configurado! Os arquivos HTML já incluem:

```html
<!-- Google Analytics (Global) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
<script src="js/analytics.js"></script>
```

**⚠️ Substitua `G-XXXXXXXXXX` pelo seu ID em TODOS os arquivos HTML:**
- `index.html`
- `register.html`
- `login.html`
- `dashboard.html`

---

## ✅ **PASSO 4: Testar**

### **4.1 Iniciar Servidor Local**
```powershell
cd C:\Projects\inurseapp\frontend
npx http-server -p 8000
```

### **4.2 Abrir Site**
Abra: http://localhost:8000

### **4.3 Verificar Console**
Pressione **F12** e vá na aba **Console**. Você deve ver:

```
📊 Google Analytics iniciado (debug mode)
```

### **4.4 Verificar em Tempo Real**
1. Volte ao Google Analytics
2. No menu lateral: **Relatórios** > **Tempo real**
3. Você deve ver **1 usuário ativo** (você!)

---

## 🎯 **EVENTOS CUSTOMIZADOS CONFIGURADOS**

### **Autenticação**
- `sign_up` - Quando usuário se registra
- `login` - Quando usuário faz login
- `logout` - Quando usuário faz logout

### **Assinatura**
- `view_plan` - Visualização de plano
- `begin_checkout` - Início do checkout
- `purchase` - Compra concluída
- `cancel_subscription` - Cancelamento

### **Uso de Features**
- `record_consultation` - Gravação de consulta
- `generate_soap` - Geração de SOAP
- `download_record` - Download de prontuário

### **Performance**
- `web_vitals` - LCP, FID, CLS
- `timing_complete` - Métricas customizadas
- `exception` - Erros JavaScript

### **Engagement**
- `scroll` - Profundidade de scroll (25%, 50%, 75%, 100%)
- `time_on_page` - Tempo na página
- `page_view` - Visualização de página

---

## 📊 **COMO USAR OS EVENTOS**

### **No Código:**

```javascript
// Exemplo 1: Rastrear registro
Analytics.trackSignUp('email');

// Exemplo 2: Rastrear visualização de plano
Analytics.trackViewPlan('PRO');

// Exemplo 3: Rastrear erro
Analytics.trackError('Falha ao carregar dados', false);

// Exemplo 4: Timing customizado
const start = Date.now();
// ... código ...
Analytics.trackTiming('api_response', Date.now() - start, 'API');
```

### **Ver Eventos no GA:**
1. **Tempo Real:** Relatórios > Tempo real
2. **Eventos:** Relatórios > Engajamento > Eventos
3. **Conversões:** Configure eventos importantes como conversões

---

## 🎨 **CONFIGURAÇÕES RECOMENDADAS**

### **1. Configurar Conversões**

No Google Analytics:
1. **Administração** > **Eventos**
2. Clique em **"Criar evento"**
3. Marque como **conversão** estes eventos:
   - `sign_up`
   - `purchase`
   - `generate_soap`

### **2. Criar Públicos-Alvo**

**Público: Usuários Engajados**
- Condição: `generate_soap` > 3 nos últimos 30 dias

**Público: Potenciais Compradores**
- Condição: `view_plan = PRO` E sem `purchase`

### **3. Configurar E-commerce**

Se ainda não configurado:
1. **Administração** > **Configurações de dados** > **E-commerce**
2. Ative **"Ativar e-commerce aprimorado"**

---

## 🔒 **PRIVACIDADE E GDPR**

### **Consentimento de Cookies**

Para estar em conformidade com LGPD/GDPR, adicione:

```html
<!-- Cookie Consent (exemplo simples) -->
<div id="cookie-consent" style="display:none; position:fixed; bottom:0; left:0; right:0; background:#1f2937; color:white; padding:1rem; text-align:center; z-index:9999;">
  <p>Usamos cookies para melhorar sua experiência. 
     <a href="/privacy.html" style="color:#3b82f6;">Política de Privacidade</a>
  </p>
  <button onclick="acceptCookies()" style="background:#10b981; color:white; border:none; padding:0.5rem 1rem; border-radius:0.25rem; cursor:pointer;">
    Aceitar
  </button>
</div>

<script>
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'true');
  document.getElementById('cookie-consent').style.display = 'none';
}

if (!localStorage.getItem('cookieConsent')) {
  document.getElementById('cookie-consent').style.display = 'block';
}
</script>
```

---

## 📈 **DASHBOARDS RECOMENDADOS**

### **Dashboard 1: Overview**
- Usuários ativos
- Novos usuários
- Taxa de conversão (sign_up / visitantes)
- Eventos top 10

### **Dashboard 2: Assinaturas**
- Funil: view_plan → begin_checkout → purchase
- Valor total de compras
- Planos mais visualizados
- Taxa de cancelamento

### **Dashboard 3: Performance**
- LCP, FID, CLS
- Tempo médio na página
- Taxa de rejeição
- Páginas com erro

---

## 🐛 **TROUBLESHOOTING**

### **"Não vejo meus dados em Tempo Real"**

1. Verifique se o ID de medição está correto
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Verifique o console por erros (F12)
4. Teste em janela anônima
5. Aguarde 1-2 minutos (pode haver delay)

### **"Eventos não aparecem"**

1. Verifique se `analytics.js` está carregado (Network tab)
2. Veja o console: deve ter `📊 Google Analytics iniciado`
3. Teste manualmente: `Analytics.trackEvent('test', {})`
4. Aguarde 24h para eventos aparecerem em relatórios (Tempo Real é instantâneo)

### **"Debug mode não funciona"**

Verifique se `window.location.hostname === 'localhost'` retorna `true`.

---

## 📚 **RECURSOS**

- [Google Analytics 4 Docs](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Web Vitals](https://web.dev/vitals/)
- [LGPD - Brasil](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

## ✅ **CHECKLIST FINAL**

- [ ] Conta Google Analytics criada
- [ ] Propriedade configurada
- [ ] Fluxo de dados Web criado
- [ ] ID de medição copiado
- [ ] `js/analytics.js` atualizado com ID
- [ ] Todos HTML atualizados com scripts
- [ ] Testado em tempo real
- [ ] Conversões configuradas
- [ ] Cookie consent implementado (LGPD)
- [ ] Política de privacidade criada

---

**Pronto! Seu Google Analytics está configurado! 📊**

Qualquer dúvida, consulte a documentação oficial ou o console do navegador (F12).
