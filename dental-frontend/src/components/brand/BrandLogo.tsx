import Image from 'next/image'
import { BRAND_LOGO_PATH } from '@/src/lib/constants/brand'

type BrandLogoSize = 'sm' | 'md' | 'lg'

interface BrandLogoProps {
  size?: BrandLogoSize
  className?: string
  imageClassName?: string
  priority?: boolean
}

const dimensions: Record<BrandLogoSize, { width: number; height: number }> = {
  sm: { width: 82, height: 62 },
  md: { width: 116, height: 87 },
  lg: { width: 152, height: 114 },
}

export function BrandLogo({ size = 'md', className = '', imageClassName = '', priority = false }: BrandLogoProps) {
  const { width, height } = dimensions[size]

  return (
    <span className={`brand-logo brand-logo--${size} ${className}`.trim()}>
      <Image
        src={BRAND_LOGO_PATH}
        alt="Dr.Maris"
        width={width}
        height={height}
        priority={priority}
        className={`brand-logo__image ${imageClassName}`.trim()}
      />
    </span>
  )
}
