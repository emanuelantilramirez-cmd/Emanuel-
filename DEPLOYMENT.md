# Guía de Despliegue para Producción 🚀

Este documento detalla los pasos sencillos para descargar, ejecutar de manera local y desplegar tu sistema inteligente de inversión en el mundo real.

---

## 📦 1. Cómo Descargar el Código Completo

1. En la parte superior derecha de la pantalla de **Google AI Studio / Build**, abre el menú de configuración (icono de engranaje ⚙️).
2. Haz clic en **Export to ZIP** para descargar todo el código organizado, o en **Export to GitHub** para subirlo directamente a tu cuenta de GitHub.

---

## 💻 2. Ejecutar la Aplicación Localmente

Para instalar y correr la aplicación en tu propia computadora:

### Requisitos Previos:
- Tener instalado **Node.js** (versión 18 o superior). Puedes descargarlo de [nodejs.org](https://nodejs.org/).
- Una terminal (Consola, PowerShell o Git Bash).

### Pasos:
1. Descomprime el archivo descargado y abre tu terminal dentro de la carpeta del proyecto.
2. Crea tu archivo de configuración de variables de entorno:
   - Duplica el archivo `.env.example` y renómbralo como `.env`.
   - Adentro, coloca tu propia clave API de Gemini si deseas expandir opciones con modelos inteligentes:
     ```env
     GEMINI_API_KEY="Tu_Key_Personal_De_Gemini"
     PORT=3000
     ```
3. Instala las dependencias necesarias ejecutando:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo local mediante:
   ```bash
   npm run dev
   ```
5. ¡Listo! Abre tu navegador en la dirección `http://localhost:3000` para operar con la aplicación.

---

## 🐳 3. Despliegue Mediante Contenedores Docker (Recomendado para Producción)

Hemos diseñado un archivo `Dockerfile` optimizado y multi-etapa para que construir la imagen productiva sea ultra liviano y rápido.

### Comando para Construir la Imagen:
```bash
docker build -t trading-ia-app .
```

### Comando para Correr en Servidores Propios:
```bash
docker run -d -p 3000:3000 --env GEMINI_API_KEY="tu_key" trading-ia-app
```

---

## ☁️ 4. Subir la Aplicación a la Nube (Opciones Gratuitas y de Pago)

Al ser una aplicación Full-Stack estructurada con **Soporte de Node.js + Express** (para proteger datos lógicos y hacer peticiones seguras) y **React en Frontend**, tienes excelentes opciones de despliegue:

### Opción A: Google Cloud Run (La opción nativa y más potente)
Ideal ya que esta misma plataforma utiliza Cloud Run internamente.
1. Instala el SDK de Google Cloud (`gcloud CLI`).
2. Ejecuta en tu terminal el comando de auto-detección de compilado y despliegue:
   ```bash
   gcloud run deploy
   ```
3. Selecciona la región preferida y permite accesos públicos no autenticados para que cualquiera pueda ingresar al panel de control desde la web.

### Opción B: Render o Railway (Las más sencillas y visuales)
Son plataformas en la nube donde conectando tu cuenta de GitHub, la app se sube sola en minutos de manera completamente automatizada.
1. Sube tu código a un repositorio privado o público en **GitHub**.
2. Regístrate de forma gratuita en [Render.com](https://render.com) o [Railway.app](https://railway.app).
3. Crea un nuevo **Web Service**.
4. Vincula tu repositorio de GitHub recién creado.
5. Usa los siguientes comandos en la configuración del servicio:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
6. En la sección **Environment Variables / Variables de entorno**, añade tu `GEMINI_API_KEY` (si aplica) y la plataforma te entregará un enlace (`https://tu-app.render.com`) seguro para usar tu aplicación en cualquier celular o computador en tiempo real.
