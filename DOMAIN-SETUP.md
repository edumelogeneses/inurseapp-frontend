# 🌐 Conectar Domínio ao Netlify - inurseapp.com

Guia completo para conectar seu domínio `www.inurseapp.com` ao site no Netlify.

---

## 🚀 **PASSO A PASSO**

### **PASSO 1: Fazer Deploy no Netlify**

Se ainda não fez:
1. https://app.netlify.com/drop
2. Arrastar pasta `frontend`
3. Aguardar deploy
4. Você receberá URL temporária: `https://random-name-123456.netlify.app`

---

### **PASSO 2: Adicionar Domínio Customizado**

#### **No Netlify Dashboard:**

1. **Acesse seu site** no dashboard do Netlify
2. Clique em **"Domain settings"** (ou "Site settings" > "Domain management")
3. Clique em **"Add custom domain"**
4. Digite: `inurseapp.com` (sem www)
5. Clique em **"Verify"**
6. Netlify perguntará: "Do you own this domain?"
7. Clique em **"Yes, add domain"**

#### **Adicionar WWW:**

1. Clique em **"Add domain alias"**
2. Digite: `www.inurseapp.com`
3. Adicionar

---

### **PASSO 3: Configurar DNS**

Agora você precisa apontar seu domínio para o Netlify.

#### **OPÇÃO A: DNS do Netlify (Recomendado - Mais Fácil)**

**Vantagens:**
- ✅ Configuração automática
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Sem preocupação com registros

**Como fazer:**

1. No Netlify, em **Domain settings**
2. Clique em **"Set up Netlify DNS"** (pode aparecer como banner)
3. Clique em **"Verify DNS configuration"**
4. Netlify mostrará os **nameservers**:
   ```
   dns1.p0X.nsone.net
   dns2.p0X.nsone.net
   dns3.p0X.nsone.net
   dns4.p0X.nsone.net
   ```
5. **Copie** esses nameservers

**No seu Registrador de Domínio (ex: Registro.br, GoDaddy, Hostgator):**

1. Faça login no painel
2. Encontre **"Gerenciar DNS"** ou **"Nameservers"**
3. Mude de **"Default nameservers"** para **"Custom nameservers"**
4. **Cole** os 4 nameservers do Netlify
5. **Salvar**

⏱️ **Tempo de propagação:** 24-48 horas (geralmente 1-2 horas)

---

#### **OPÇÃO B: Manter DNS Atual (Avançado)**

Se você quer manter seu DNS atual (ex: CloudFlare, seu registrador):

**Registros DNS necessários:**

1. **Para `inurseapp.com` (apex/root):**
   ```
   Type: A
   Name: @ (ou deixe em branco)
   Value: 75.2.60.5
   TTL: 3600 (ou automático)
   ```

   **OU** (preferível):
   ```
   Type: ALIAS (ou ANAME)
   Name: @
   Value: SEU-SITE.netlify.app
   TTL: 3600
   ```

2. **Para `www.inurseapp.com`:**
   ```
   Type: CNAME
   Name: www
   Value: SEU-SITE.netlify.app
   TTL: 3600
   ```

   **Exemplo:**
   ```
   Type: CNAME
   Name: www
   Value: amazing-name-123456.netlify.app
   TTL: 3600
   ```

**⚠️ IMPORTANTE:**
- Se usar **A record**, use IP: `75.2.60.5`
- Se seu DNS suporta **ALIAS/ANAME**, use isso (melhor)
- **CNAME** só funciona para subdomínios (www), não para apex (@)

---

### **PASSO 4: Aguardar Propagação DNS**

- ⏱️ **Tempo:** 1-48 horas (geralmente 1-2 horas)
- 🔍 **Verificar:** https://dnschecker.org/

Digite `inurseapp.com` e veja se os servidores DNS estão atualizados.

---

### **PASSO 5: Ativar HTTPS (Automático)**

Quando DNS estiver propagado:

