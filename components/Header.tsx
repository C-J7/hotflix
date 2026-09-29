import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState, useSyncExternalStore } from "react"
import { IconMenu2, IconSearch, IconX } from "@tabler/icons-react"
import Dialog from "./Dialog"
import SearchDialog from "./SearchDialog"
import { useHydrated, useWatchlist } from "@/hooks/useWatchlist"
import styles from "@/styles/Header.module.css"

const NAV = [
  { href: "/browse", label: "Discover" },
  { href: "/collections", label: "Collections" },
  { href: "/watchlist", label: "My List" },
]

export function Wordmark() {
  return (
    <span className={styles.wordmark}>
      Hotflix<span className={styles.dot}>.</span>
    </span>
  )
}

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}

export default function Header({ overlay = false }: { overlay?: boolean }) {
  const router = useRouter()
  // A boolean snapshot, so React only re-renders when crossing the threshold, not on every scroll event.
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 12, () => false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { list } = useWatchlist()
  const hydrated = useHydrated()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(`${href}/`)
  const count = hydrated ? list.length : 0

  return (
    <>
      <header className={styles.header} data-solid={!overlay || scrolled}>
        <div className={`shell ${styles.inner}`}>
          <Link href="/" className={styles.brand} aria-label="Hotflix home">
            <Wordmark />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink} aria-current={isActive(href) ? "page" : undefined}>
                {label}
                {href === "/watchlist" && count > 0 && <span className={styles.count}>{count}</span>}
              </Link>
            ))}
          </nav>

          <div className={styles.tools}>
            <button className={styles.search} onClick={() => setSearchOpen(true)} aria-label="Search films">
              <IconSearch size={17} stroke={1.8} />
              <span className={styles.searchLabel}>Search films</span>
              <kbd className={styles.kbd}>/</kbd>
            </button>
            <button className={`icon-btn ${styles.menuBtn}`} onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <IconMenu2 size={21} stroke={1.7} />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}

      {menuOpen && (
        <Dialog label="Menu" variant="sheet" onClose={() => setMenuOpen(false)} panelClassName={styles.sheet}>
          {(close) => (
            <>
              <div className={styles.sheetTop}>
                <Wordmark />
                <button className="icon-btn" onClick={close} aria-label="Close menu">
                  <IconX size={22} stroke={1.7} />
                </button>
              </div>
              <nav className={styles.sheetNav} aria-label="Mobile">
                {[...NAV, { href: "/about", label: "About" }].map(({ href, label }, i) => (
                  <Link
                    key={href}
                    href={href}
                    className={styles.sheetLink}
                    style={{ "--i": i } as React.CSSProperties}
                    aria-current={isActive(href) ? "page" : undefined}
                    onClick={close}
                  >
                    {label}
                    {href === "/watchlist" && count > 0 && <span className={styles.count}>{count}</span>}
                  </Link>
                ))}
              </nav>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  close()
                  setSearchOpen(true)
                }}
              >
                <IconSearch size={17} /> Search films
              </button>
            </>
          )}
        </Dialog>
      )}
    </>
  )
}
