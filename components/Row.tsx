import Link from "next/link"
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import styles from "@/styles/Row.module.css"

type Props = {
  title: string
  kicker?: string
  href?: string
  variant: "poster" | "backdrop" | "ranked" | "cast"
  children: ReactNode
}

export default function Row({ title, kicker, href, variant, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ prev: false, next: false })

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const prev = el.scrollLeft > 4
    const next = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    setEdges((e) => (e.prev === prev && e.next === next ? e : { prev, next }))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    const section = sectionRef.current
    if (!el || !section) return

    const resize = new ResizeObserver(measure)
    resize.observe(el)

    // Rows render visible (for crawlers and no-JS). Only rows that start below the fold are hidden,
    // then revealed on scroll; writing data attributes avoids re-renders.
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.dataset.visible = "true"
          reveal.disconnect()
        } else {
          section.dataset.animate = "true"
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    reveal.observe(section)

    return () => {
      resize.disconnect()
      reveal.disconnect()
    }
  }, [measure])

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" })
  }

  const items = Children.toArray(children)
  if (items.length === 0) return null

  return (
    <section ref={sectionRef} className={styles.row} data-variant={variant} aria-label={title}>
      <header className={`shell ${styles.head}`}>
        <div className={styles.titles}>
          {kicker && <p className="kicker">{kicker}</p>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.controls}>
          {href && (
            <Link href={href} className={styles.seeAll}>
              See all <IconArrowRight size={15} />
            </Link>
          )}
          <button className={styles.arrow} onClick={() => scroll(-1)} disabled={!edges.prev} aria-label={`Scroll ${title} back`}>
            <IconChevronLeft size={18} />
          </button>
          <button className={styles.arrow} onClick={() => scroll(1)} disabled={!edges.next} aria-label={`Scroll ${title} forward`}>
            <IconChevronRight size={18} />
          </button>
        </div>
      </header>

      <ul ref={trackRef} className={styles.track} onScroll={measure} data-prev={edges.prev} data-next={edges.next}>
        {items.map((child, i) => (
          <li key={i} className={styles.item} style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
            {child}
          </li>
        ))}
      </ul>
    </section>
  )
}
