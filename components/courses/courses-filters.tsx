'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type CourseCategory, type CourseLevel, CourseStatus } from '@/lib/types'

const categories: CourseCategory[] = [
  'sedimentación',
  'filtración',
  'almacenamiento seguro',
  'desinfección',
]

const levelLabels: Record<CourseLevel, string> = {
  INICIAL: 'Inicial',
  MEDIO: 'Medio',
  AVANZADO: 'Avanzado',
}

export function CoursesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Leer valores actuales de searchParams para controlar los Select
  const currentStatus = searchParams.get('status') || CourseStatus.ACTIVO
  const currentCategory = searchParams.get('category') || 'all'
  const currentLevel = searchParams.get('level') || 'all'

  // Sincronizar searchValue con searchParams cuando cambian externamente (ej: limpiar filtros)
  useEffect(() => {
    const searchParam = searchParams.get('search') || ''
    setSearchValue(prev => {
      // Solo actualizar si realmente cambió para evitar re-renders innecesarios
      return prev !== searchParam ? searchParam : prev
    })
  }, [
    searchParams,
  ])

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    startTransition(() => {
      router.push(`/dashboard/courses?${params.toString()}`)
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)

    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Crear un nuevo timer para el debounce (500ms)
    debounceTimerRef.current = setTimeout(() => {
      updateSearchParams('search', value || null)
    }, 500)
  }

  // Limpiar el timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const clearFilters = () => {
    startTransition(() => {
      router.push('/dashboard/courses?status=ACTIVO')
    })
  }

  const hasActiveFilters =
    searchValue ||
    (currentCategory && currentCategory !== 'all') ||
    (currentLevel && currentLevel !== 'all') ||
    currentStatus !== CourseStatus.ACTIVO

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Buscar por título del curso..."
          type="search"
          value={searchValue}
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <Select
          key="status-filter"
          onValueChange={value => updateSearchParams('status', value)}
          value={currentStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CourseStatus.ACTIVO}>Activo</SelectItem>
            <SelectItem value={CourseStatus.INACTIVO}>Inactivo</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          key="category-filter"
          onValueChange={value => updateSearchParams('category', value === 'all' ? null : value)}
          value={currentCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select
          key="level-filter"
          onValueChange={value => updateSearchParams('level', value === 'all' ? null : value)}
          value={currentLevel}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            {Object.entries(levelLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button disabled={isPending} onClick={clearFilters} size="sm" variant="outline">
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
