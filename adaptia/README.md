# adaptIA - Plataforma Pedagógica Adaptativa con Inteligencia Artificial

Plataforma educativa con IA para profesores y estudiantes que adapta automáticamente unidades didácticas y recursos a los 4 estilos de aprendizaje del modelo VARK (**Visual**, **Auditivo**, **Kinestésico** y **Lectoescritura**).

---

## 🚀 Requisitos Previos

- **Node.js**: Versión 18 o superior (se recomienda Node 20 LTS o Node 22).
- **npm** o **pnpm** o **yarn**.
- Una clave de API de **Google Gemini** ([Google AI Studio](https://aistudio.google.com/)).

---

## 📦 Instalación y Ejecución Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
   ```env
   GEMINI_API_KEY=tu_clave_de_gemini_aqui
   PORT=3000
   ```

3. **Modo Desarrollo**:
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000`.

4. **Modo Producción (Build & Start)**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Opciones de Despliegue en Internet

### Opción 1: Render (Recomendada - Fullstack Node/Express)
1. Crea una cuenta gratuita en [render.com](https://render.com).
2. Haz clic en **New +** -> **Web Service**.
3. Conecta tu repositorio de GitHub (o sube tu código).
4. Configura los siguientes campos:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. En **Environment Variables**, añade:
   - `GEMINI_API_KEY`: tu clave de Google Gemini.
   - `NODE_ENV`: `production`
6. Haz clic en **Deploy Web Service**.

---

### Opción 2: Railway
1. Regístrate en [railway.app](https://railway.app).
2. Haz clic en **New Project** -> **Deploy from GitHub repo**.
3. Railway detectará automáticamente el proyecto Node.js.
4. En la pestaña **Variables**, añade `GEMINI_API_KEY`.
5. En la configuración de red (Settings), genera un dominio público.

---

### Opción 3: Despliegue con Docker / Cloud Run / VPS
El proyecto incluye un `Dockerfile` optimizado multicapa:

```bash
# Construir la imagen
docker build -t adaptia-app .

# Ejecutar el contenedor
docker run -p 3000:3000 -e GEMINI_API_KEY="tu_api_key" adaptia-app
```

---

### Opción 4: Vercel / Netlify
Para plataformas Serverless:
- Puedes desplegar el build estático del frontend con `npm run build` apuntando al directorio `dist`.
- Si deseas usar los endpoints de IA, las peticiones `/api/*` pueden ejecutarse usando el servidor Node en Render/Railway o mediante Vercel Serverless Functions.

---

## 🗂️ Estructura del Proyecto

```
├── firebase-applet-config.json  # Configuración de Firebase Firestore
├── firestore.rules              # Reglas de seguridad de base de datos
├── index.html                   # Entry point HTML con tipografía y metadatos
├── package.json                 # Scripts y dependencias
├── server.ts                    # Servidor Express con endpoints de IA Gemini
├── src/
│   ├── components/              # Componentes de Docente, Alumno y Comunes
│   │   ├── common/              # Navbar, modales, etc.
│   │   ├── student/             # Aula de Alumno, Test VARK, Diagnóstico
│   │   └── teacher/             # Dashboard Docente, Generador IA, Cajita de Cambios
│   ├── context/AppContext.tsx   # Estado global y sincronización con Firestore
│   ├── data/                    # Modelos VARK, preguntas diagnósticas y semillas
│   ├── lib/firebase.ts          # Conector e inicialización de Firebase
│   ├── services/geminiService.ts# Cliente frontend para APIs de Gemini
│   └── types.ts                 # Tipos TypeScript del dominio educativo
└── vite.config.ts               # Configuración de Vite y Tailwind CSS
```

---

## 🔒 Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `GEMINI_API_KEY` | Clave de API de Google Gemini para generación pedagógica y Tutor IA | Sí |
| `PORT` | Puerto de escucha del servidor (por defecto `3000`) | Opcional |
| `NODE_ENV` | `production` o `development` | Opcional |