1. Netlify detectará automaticamente
2. Gerará certificado SSL (Let's Encrypt)
3. HTTPS será ativado em ~1 hora

Você verá:
```
✅ HTTPS: Enabled
```

**Forçar HTTPS:**
1. Domain settings
2. **"Force HTTPS"** → Ativar
3. Redireciona HTTP → HTTPS automaticamente

---

### **PASSO 6: Configurar Redirecionamento WWW**

No Netlify, você pode escolher:

**Opção A: `inurseapp.com` como primário**
- `www.inurseapp.com` → redireciona para `inurseapp.com`

**Opção B: `www.inurseapp.com` como primário**
- `inurseapp.com` → redireciona para `www.inurseapp.com`

**Como configurar:**

1. Domain settings > Domain aliases
2. Clique em **"Options"** ao lado do domínio
3. **"Set as primary domain"**

Netlify fará redirect automático do outro.

---

## 🔧 **CONFIGURAÇÕES ADICIONAIS**

### **1. Arquivo `_redirects` (Opcional)**

Criar `_redirects` na raiz do projeto:

```
# Redirecionar HTTP para HTTPS (já feito pelo Netlify)
http://inurseapp.com/* https://inurseapp.com/:splat 301!
http://www.inurseapp.com/* https://www.inurseapp.com/:splat 301!

# SPA redirect (manter navegação)
/*  /index.html  200

# API proxy (se necessário)
/api/*  https://lively-embrace-production-a4a2.up.railway.app/api/:splat  200
```

### **2. Headers de Segurança**

Já configurado em `netlify.toml` ✅

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

## 🧪 **TESTAR CONFIGURAÇÃO**

### **1. Verificar DNS**

```powershell
# Windows
nslookup inurseapp.com
nslookup www.inurseapp.com

# Ou use: https://dnschecker.org/
```

**Resultado esperado:**
```
Name:    inurseapp.com
Address: 75.2.60.5

Name:    www.inurseapp.com
Address: [IP do Netlify CDN]
```

### **2. Verificar SSL**

1. Abra: https://inurseapp.com
2. Clique no **cadeado** na barra de endereço
3. Certificado deve ser válido

### **3. Testar Redirecionamentos**

```
http://inurseapp.com → https://inurseapp.com ✅
http://www.inurseapp.com → https://www.inurseapp.com ✅
https://www.inurseapp.com → https://inurseapp.com (ou vice-versa) ✅
```

---

## 📊 **DOMÍNIOS CONFIGURADOS**

Após tudo configurado, você terá:

```
✅ https://inurseapp.com (primário)
✅ https://www.inurseapp.com (alias ou redirect)
✅ https://SEU-SITE.netlify.app (sempre funciona)
```

---

## 🐛 **TROUBLESHOOTING**

### **"DNS não propaga"**

**Causa:** Pode levar até 48h
**Solução:**
1. Verificar nameservers corretos
2. Limpar cache DNS local:
   ```powershell
   ipconfig /flushdns
   ```
3. Testar em rede diferente (4G do celular)

### **"HTTPS não ativa"**

**Causa:** DNS ainda não propagou completamente
**Solução:**
1. Aguardar DNS propagar (dnschecker.org)
2. No Netlify: Domain settings > "Renew certificate"

### **"ERR_TOO_MANY_REDIRECTS"**

**Causa:** Conflito de redirecionamentos
**Solução:**
1. Desativar redirects no registrador
2. Deixar Netlify gerenciar tudo
3. Remover proxy CloudFlare (ou configurar SSL Full)

### **"Site não carrega"**

**Causa:** DNS incorreto
**Solução:**
1. Verificar registros A/CNAME
2. IP correto: `75.2.60.5`
3. CNAME correto: `SEU-SITE.netlify.app`

---

## ✅ **CHECKLIST**

- [ ] Deploy no Netlify completo
- [ ] Domínio adicionado no Netlify
- [ ] DNS configurado (nameservers OU A/CNAME)
- [ ] Aguardado propagação (dnschecker.org)
- [ ] HTTPS ativado
- [ ] Force HTTPS habilitado
- [ ] Domínio primário definido
- [ ] Testado: http → https
- [ ] Testado: www → não-www (ou vice-versa)
- [ ] Certificado SSL válido

---

## 📚 **RECURSOS**

- [Netlify DNS Docs](https://docs.netlify.com/domains-https/netlify-dns/)
- [Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)
- [DNS Checker](https://dnschecker.org/)
- [SSL Test](https://www.ssllabs.com/ssltest/)

---

## 🎯 **TEMPO ESTIMADO**

- **Configuração:** 10-15 minutos
- **Propagação DNS:** 1-48 horas (geralmente 1-2h)
- **HTTPS ativo:** Automático após propagação

---

**Dúvidas? Consulte o troubleshooting ou entre em contato!** 💬
