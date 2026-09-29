import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState, type ReactNode } from "react"
import Header, { Wordmark } from "./Header"
import styles from "@/styles/Layout.module.css"

function RouteProgress() {
  const router = useRouter()
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")

  useEffect(() => {
    let timer: number | undefined
    const start = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return
      window.clearTimeout(timer)
      setState("loading")
    }
    const done = () => {
      setState("done")
      timer = window.setTimeout(() => setState("idle"), 400)
    }
    router.events.on("routeChangeStart", start)
    router.events.on("routeChangeComplete", done)
    router.events.on("routeChangeError", done)
    return () => {
      window.clearTimeout(timer)
      router.events.off("routeChangeStart", start)
      router.events.off("routeChangeComplete", done)
      router.events.off("routeChangeError", done)
    }
  }, [router.events])

  return <div className={styles.progress} data-state={state} aria-hidden />
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.footInner}`}>
        <div className={styles.footBrand}>
          <Wordmark />
          <p>Trailers, ratings and hand-picked collections. No account needed.</p>
        </div>

        <nav className={styles.footNav} aria-label="Footer">
          <Link href="/browse">Discover</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/watchlist">My List</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className={styles.footMeta}>
          <p>
            Film data and images from{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p>
            Built by{" "}
            <a href="https://bamgbosechristian.me" target="_blank" rel="noopener noreferrer">
              Bamgbose Christian
            </a>{" "}
            ·{" "}
            <a href="https://github.com/C-J7/hotflix" target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ children, overlayHeader = false }: { children: ReactNode; overlayHeader?: boolean }) {
  const router = useRouter()
  return (
    <>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <RouteProgress />
      <Header overlay={overlayHeader} />
      {/* Keyed by path (not query) so each page fades in, while in-page filters don't remount. */}
      <main id="main" key={router.asPath.split(/[?#]/)[0]} className={styles.main} data-overlay={overlayHeader}>
        {children}
      </main>
      <Footer />
    </>
  )
}
