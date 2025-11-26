/* eslint-disable react/react-in-jsx-scope */
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Roboto, Playfair_Display, Crimson_Pro, Lora, Montserrat, Open_Sans } from 'next/font/google'
import './global.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
})

const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-playfair'
})

const crimsonPro = Crimson_Pro({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-crimson'
})

const lora = Lora({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lora'
})

const montserrat = Montserrat({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat'
})

const openSans = Open_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-opensans'
})

export const metadata: Metadata = {
  title: 'SmartATS - Resume Builder That Actually Gets You Hired',
  description: 'Far too many resumes get rejected by ATS bots. Our AI ensures yours makes it to human eyes.',
  keywords: ['resume builder', 'ATS optimization', 'job search', 'career', 'AI resume'],
  authors: [{ name: 'SmartATS Team' }],
  creator: 'SmartATS',
  publisher: 'SmartATS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smartats.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SmartATS - Resume Builder That Actually Gets You Hired',
    description: 'Far too many of resumes get rejected by ATS bots. Our AI ensures yours makes it to human eyes.',
    url: 'https://smartats.com',
    siteName: 'SmartATS',
    images: [
      {
        url: '/horse-logo.png',
        width: 1200,
        height: 630,
        alt: 'SmartATS - Beat the ATS, Get the Job',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartATS - Resume Builder That Actually Gets You Hired',
    description: 'Far too many resumes get rejected by ATS bots. Our AI ensures yours makes it to human eyes.',
    images: ['/horse-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Pro:wght@300;400;600&family=Lora:wght@400;700&family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        <script async src="https://js.stripe.com/v3/"></script>
      </head>
      <body className={`${inter.className} ${roboto.variable} ${playfairDisplay.variable} ${crimsonPro.variable} ${lora.variable} ${montserrat.variable} ${openSans.variable}`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
