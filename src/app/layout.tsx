import type { Metadata } from 'next'
import { Inter, Ubuntu } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from "@/components/ui/toaster"

const ubuntu = Ubuntu({ weight: "400", subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yolda Scheduler',
  description: 'Manage your schedule efficiently',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { pathname: string }
}) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer showOnPaths={['/about', '/contact', '/']} />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
