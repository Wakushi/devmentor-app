import type { Metadata } from "next"
import "./globals.css"
import ShaderGradientBackground from "@/components/ui/shader-gradient"
import LoadingScreen from "@/components/ui/loading-screen"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Devmentor",
  description:
    "Devmentor is a non-profit social-fi application where students and mentors can connect to share their knowledge about web3, smart contracts, security and all EVM related subjects, while getting rewarded.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <ShaderGradientBackground />
        <LoadingScreen />
      </body>
    </html>
  )
}
