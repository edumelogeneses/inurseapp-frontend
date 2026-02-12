# 🔒 Guia de Segurança - iNurseApp Frontend

Documentação completa sobre as práticas de segurança implementadas.

---

## ✅ **Proteções Implementadas**

### **1. XSS (Cross-Site Scripting) Protection**

#### **✅ SEGURO - Uso de `textContent`**
```javascript
// ❌ VULNERÁVEL
element.innerHTML = userInput; // Pode executar scripts

// ✅ SEGURO
element.textContent = userInput; // Sempre escapa HTML
```

#### **✅ Sanitização de HTML**
```javascript
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
```

#### **✅ Content Security Policy (CSP)**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
```

---

### **2. CSRF (Cross-Site Request Forgery) Protection**

#### **✅ SameSite Cookies** (Backend)
```python
# FastAPI
response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=True,
    samesite="strict"  # ← Proteção CSRF
)
```

---

### **3. Rate Limiting (Client-Side)**

```javascript
const rateLimiter = {
    canAttempt(key, maxAttempts = 5, windowMs = 300000) {
        // Limita tentativas em janela de tempo
    }
};
```

**Limites configurados:**
- Login: 5 tentativas / 5 minutos
- Registro: 3 tentativas / 10 minutos

---

### **4. Validação de Inputs**

#### **Email**
```javascript
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
```

#### **Senha Forte**
- Mínimo 8 caracteres
- 1 letra maiúscula
- 1 letra minúscula
- 1 número
- 1 caractere especial

---

### **5. Secure Storage**

#### **❌ EVITAR: localStorage para dados sensíveis**
```javascript
// Vulnerável a XSS
localStorage.setItem('password', '123'); // NUNCA!
```

#### **✅ MELHOR: sessionStorage**
```javascript
// Expira ao fechar aba
sessionStorage.setItem('access_token', token);
```

#### **✅ IDEAL: httpOnly Cookies** (Backend)
```python
# JavaScript não pode acessar
response.set_cookie(httponly=True)
```

---

## 🚨 **Vulnerabilidades Conhecidas**

### **1. Token no LocalStorage**

**Status:** ⚠️ Vulnerável a XSS  
**Severidade:** Média  
**Mitigação Atual:** Sanitização rigorosa de inputs  
**Solução Ideal:** Migrar para httpOnly cookies

**Roadmap:**
- [ ] Backend: Implementar httpOnly cookies
- [ ] Frontend: Remover localStorage para tokens
- [ ] Frontend: Usar apenas cookies automáticos

---

### **2. Inline Styles**

**Status:** ⚠️ Pode violar CSP  
**Severidade:** Baixa  
**Mitigação:** Usar `'unsafe-inline'` no CSP (não ideal)  
**Solução:** Mover para arquivos CSS externos

**Roadmap:**
- [ ] Remover inline styles dos HTML
- [ ] Criar classes CSS reutilizáveis
- [ ] Remover `'unsafe-inline'` do CSP

---

## 🛡️ **Checklist de Segurança**

### **Antes de Deploy**

- [ ] Todos os inputs são validados
- [ ] Todas as saídas são sanitizadas
- [ ] HTTPS configurado
- [ ] CSP headers configurados
- [ ] Cookies com httpOnly e secure
- [ ] SameSite=strict configurado
- [ ] Rate limiting implementado
- [ ] CORS configurado corretamente
- [ ] Secrets não commitados no Git

### **Manutenção Regular**

- [ ] Atualizar dependências mensalmente
- [ ] Verificar vulnerabilidades (npm audit)
- [ ] Revisar logs de erros
- [ ] Testar penetração (pentesting)
- [ ] Backup de dados

---

## 📞 **Reportar Vulnerabilidades**

Se encontrar uma vulnerabilidade de segurança, por favor:

1. **NÃO** crie issue público no GitHub
2. Envie email para: security@inurseapp.com
3. Inclua:
   - Descrição detalhada
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se possível)

Responderemos em até 48 horas.

---

## 📚 **Recursos de Segurança**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Web Security Checklist](https://github.com/virajkulkarni14/WebDeveloperSecurityChecklist)

---

**Última atualização:** 2026-02-06
