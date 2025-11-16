import parse from 'html-react-parser'
import type { ModuleWithRelations } from '@/lib/types'

type ModuleContentTabProps = {
  module: ModuleWithRelations
}

export function ModuleContentTab({ module }: ModuleContentTabProps) {
  return (
    <div className="space-y-6">
      {module.content ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">{parse(module.content)}</div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
          <p className="text-muted-foreground">No hay contenido disponible para este módulo</p>
        </div>
      )}
    </div>
  )
}
