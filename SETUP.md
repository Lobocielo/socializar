# 🚀 Guía de Configuración Completa

## 1. CREAR CUENTA EN TURSO (Database)

1. Ir a https://turso.tech/
2. Crear cuenta gratuita
3. Instalar CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
4. Login:
   ```bash
   turso auth login
   ```
5. Crear database:
   ```bash
   turso db create socializar-db
   ```
6. Obtener URL:
   ```bash
   turso db show socializar-db --url
   ```
7. Obtener token:
   ```bash
   turso db tokens create socializar-db
   ```

## 2. CREAR CUENTA EN FIREBASE

1. Ir a https://console.firebase.google.com/
2. Crear nuevo proyecto "socializar-app"
3. Habilitar Authentication > Google
4. Crear Firestore Database (modo production)
5. Habilitar Storage
6. Ir a Project Settings > General > Web app
7. Copiar la configuración

## 3. CREAR CUENTA EN OPENAI (para IA)

1. Ir a https://platform.openai.com/
2. Crear cuenta
3. Ir a API Keys > Create new secret key
4. Copiar la key

## 4. CREAR CUENTA EN GOOGLE ADSENSE

1. Ir a https://www.google.com/adsense/
2. Crear cuenta
3. Obtener Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)

## 5. CONFIGURAR VARIABLES DE ENTorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Firebase
VITE_FIREBASE_API_KEY=tu_api_key_de_firebase
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Turso Database
VITE_TURSO_DATABASE_URL=libsql://socializar-db-tu-usuario.turso.io
VITE_TURSO_AUTH_TOKEN=tu_token_de_turso

# OpenAI (para IA)
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Google AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

## 6. SUBIR A GITHUB

1. Ir a https://github.com/new
2. Nombre: "socializar"
3. No inicializar con README
4. Crear repositorio
5. Ejecutar comandos:

```bash
cd C:\Users\ZT\Desktop\Proyetos\Socializar
git remote add origin https://github.com/TU_USUARIO/socializar.git
git branch -M main
git push -u origin main
```

## 7. DESPLEGAR EN VERCEL

1. Ir a https://vercel.com/new
2. Importar repositorio GitHub "socializar"
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Agregar variables de entorno (las mismas del .env)
7. Deploy

## 8. CONFIGURAR TURSO CON VERCEL

En Vercel > Project > Settings > Environment Variables:
- `VITE_TURSO_DATABASE_URL` = tu URL de Turso
- `VITE_TURSO_AUTH_TOKEN` = tu token de Turso

## 9. CONFIGURAR FIREBASE AUTH

En Firebase Console:
1. Authentication > Settings > Authorized domains
2. Agregar tu dominio de Vercel (ej: socializar.vercel.app)

## 10. VERIFICAR

1. Abrir https://socializar.vercel.app
2. Login con Google
3. Crear perfil
4. ¡Probar la app!

---

## ⚠️ IMPORTANTE

- Nunca subir archivos `.env` a GitHub
- Las API keys van en Vercel, no en el código
- Turso tiene plan gratuito de 500MB y 9GB de bandwidth
- Firebase tiene plan gratuito generoso
- OpenAI tiene $5 de crédito gratis al crear cuenta

---

## 🆘 Si tenés problemas

1. Verificar que todas las variables de entorno estén configuradas
2. Revisar la consola del navegador (F12)
3. Verificar los logs de Vercel
4. Asegurarse que Firebase Auth está habilitado
