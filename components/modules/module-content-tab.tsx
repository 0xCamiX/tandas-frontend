'use client'

import parse from 'html-react-parser'
import { BookOpen } from 'lucide-react'
import type { ModuleWithRelations } from '@/lib/types'

type ModuleContentTabProps = {
  module: ModuleWithRelations
}

export function ModuleContentTab({ module }: ModuleContentTabProps) {
  if (!module.content || module.content.trim() === '') {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-muted/50 border border-dashed">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground font-medium">
          No hay contenido disponible para este módulo
        </p>
        <p className="text-sm text-muted-foreground mt-1">El contenido se agregará próximamente</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-li:text-foreground/90 prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-code:text-foreground prose-pre:bg-muted prose-img:rounded-lg">
        {parse(module.content)}
      </div>
    </div>
  )
}
