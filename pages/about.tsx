import Image from "next/image"
import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"
import PageHeader from "@/components/PageHeader"
import Seo from "@/components/Seo"
import styles from "@/styles/About.module.css"

const FEATURES = [
  ["Tonight's Pick", "A rotating editorial feature drawn from the week's most-watched films."],
  ["Top 10 today", "The day's ranking, refreshed hourly from TMDB trending data."],
  ["Collections", "Eighteen genre collections with popular, top-rated and newest views."],
  ["Trailers", "Official trailers in a focused player, fetched only when you press play."],
  ["My List", "A watchlist that lives on your device. No account, no tracking."],
  ["Search", "Instant search from anywhere on the site. Press / to start."],
]

const STACK = ["Next.js 16", "React 19", "TypeScript", "CSS Modules", "TMDB API", "Vercel"]

export default function About() {
  return (
    <>
      <Seo title="About" description="Hotflix is a film discovery app built by Bamgbose Christian with Next.js and the TMDB API." />
      <PageHeader
        kicker="About"
        title={
          <>
            A film magazine you can <em>play</em>.
          </>
        }
        lede="Hotflix is a discovery app for people who spend longer choosing a film than watching one. It pairs editorial curation with live data, so there's always something worth pressing play on."
      />

      <div className={`shell ${styles.body}`}>
        <section className={styles.section} aria-labelledby="features">
          <h2 id="features" className={styles.heading}>
            What&apos;s inside
          </h2>
          <dl className={styles.features}>
            {FEATURES.map(([name, detail]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="built">
          <h2 id="built" className={styles.heading}>
            How it&apos;s built
          </h2>
          <p className={styles.prose}>
            Pages are prerendered on the server and refreshed in the background, so content appears instantly and is
            fully indexable. TMDB requests go through server-side routes, keeping the API key out of the browser and
            letting the CDN cache responses. Motion is restrained and switches off for anyone who prefers reduced
            motion.
          </p>
          <ul className={styles.stack}>
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className={`${styles.section} ${styles.author}`} aria-labelledby="author">
          <div className={styles.portrait}>
            <Image src="/-J7profile.png" alt="Bamgbose Christian" fill sizes="120px" />
          </div>
          <div>
            <h2 id="author" className={styles.heading}>
              Made by Bamgbose Christian
            </h2>
            <p className={styles.prose}>
              Software engineer and technical lead based in Lagos, building backend systems for fintech and health-tech,
              with a soft spot for good interfaces and better films.
            </p>
            <p className={styles.links}>
              <a href="https://bamgbosechristian.me" target="_blank" rel="noopener noreferrer">
                Portfolio <IconArrowUpRight size={14} />
              </a>
              <a href="https://github.com/C-J7/hotflix" target="_blank" rel="noopener noreferrer">
                Source code <IconArrowUpRight size={14} />
              </a>
            </p>
          </div>
        </section>

        <p className={styles.credit}>
          Film data and images are provided by{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
            The Movie Database
          </a>
          . This product uses the TMDB API but is not endorsed or certified by TMDB. Trailers are embedded from
          YouTube. <Link href="/browse">Start browsing →</Link>
        </p>
      </div>
    </>
  )
}
