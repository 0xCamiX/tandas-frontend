'use client'

import { PlayCircle } from 'lucide-react'
import type { ModuleWithRelations } from '@/lib/types'

type ModuleVideoTabProps = {
  module: ModuleWithRelations
}

export function ModuleVideoTab({ module }: ModuleVideoTabProps) {
  if (!module.videoUrl) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">No hay video disponible para este módulo</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video className="h-full w-full" controls src={module.videoUrl}>
          <track default kind="captions" label="Subtítulos" src="/captions/es.vtt" srcLang="es" />
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>

      {/* Video Segments Placeholder - Por ahora solo mostramos el video */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Progreso del video</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <PlayCircle className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{module.title}</p>
              <p className="text-xs text-muted-foreground">Video completo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
