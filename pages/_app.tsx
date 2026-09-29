import type { AppProps } from "next/app"
import type { NextPage } from "next"
import { Fraunces, Geist } from "next/font/google"
import Layout from "@/components/Layout"
import { TrailerProvider } from "@/components/Trailer"
import "@/styles/globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })

// Pages with a full-bleed hero set this so the header starts transparent over the image.
export type HotflixPage<P = object> = NextPage<P> & { overlayHeader?: boolean }

export default function App({ Component, pageProps }: AppProps & { Component: HotflixPage }) {
  return (
    <div className={`${fraunces.variable} ${geist.variable} app-root`}>
      <TrailerProvider>
        <Layout overlayHeader={Component.overlayHeader}>
          <Component {...pageProps} />
        </Layout>
      </TrailerProvider>
    </div>
  )
}
