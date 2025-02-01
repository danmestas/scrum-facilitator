import "@/styles/globals.css"
import './globals.css'

import { Lato } from "next/font/google"
import type { Metadata } from "next"
import type React from "react" // Import React

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "Scrum Facilitator",
  description: "A tool to facilitate scrum meetings",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lato.variable}`}>
      <body>{children}</body>
    </html>
  )
}



