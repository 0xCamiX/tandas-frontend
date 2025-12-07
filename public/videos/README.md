# 📹 Guía de Videos para TANDAS

## 🎥 Soporte de YouTube (Recomendado)

**¡NUEVO!** El sistema ahora soporta videos de YouTube, que es la opción **recomendada** para:
- ✅ Mejor rendimiento y velocidad de carga
- ✅ Streaming adaptativo automático
- ✅ Menor uso de ancho de banda
- ✅ No requiere espacio en el servidor
- ✅ Subtítulos automáticos de YouTube
- ✅ Controles nativos de YouTube

### Cómo Usar Videos de YouTube

Simplemente proporciona la URL de YouTube en el campo `videoUrl` del módulo:

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Formatos de URL soportados:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Solo el ID: `dQw4w9WgXcQ`

## 📂 Videos Locales (Alternativa)

Si prefieres alojar videos localmente, los videos deben organizarse en esta carpeta siguiendo esta estructura:

```
public/
└── videos/
    ├── desinfeccion/
    │   ├── hervido-agua-segura.mp4
    │   ├── cloracion-basica.mp4
    │   └── ...
    ├── sedimentacion/
    │   ├── intro-sedimentacion.mp4
    │   └── ...
    ├── filtracion/
    │   └── ...
    └── almacenamiento-seguro/
        └── ...
```

## Formatos Soportados

- **MP4** (H.264) - Recomendado para mejor compatibilidad
- **WebM** - Alternativa para navegadores modernos
- **OGG** - Soporte para navegadores antiguos

## URLs en el Backend

El backend debe retornar las URLs de video en uno de estos formatos:

### ✅ Opción 1: YouTube (🌟 Recomendado)

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

O cualquiera de estos formatos:
```json
{
  "videoUrl": "https://youtu.be/dQw4w9WgXcQ"
}
```

```json
{
  "videoUrl": "dQw4w9WgXcQ"
}
```

### ✅ Opción 2: Ruta Relativa (Para videos locales)

```json
{
  "videoUrl": "videos/desinfeccion/hervido-agua-segura.mp4"
}
```

El frontend automáticamente agregará `/` al inicio: `/videos/desinfeccion/hervido-agua-segura.mp4`

### ✅ Opción 3: Ruta Absoluta desde la Raíz

```json
{
  "videoUrl": "/videos/desinfeccion/hervido-agua-segura.mp4"
}
```

### ✅ Opción 4: URL Externa Completa

```json
{
  "videoUrl": "https://cdn.ejemplo.com/videos/curso.mp4"
}
```

## ❌ Rutas Incorrectas

**NO uses rutas que incluyan la ruta de la página:**

```json
// ❌ INCORRECTO
{
  "videoUrl": "/dashboard/courses/[id]/videos/curso.mp4"
}

// ❌ INCORRECTO
{
  "videoUrl": "dashboard/courses/[id]/videos/curso.mp4"
}
```

## Ejemplos de Módulos

### Ejemplo 1: Con YouTube (Recomendado)

```json
{
  "id": "90961cd6-86c5-45ef-a05c-189ec094e642",
  "title": "Hervido de agua segura",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "content": "<h2>Introducción al hervido...</h2>",
  "duration": 15
}
```

### Ejemplo 2: Con Video Local

```json
{
  "id": "90961cd6-86c5-45ef-a05c-189ec094e642",
  "title": "Hervido de agua segura",
  "videoUrl": "videos/desinfeccion/hervido-agua-segura.mp4",
  "content": "<h2>Introducción al hervido...</h2>",
  "duration": 15
}
```

## Tamaño Recomendado

- **Resolución:** 1280x720 (720p) o 1920x1080 (1080p)
- **Bitrate:** 2-5 Mbps para 720p, 5-8 Mbps para 1080p
- **Duración:** Máximo 15-20 minutos por video

## Compresión de Videos

Para reducir el tamaño de los videos, puedes usar:

### FFmpeg (Línea de Comandos)

```bash
# Comprimir video a 720p con buena calidad
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### HandBrake (GUI)

1. Abre HandBrake
2. Selecciona el video original
3. Preset: "Fast 720p30"
4. Guarda el archivo comprimido

## 🎬 Recomendaciones

### Para Producción
1. **Usa YouTube** para todos los videos principales
2. **Sube a YouTube** como "No listado" si no quieres que aparezcan en búsquedas
3. **Organiza** en una playlist de YouTube para mejor gestión

### Para Desarrollo/Testing
1. Puedes usar videos locales temporalmente
2. Reemplázalos por YouTube antes de producción

## Solución de Problemas

### El video de YouTube no se carga

1. **Verifica la URL:**
   - Copia la URL directamente desde YouTube
   - Asegúrate de que el video sea público o "No listado"
   - Los videos privados NO funcionarán

2. **Verifica el ID:**
   - El ID de YouTube tiene exactamente 11 caracteres
   - Ejemplo: `dQw4w9WgXcQ`

### El video local no se reproduce

1. **Verifica la ruta:**
   - El archivo debe estar en `public/videos/...`
   - La URL en el backend debe ser: `videos/categoria/nombre.mp4`

2. **Verifica el formato:**
   - Usa MP4 (H.264) para mejor compatibilidad
   - Evita codecs propietarios

3. **Verifica el tamaño:**
   - Videos muy grandes (>100MB) pueden tardar en cargar
   - Considera comprimir el video o usar YouTube

### Error 404

Si ves `GET /videos/... 404`:

1. Verifica que el archivo exista en `public/videos/...`
2. Reinicia el servidor de desarrollo (`bun dev`)
3. Verifica que el nombre del archivo coincida exactamente (sensible a mayúsculas)

## Subtítulos

### Videos de YouTube
Los subtítulos de YouTube se manejan automáticamente. Puedes:
1. Subir subtítulos en YouTube Studio
2. YouTube puede generar subtítulos automáticos
3. Los usuarios pueden activar/desactivar subtítulos en el player

### Videos Locales
Los subtítulos para videos locales están en desarrollo.

## Notas Importantes

- Los archivos en `public/` son servidos directamente por Next.js desde la raíz `/`
- NO necesitas agregar `public/` en las URLs
- Los videos grandes pueden afectar el tiempo de build en producción
- Considera usar un CDN para videos en producción

