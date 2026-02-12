# 🌐 Configurar DNS - Namecheap → Netlify

Guia específico para conectar domínio Namecheap ao Netlify.

---

## 🎯 **DUAS OPÇÕES**

### **OPÇÃO A: Netlify DNS (Recomendado - Mais Fácil)**
- Transferir DNS para Netlify
- HTTPS automático garantido
- Gerenciamento simplificado

### **OPÇÃO B: Manter Namecheap DNS**
- Configurar registros A e CNAME
- Você controla o DNS

---

## ⭐ **OPÇÃO A: NETLIFY DNS (RECOMENDADO)**

### **PASSO 1: No Netlify**

1. Acesse seu site no Netlify
2. **Domain management** (menu lateral)
3. Clique em **"Add custom domain"**
4. Digite: `inurseapp.com`
5. **Verify** > **"Yes, add domain"**
6. Clique em **"Set up Netlify DNS"**
7. **Netlify mostrará 4 nameservers:**
   ```
   dns1.p0X.nsone.net
   dns2.p0X.nsone.net
   dns3.p0X.nsone.net
   dns4.p0X.nsone.net
   ```
8. **COPIE** esses nameservers

---

### **PASSO 2: No Namecheap**

1. **Login:** https://www.namecheap.com/
2. **Account** > **Dashboard**
3. **Domain List** > Encontre `inurseapp.com`
4. Clique em **"Manage"** ao lado do domínio

5. **Na aba "Domain":**
   - Procure seção **"NAMESERVERS"**
   - Atualmente está: "Namecheap BasicDNS" (ou similar)

6. **Mudar Nameservers:**
   - Selecione: **"Custom DNS"**
   - Cole os 4 nameservers do Netlify:
     ```
     Nameserver 1: dns1.p0X.nsone.net
     Nameserver 2: dns2.p0X.nsone.net
     Nameserver 3: dns3.p0X.nsone.net
     Nameserver 4: dns4.p0X.nsone.net
     ```
   - Clique no ✓ (checkmark) para salvar

7. **Confirmar:**
   - Namecheap pedirá confirmação
   - **"Yes, I confirm"**

---

### **PASSO 3: Aguardar Propagação**

- ⏱️ **Tempo:** 1-48 horas (geralmente 1-2 horas)
- 🔍 **Verificar:** https://dnschecker.org/
- ✅ **Quando pronto:** Netlify ativará HTTPS automaticamente

---

## 🔧 **OPÇÃO B: MANTER NAMECHEAP DNS**

Se preferir manter controle do DNS no Namecheap:

### **PASSO 1: No Netlify**

1. Domain management
2. Add custom domain: `inurseapp.com`
3. Netlify mostrará: "Please add DNS records"

---

### **PASSO 2: No Namecheap - Configurar Registros**

1. **Login Namecheap**
2. **Domain List** > **Manage** (`inurseapp.com`)
3. **Advanced DNS** (aba)

4. **Adicionar Registro A (para domínio raiz):**
   ```
   Type: A Record
   Host: @
   Value: 75.2.60.5
   TTL: Automatic
   ```
   - Clique em **"Add New Record"**

5. **Adicionar Registro CNAME (para www):**
   ```
   Type: CNAME Record
   Host: www
   Value: inurseapp.netlify.app
   TTL: Automatic
   ```
   - Clique em **"Add New Record"**

6. **Remover registros conflitantes:**
   - Se houver outros registros A ou CNAME para @ ou www
   - **Delete** esses registros antigos

7. **Salvar:**
   - Clique em **"Save All Changes"** (botão verde)

---

### **PASSO 3: Verificar no Netlify**

1. Volte ao Netlify > Domain management
2. Aguarde verificação (~5-30 minutos)
3. Status mudará para **"Netlify DNS enabled"** ou **"DNS configured"**

---

## ⚠️ **IMPORTANTE - NAMECHEAP ESPECÍFICO**

### **Parking Page (Página de Estacionamento)**

Namecheap tem "parking page" padrão. Remova:

1. **Advanced DNS**
2. Procure por registros:
   ```
   @ → URL Redirect Record → parkingpage.namecheap.com
   ```
3. **Delete** esse registro
4. Adicione o registro A correto (75.2.60.5)

### **SSL/HTTPS**

- ✅ **Netlify DNS:** SSL automático garantido
- ⚠️ **Namecheap DNS:** Pode demorar mais (aguarde até 24h)

---

## 🧪 **TESTAR CONFIGURAÇÃO**

### **Verificar DNS:**

**Windows (PowerShell):**
```powershell
nslookup inurseapp.com
nslookup www.inurseapp.com
```

**Ou use:** https://dnschecker.org/

---

### **Resultado Esperado:**

**Se usar Netlify DNS:**
```
inurseapp.com → [IP do Netlify]
www.inurseapp.com → [IP do Netlify]
```

**Se usar Namecheap DNS:**
```
inurseapp.com → 75.2.60.5
www.inurseapp.com → inurseapp.netlify.app → [IP]
```

---

## 📊 **TIMELINE**

```
AGORA:        Configurar nameservers/DNS (5 min)
+30 min:      Primeiros servidores começam ver mudança
+2-4 horas:   Maioria dos servidores atualizada
+24-48h:      Propagação completa global
```

---

## 🐛 **TROUBLESHOOTING NAMECHEAP**

### **"Parking page ainda aparece"**

**Solução:**
1. Advanced DNS
2. Deletar URL Redirect Records
3. Aguardar cache limpar (1-2 horas)

### **"HTTPS não ativa"**

**Solução:**
1. Usar Netlify DNS (mais confiável)
2. Aguardar 24-48h
3. No Netlify: Domain settings > "Renew certificate"

### **"DNS não propaga"**

**Solução:**
1. Verificar nameservers corretos
2. Limpar cache DNS local:
   ```powershell
   ipconfig /flushdns
   ```
3. Testar em rede diferente (4G celular)

---

## ✅ **CHECKLIST**

- [ ] Domínio adicionado no Netlify
- [ ] Nameservers configurados no Namecheap
  - [ ] dns1.p0X.nsone.net
  - [ ] dns2.p0X.nsone.net
  - [ ] dns3.p0X.nsone.net
  - [ ] dns4.p0X.nsone.net
- [ ] Parking page removida
- [ ] Aguardando propagação (dnschecker.org)
- [ ] HTTPS ativado no Netlify
- [ ] Testado: https://inurseapp.com
- [ ] Testado: https://www.inurseapp.com

---

## 📞 **SUPORTE**

**Namecheap:** https://www.namecheap.com/support/  
**Netlify:** https://docs.netlify.com/domains-https/  
**DNS Checker:** https://dnschecker.org/

---

**Tempo total: 5-10 minutos de configuração + 1-48h de propagação**

Boa sorte! 🚀
