import Head from "next/head"
import { useRouter } from "next/router"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hotflix-chi.vercel.app"
const DEFAULT_DESCRIPTION =
  "Hotflix is a film discovery app: trending picks, a daily Top 10, curated collections, trailers and a personal watchlist."

type Props = {
  title?: string
  description?: string
  image?: string | null
  noindex?: boolean
}

export default function Seo({ title, description = DEFAULT_DESCRIPTION, image, noindex = false }: Props) {
  const { asPath } = useRouter()
  const fullTitle = title ? `${title} · Hotflix` : "Hotflix · Find something worth watching"
  const url = SITE_URL + asPath.split(/[?#]/)[0]
  const ogImage = image ?? `${SITE_URL}/og-image.png`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Hotflix" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  )
}
