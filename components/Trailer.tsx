import Link from "next/link"
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { IconArrowUpRight, IconX } from "@tabler/icons-react"
import Dialog from "./Dialog"
import styles from "@/styles/Trailer.module.css"

type Request = { id: number; title: string; trailerKey?: string | null }
type Status = { state: "loading" } | { state: "ready"; key: string } | { state: "none" } | { state: "error" }

const TrailerContext = createContext<(req: Request) => void>(() => {})

export const useTrailer = () => useContext(TrailerContext)

export function TrailerProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<Request | null>(null)
  const [status, setStatus] = useState<Status>({ state: "loading" })
  const controller = useRef<AbortController | null>(null)

  const open = useCallback((req: Request) => {
    controller.current?.abort()
    setRequest(req)

    if (req.trailerKey !== undefined) {
      setStatus(req.trailerKey ? { state: "ready", key: req.trailerKey } : { state: "none" })
      return
    }

    setStatus({ state: "loading" })
    const ac = new AbortController()
    controller.current = ac
    fetch(`/api/trailer/${req.id}`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { key: string | null }) => setStatus(data.key ? { state: "ready", key: data.key } : { state: "none" }))
      .catch((err: Error) => {
        if (err.name !== "AbortError") setStatus({ state: "error" })
      })
  }, [])

  const close = useCallback(() => {
    controller.current?.abort()
    setRequest(null)
  }, [])

  return (
    <TrailerContext.Provider value={open}>
      {children}
      {request && (
        <Dialog label={`${request.title} trailer`} onClose={close} panelClassName={styles.panel}>
          {(requestClose) => (
            <>
              <div className={styles.bar}>
                <p className={styles.heading}>
                  <span className="kicker">Trailer</span>
                  <span className={styles.title}>{request.title}</span>
                </p>
                <button className="icon-btn" onClick={requestClose} aria-label="Close trailer">
                  <IconX size={20} stroke={1.6} />
                </button>
              </div>

              <div className={styles.frame}>
                {status.state === "loading" && <div className={`skeleton ${styles.fill}`} aria-label="Loading trailer" />}

                {status.state === "ready" && (
                  <iframe
                    className={styles.fill}
                    src={`https://www.youtube-nocookie.com/embed/${status.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={`${request.title} trailer`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                )}

                {(status.state === "none" || status.state === "error") && (
                  <div className={`${styles.fill} ${styles.empty}`}>
                    <p className="display">
                      {status.state === "none" ? "No trailer on file." : "The trailer didn't load."}
                    </p>
                    <p>
                      {status.state === "none"
                        ? "TMDB doesn't list a trailer for this film yet."
                        : "Check your connection and try again in a moment."}
                    </p>
                    <Link href={`/movie/${request.id}`} className="btn btn-ghost" onClick={requestClose}>
                      View film details <IconArrowUpRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </Dialog>
      )}
    </TrailerContext.Provider>
  )
}
