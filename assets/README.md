# 🎨 Assets - iNurseApp

Esta pasta contém os recursos visuais do iNurseApp.

---

## 📁 Estrutura

```
assets/
├── logo.svg                  # Logo principal (512x512)
├── logo-simple.svg           # Logo simplificado
├── icons/                    # Ícones PWA (gerados)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── ICONS-GUIDE.md            # Guia completo de geração
└── README.md                 # Este arquivo
```

---

## 🚀 Como Gerar os Ícones

### **Opção 1: Online (Recomendado - Mais Fácil)**

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do arquivo `logo.svg`
3. Clique em "Generate Images"
4. Baixe o ZIP
5. Extraia para a pasta `icons/`

**Vantagens:**
- ✅ Não precisa instalar nada
- ✅ Gera todos os tamanhos automaticamente
- ✅ Otimiza as imagens

---

### **Opção 2: Script Automatizado (Requer ImageMagick)**

**Passo 1:** Instalar ImageMagick

```powershell
# Via Chocolatey
choco install imagemagick

# Ou baixar de: https://imagemagick.org/script/download.php
```

**Passo 2:** Executar o script

```powershell
cd C:\Projects\inurseapp\frontend
.\generate-icons.ps1
```

**Resultado:**
- 8 ícones PWA (72px até 512px)
- 4 favicons (16px, 32px, 180px, .ico)

---

### **Opção 3: Manual (Figma/Photoshop)**

1. Abra `logo.svg` no Figma ou Photoshop
2. Exporte nos seguintes tamanhos:
   - 72x72, 96x96, 128x128, 144x144
   - 152x152, 192x192, 384x384, 512x512
3. Salve como PNG na pasta `icons/`
4. Nomeie como `icon-{size}x{size}.png`

---

## ✅ Verificar Ícones Gerados

Abra `icon-preview.html` no navegador para ver todos os ícones:

```powershell
# Com servidor local
cd C:\Projects\inurseapp\frontend
npx http-server -p 8000

# Abrir: http://localhost:8000/icon-preview.html
```

---

## 🎨 Cores do Tema

- **Primary:** `#2563EB` (Azul médico)
- **Background:** `#FFFFFF` (Branco)
- **Status Bar (iOS):** `black-translucent`

---

## 📋 Checklist

- [ ] Logo SVG criado
- [ ] Ícones PWA gerados (8 tamanhos)
- [ ] Favicons gerados (4 arquivos)
- [ ] Preview verificado em `icon-preview.html`
- [ ] HTML atualizado com links dos favicons ✅
- [ ] Manifest.json configurado ✅
- [ ] Testado em DevTools > Application > Manifest
- [ ] Testado instalação PWA em mobile

---

## 📚 Documentação

Para guia completo, veja: `ICONS-GUIDE.md`
