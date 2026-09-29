import Image, { type ImageProps } from "next/image"
import { useCallback, useState } from "react"

export default function FadeImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  // Cached images can finish before hydration attaches onLoad, so also check on mount.
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <Image
      {...props}
      ref={ref}
      alt={alt}
      className={`fade-img${className ? ` ${className}` : ""}`}
      data-loaded={loaded}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
    />
  )
}
