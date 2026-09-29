import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import styles from "@/styles/Dialog.module.css"

type Props = {
  label: string
  onClose: () => void
  children: (requestClose: () => void) => ReactNode
  initialFocus?: RefObject<HTMLElement | null>
  variant?: "center" | "top" | "sheet"
  panelClassName?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea, select, iframe, [tabindex]:not([tabindex="-1"])'

// Mount only while open; the dialog plays its own exit animation before calling onClose.
export default function Dialog({ label, onClose, children, initialFocus, variant = "center", panelClassName }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const requestClose = useCallback(() => setClosing(true), [])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    target?.focus({ preventScroll: true })

    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = "hidden"
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        setClosing(true)
        return
      }
      if (e.key !== "Tab" || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      body.style.overflow = prev.overflow
      body.style.paddingRight = prev.paddingRight
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [initialFocus])

  return (
    <div
      className={styles.overlay}
      data-variant={variant}
      data-closing={closing}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`${styles.panel}${panelClassName ? ` ${panelClassName}` : ""}`}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onCloseRef.current()
        }}
      >
        {children(requestClose)}
      </div>
    </div>
  )
}
