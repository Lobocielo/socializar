# Socializar - App de Citas y Chat 💕

Una plataforma completa para conocer gente nueva, con IA integrada y sistema de monetización.

## 🚀 Características Principales

### 👤 Perfiles
- Creación de perfil con nombre, edad, bio, intereses y fotos
- Autenticación con Google
- Análisis de personalidad con IA
- Badge Premium

### 💕 Matching Inteligente
- Sistema de swipe (like/nope)
- Score de compatibilidad basado en IA
- Matching por intereses y personalidad
- Geolocalización para encontrar gente cercana

### 💬 Chat en Tiempo Real
- Mensajería instantánea
- Indicador de lectura
- **Botón "Ayudame a responder"** - IA sugiere respuestas
- Sugerencias de apertura

### 🤖 IA Integrada
- Análisis de personalidad (tímido, directo, divertido, etc.)
- Sugerencias de conversación
- Score de compatibilidad
- Respuestas inteligentes en el chat

### 💰 Monetización
- Google AdSense / Adsterra banners
- Ubicaciones: arriba del chat, entre perfiles, sidebar
- Premium sin anuncios
- Boost de perfil
- Más matches

### ⭐ Premium Features
- Likes ilimitados
- Sin anuncios
- Boosts mensuales
- Chat con IA
- Modo incógnito
- Prioridad en búsqueda

## 🛠️ Tecnologías

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **IA:** OpenAI API
- **State:** Zustand
- **Animaciones:** Framer Motion
- **Rutas:** React Router

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/socializar.git

# Instalar dependencias
cd socializar
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración

### Firebase
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication > Google
3. Crear Firestore Database
4. Habilitar Storage
5. Copiar configuración a `src/services/firebase.ts`

### OpenAI (para IA)
1. Crear cuenta en [OpenAI](https://openai.com/)
2. Obtener API key
3. Agregar a `src/services/ai.ts`

### Google AdSense
1. Crear cuenta en [AdSense](https://www.google.com/adsense/)
2. Obtener publisher ID
3. Actualizar en `src/services/ads.ts`

### Google Maps (opcional)
1. Habilitar Geolocation API en Google Cloud
2. Agregar API key para reverse geocoding

## 📁 Estructura

```
src/
├── components/
│   ├── ads/           # Componentes de anuncios
│   ├── ai/            # Componentes de IA
│   ├── chat/          # Componentes de chat
│   ├── match/         # Componentes de matching
│   ├── premium/       # Componentes premium
│   ├── profile/       # Componentes de perfil
│   └── ui/            # Componentes genéricos
├── context/           # Context de React
├── pages/             # Páginas principales
├── services/          # Servicios (Firebase, IA, etc.)
├── store/             # Estado global (Zustand)
├── types/             # TypeScript types
└── utils/             # Utilidades
```

## 🎨 Personalización

### Colores
Editar `tailwind.config.js` para cambiar colores principales:
```js
colors: {
  primary: { /* rosa */ },
  secondary: { /* morado */ }
}
```

### Planes Premium
Editar `src/services/ads.ts` para modificar planes y precios.

### Intereses
Editar `INTERESTS` en `ProfileSetupPage.tsx` para personalizar intereses disponibles.

## 🚀 Despliegue

```bash
# Build para producción
npm run build

# El build estará en la carpeta 'dist/'
```

## 📱 Mobile First

La app está optimizada para dispositivos móviles con:
- Diseño responsive
- Gestos táctiles (swipe)
- PWA-ready

## 🔒 Seguridad

- Autenticación segura con Google
- Reglas de Firestore configuradas
- Rate limiting en APIs
- Reportes de usuarios

## 📈 Analytics

Integrado con:
- Google Analytics
- Firebase Analytics
- Eventos personalizados

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-feature`)
3. Commit (`git commit -m 'Add nueva feature'`)
4. Push (`git push origin feature/nueva-feature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles

---

Hecho con 💕 para conectar personas
