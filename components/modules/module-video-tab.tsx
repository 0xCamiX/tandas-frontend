'use client'

import { Clock, PlayCircle, Video as VideoIcon } from 'lucide-react'
import { useState } from 'react'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'
import type { ModuleWithRelations } from '@/lib/types'

type ModuleVideoTabProps = {
  module: ModuleWithRelations
}

export function ModuleVideoTab({ module }: ModuleVideoTabProps) {
  const [hasError, setHasError] = useState(false)

  if (!module.videoUrl) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-muted/50 border border-dashed">
        <VideoIcon className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground font-medium">
          No hay video disponible para este módulo
        </p>
        <p className="text-sm text-muted-foreground mt-1">El video se agregará próximamente</p>
      </div>
    )
  }

  const handleError = () => {
    setHasError(true)
    toast.error('Error al cargar el video', {
      description: 'No se pudo cargar el video. Verifica la URL o intenta más tarde.',
    })
  }

  if (hasError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-muted/50 border border-dashed">
        <VideoIcon className="h-12 w-12 text-destructive mb-3" />
        <p className="text-destructive font-medium">Error al cargar el video</p>
        <p className="text-sm text-muted-foreground mt-1">
          Por favor, verifica la URL del video o intenta recargando la página
        </p>
      </div>
    )
  }

  // Normalizar URL para archivos locales
  const videoUrl =
    module.videoUrl.startsWith('http') || module.videoUrl.startsWith('/')
      ? module.videoUrl
      : `/${module.videoUrl}`

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <ReactPlayer controls height="100%" onError={handleError} src={videoUrl} width="100%" />
      </div>

      {/* Video Info */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Detalles del video</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <PlayCircle className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{module.title}</p>
              <p className="text-xs text-muted-foreground">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
                  ? 'Video de YouTube'
                  : videoUrl.includes('vimeo.com')
                    ? 'Video de Vimeo'
                    : 'Video del módulo'}
              </p>
            </div>
          </div>
          {module.duration && (
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Duración estimada</p>
                <p className="text-xs text-muted-foreground">{module.duration} minutos</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
