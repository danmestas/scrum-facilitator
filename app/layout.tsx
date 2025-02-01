import "@/styles/globals.css"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import type React from "react" // Import React

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html lang="en">
      <body className={`${lato.variable} font-lato`}>{children}</body>
    </html>
  )
}



import './globals.css'