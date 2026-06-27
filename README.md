# Web Cliente — Madam Tusan

Frontend React (Vite) para el sistema de pedidos.

## 1. Configurar la API

Edita `src/config.js` y pega tu Invoke URL de API Gateway:

```js
export const API_URL = "https://TU-URL.execute-api.us-east-1.amazonaws.com/dev";
```

## 2. Probar localmente

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "web cliente madam tusan"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/web-cliente.git
git push -u origin main
```

## 4. Desplegar en AWS Amplify

1. Consola AWS → Amplify → "Create new app" → "Host web app"
2. Elige GitHub, autoriza, selecciona el repo `web-cliente` y la rama `main`
3. Amplify detecta Vite automáticamente (o usa el `amplify.yml` incluido)
4. "Save and deploy"
5. Al terminar te da una URL pública tipo `https://main.xxxx.amplifyapp.com`

## Nota Academy

Si Amplify falla por permisos en AWS Academy, usa el plan B:
`npm run build` y sube la carpeta `dist/` a un bucket S3 con hosting estático activado.
