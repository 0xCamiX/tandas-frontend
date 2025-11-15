import { GlassWaterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps {
  width?: string
  height?: string
  className?: string
}

export default function Icon({ width, height, className }: IconProps) {
  return (
    <div className="flex items-center gap-2">
      <GlassWaterIcon
        className={cn('w-4 h-4', width && `w-[${width}]`, height && `h-[${height}]`, className)}
      />
    </div>
  )
}
