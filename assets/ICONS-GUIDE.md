# 🎨 Guia de Geração de Ícones PWA - iNurseApp

## 📦 **Tamanhos Necessários**

### **PWA Icons (manifest.json)**
- `icon-72x72.png` - Android launcher (ldpi)
- `icon-96x96.png` - Android launcher (mdpi)
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iPad touch icon
- `icon-192x192.png` - Android launcher (xxxhdpi)
- `icon-384x384.png` - Android splash
- `icon-512x512.png` - PWA install prompt

### **Favicons**
- `favicon.ico` - 16x16, 32x32, 48x48 (multi-size)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180

### **Screenshots (PWA)**
- `screenshot-mobile.png` - 540x720
- `screenshot-desktop.png` - 1920x1080

---

## 🚀 **MÉTODO 1: Online (Mais Fácil)**

### **PWA Builder (Recomendado)**
1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Upload: `assets/logo.svg`
3. Clique em "Generate Images"
4. Download ZIP
5. Extrair para `assets/icons/`

### **Favicon Generator**
1. Acesse: https://realfavicongenerator.net/
2. Upload: `assets/logo.svg`
3. Configure opções:
   - iOS: Background color: #2563EB
   - Android: Theme color: #2563EB
   - Windows: Tile color: #2563EB
4. Download ZIP
5. Extrair na raiz do projeto

---

## 💻 **MÉTODO 2: Linha de Comando**

### **Instalar ImageMagick**
```powershell
# Windows (via Chocolatey)
choco install imagemagick

# Ou baixar: https://imagemagick.org/script/download.php
```

### **Gerar todos os tamanhos**
```powershell
cd C:\Projects\inurseapp\frontend\assets

# Converter SVG para PNG em vários tamanhos
magick logo.svg -resize 72x72 icons/icon-72x72.png
magick logo.svg -resize 96x96 icons/icon-96x96.png
magick logo.svg -resize 128x128 icons/icon-128x128.png
magick logo.svg -resize 144x144 icons/icon-144x144.png
magick logo.svg -resize 152x152 icons/icon-152x152.png
magick logo.svg -resize 192x192 icons/icon-192x192.png
magick logo.svg -resize 384x384 icons/icon-384x384.png
magick logo.svg -resize 512x512 icons/icon-512x512.png

# Favicons
magick logo.svg -resize 16x16 ../favicon-16x16.png
magick logo.svg -resize 32x32 ../favicon-32x32.png
magick logo.svg -resize 180x180 ../apple-touch-icon.png

# Gerar favicon.ico (multi-size)
magick logo.svg -define icon:auto-resize=16,32,48 ../favicon.ico
```

---

## 🖼️ **MÉTODO 3: Figma/Photoshop**

### **1. Abrir logo.svg no Figma**
   - File > Import > Selecionar `logo.svg`

### **2. Exportar múltiplos tamanhos**
   - Selecionar layer principal
   - Export Settings:
     - 0.14x (72px)
     - 0.19x (96px)
     - 0.25x (128px)
     - 0.28x (144px)
     - 0.30x (152px)
     - 0.38x (192px)
     - 0.75x (384px)
     - 1x (512px)
   - Format: PNG
   - Export

### **3. Renomear arquivos**
   - Renomear para `icon-{size}.png`
   - Mover para `assets/icons/`

---

## 📱 **SCREENSHOTS para PWA**

### **Mobile Screenshot (540x720)**
```powershell
# Capturar tela do site em mobile
# Ou usar Figma para criar um mockup:
# - Frame: iPhone 14 (390x844)
# - Screenshot do app
# - Resize para 540x720
```

### **Desktop Screenshot (1920x1080)**
```powershell
# Capturar tela do site em desktop
# Ou usar Figma:
# - Frame: Desktop (1920x1080)
# - Screenshot do app
```

---

## ✅ **Checklist Pós-Geração**

- [ ] Todos os tamanhos PWA gerados (8 arquivos)
- [ ] Favicons gerados (3 arquivos + ico)
- [ ] Screenshots gerados (2 arquivos)
- [ ] Arquivos movidos para pastas corretas
- [ ] Manifest.json atualizado com caminhos corretos
- [ ] HTML atualizado com links dos favicons
- [ ] Testado em DevTools > Application > Manifest
- [ ] Testado em dispositivo mobile real

---

## 🔧 **Script Automatizado PowerShell**

Salve como `generate-icons.ps1`:

```powershell
# Verificar se ImageMagick está instalado
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ImageMagick não encontrado. Instale: choco install imagemagick"
    exit 1
}

$source = "assets/logo.svg"
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "🎨 Gerando ícones PWA..."

foreach ($size in $sizes) {
    $output = "assets/icons/icon-${size}x${size}.png"
    magick $source -resize "${size}x${size}" $output
    Write-Host "✅ Gerado: $output"
}

Write-Host "🎨 Gerando favicons..."
magick $source -resize 16x16 favicon-16x16.png
magick $source -resize 32x32 favicon-32x32.png
magick $source -resize 180x180 apple-touch-icon.png
magick $source -define icon:auto-resize=16,32,48 favicon.ico

Write-Host "✅ Todos os ícones gerados com sucesso!"
```

Execute:
```powershell
cd C:\Projects\inurseapp\frontend
.\generate-icons.ps1
```

---

## 📝 **Atualizar HTML**

Depois de gerar, adicione no `<head>` de todas as páginas:

```html
<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#2563EB">

<!-- iOS Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="iNurseApp">
```

---

## 🎨 **Cores do Tema**

- **Primary:** `#2563EB` (Azul médico)
- **Background:** `#FFFFFF` (Branco)
- **Status Bar (iOS):** `black-translucent`

---

## 📸 **Preview dos Ícones**

### **Ver todos os ícones gerados:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Icon Preview</title>
    <style>
        body { font-family: Arial; padding: 2rem; background: #f5f5f5; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
        .icon-item { background: white; padding: 1rem; border-radius: 8px; text-align: center; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>iNurseApp Icons Preview</h1>
    <div class="icon-grid">
        <div class="icon-item">
            <img src="assets/icons/icon-72x72.png">
            <p>72x72</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-96x96.png">
            <p>96x96</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-128x128.png">
            <p>128x128</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-144x144.png">
            <p>144x144</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-152x152.png">
            <p>152x152</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-192x192.png">
            <p>192x192</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-384x384.png">
            <p>384x384</p>
        </div>
        <div class="icon-item">
            <img src="assets/icons/icon-512x512.png">
            <p>512x512</p>
        </div>
    </div>
</body>
</html>
```

Salve como `icon-preview.html` e abra no navegador.

---

**Recomendação:** Use o **MÉTODO 1 (PWA Builder)** - é o mais rápido e confiável! 🚀
