/* eslint-disable react/react-in-jsx-scope */
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Roboto, Playfair_Display, Crimson_Pro, Lora, Montserrat, Open_Sans } from 'next/font/google'
import './global.css'
import { Toaster } from 'react-hot-toast'
import React from 'react'
import { Analytics } from "@vercel/analytics/next"

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
  metadataBase: new URL('https://smartatsresume.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SmartATS - Resume Builder That Actually Gets You Hired',
    description: 'Far too many of resumes get rejected by ATS bots. Our AI ensures yours makes it to human eyes.',
    url: 'https://smartatsresume.com',
    siteName: 'SmartATS',
    images: [
      {
        url: '/horse-logo.png',
        width: 1200,
        height: 630,
        alt: 'SmartATS - Beat the Bots, Get the Job',
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
        {/* TikTok Pixel Code Start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D4T9U83C77U9PCMM0IHG');
  ttq.page();
}(window, document, 'ttq');
            `,
          }}
        />
        {/* TikTok Pixel Code End */}
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5CR4JBCN');
            `,
          }}
        />
        {/* End Google Tag Manager */}

	        {/* Google tag (gtag.js) */}
	        {/* Google Ads + Analytics */}
	        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17692753265"></script>

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
	              gtag('config', 'G-LW218B0V79');
	              gtag('config', 'AW-17692753265');
              
              // Reddit Pixel - Data Layer for purchase events
              window.trackRedditPurchase = function(email, phone, value, currency, items) {
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                  event: "purchase",
                  user_data: {
                    email_address: email || "",
                    phone_number: phone || ""
                  },
                  ecommerce: {
                    value: value || 0,
                    currency: currency || "USD",
                    items: items || []
                  }
                });
                
                if (typeof gtag === 'function') {
                  gtag("event", "purchase", {
                    user_data: {
                      email_address: email || "",
                      phone_number: phone || ""
                    },
                    value: value || 0,
                    currency: currency || "USD",
                    items: items || []
                  });
                }
              };
            `,
          }}
        />
        <script async src="https://js.stripe.com/v3/"></script>
        
        {/* Start of HubSpot Embed Code */}
        <script type="text/javascript" id="hs-script-loader" async defer src="//js-na2.hs-scripts.com/244982286.js"></script>
        {/* End of HubSpot Embed Code */}
        
        {/* Apollo Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){
                var n=Math.random().toString(36).substring(7),o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
                o.onload=function(){window.trackingFunctions.onLoad({appId:"6977c247ccb0ba0019bdbfa5"})},
                document.head.appendChild(o)
              }
              initApollo();
            `,
          }}
        />
        {/* End Apollo Tracking */}
      </head>
      <body className={`${inter.className} ${roboto.variable} ${playfairDisplay.variable} ${crimsonPro.variable} ${lora.variable} ${montserrat.variable} ${openSans.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CR4JBCN"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}

