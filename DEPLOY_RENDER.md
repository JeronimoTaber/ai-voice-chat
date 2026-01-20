# Deploy en Render - Guía Paso a Paso

## Requisitos Previos
- Cuenta en [Render](https://render.com) (gratis)
- Tu código en GitHub (repositorio público o privado)

## Pasos para Deployar

### 1. Preparar tu Repositorio
```bash
git add .
git commit -m "Preparar para deploy en Render"
git push origin main
```

### 2. Crear Servicio en Render

1. **Ve a [Render Dashboard](https://dashboard.render.com)**
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona tu repositorio

### 3. Configuración del Servicio

**Configuración básica:**
- **Name**: `ai-voice-chat` (o el nombre que prefieras)
- **Runtime**: `Node`
- **Branch**: `main` (o tu rama principal)
- **Build Command**: `npm install && npm run build:all`
- **Start Command**: `npm start`
- **Plan**: Selecciona **Free**

### 4. Variables de Entorno

En la sección **Environment Variables**, agrega:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | (tu API key de Google) |
| `FILE_SEARCH_STORE_NAME` | (el nombre de tu file search store) |
| `PORT` | `10000` (Render lo asigna automáticamente) |

### 5. Deploy

1. Haz clic en **"Create Web Service"**
2. Render automáticamente:
   - Clonará tu repositorio
   - Instalará dependencias
   - Construirá tu aplicación
   - La desplegará

**El proceso toma ~3-5 minutos**

### 6. Obtener tu URL

Una vez completado, obtendrás una URL como:
```
https://ai-voice-chat-xxxx.onrender.com
```

## Limitaciones del Plan Gratuito

⚠️ **Importante:**
- El servicio se "duerme" después de **15 minutos** de inactividad
- Tarda **~30-50 segundos** en despertar en la primera petición
- 750 horas gratis al mes (suficiente si solo tienes un servicio)

## Auto-Deploy

Render automáticamente re-desplegará tu app cuando hagas push a tu rama principal:
```bash
git add .
git commit -m "Actualización"
git push origin main
# Render automáticamente detecta el cambio y redeploya
```

## Monitoreo

En el Dashboard de Render puedes ver:
- ✅ Logs en tiempo real
- ✅ Estado del servicio
- ✅ Métricas de uso
- ✅ Historial de deploys

## Solución de Problemas

### Error en Build
- Revisa los logs en Render
- Asegúrate de que `build:all` funcione localmente:
  ```bash
  npm run build:all
  ```

### El servicio no inicia
- Verifica que las variables de entorno estén configuradas
- Revisa los logs para errores específicos

### Primera carga muy lenta
- Es normal en el plan gratuito (el servicio estaba dormido)
- Considera el plan pagado ($7/mes) para evitar el "sleep"

## Alternativa: Mantener el Servicio Activo

Puedes usar un servicio como [UptimeRobot](https://uptimerobot.com) (gratis) para hacer ping a tu app cada 5 minutos y evitar que se duerma.

## Costos

- **Plan Free**: $0/mes
  - 750 horas/mes
  - Se duerme después de 15 min
  
- **Plan Starter**: $7/mes
  - Sin límite de horas
  - Sin "sleep"
  - Mejor rendimiento

## Próximos Pasos

Una vez desplegado, puedes:
1. Configurar un dominio personalizado (gratis)
2. Ver analytics y logs
3. Configurar notificaciones de deploy
