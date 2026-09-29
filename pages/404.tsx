import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import Seo from "@/components/Seo"
import styles from "@/styles/Empty.module.css"

export default function NotFound() {
  return (
    <>
      <Seo title="Not found" noindex />
      <div className={`shell ${styles.empty}`} style={{ minHeight: "60vh", justifyContent: "center" }}>
        <p className="kicker">404</p>
        <h1 className="display">Lost in the reel.</h1>
        <p>This page was cut in the edit, or never made it to screen.</p>
        <Link href="/browse" className="btn btn-primary">
          Back to Discover <IconArrowRight size={16} />
        </Link>
      </div>
    </>
  )
}
