import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0a0d13" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://image.tmdb.org" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
