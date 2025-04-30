/* eslint-disable @next/next/inline-script-id */
import { Montserrat, Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import CanonicalLink from "../components/CanonicalLink";
import { client } from "@/sanity/lib/client";
import Script from "next/script";
import ConditionalFooterComponents from "@/components/ConditionalFooterComponents";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import ScriptLogger from "@/components/ScriptLogger";

const DEFAULT_TITLE = "SkipLegal - Immigration Law Made Simplee";
const DEFAULT_DESCRIPTION =
  "Get expert immigration guidance and free consultations. Navigate US immigration processes with confidence.";
const DEFAULT_KEYWORDS = [
  "immigration law",
  "US visa",
  "green card",
  "citizenship",
  "immigration attorney",
];

export async function generateMetadata(): Promise<Metadata> {
  const query = `
    *[_type=="landing"][0]{
      seoTitle,
      seoDescription,
      seoKeywords
    }
  `;
  let landingSeo;
  try {
    landingSeo = await client.fetch(query);
  } catch (error) {
    console.error("Error fetching landing SEO data:", error);
  }

  return {
    title: landingSeo?.seoTitle || DEFAULT_TITLE,
    description: landingSeo?.seoDescription || DEFAULT_DESCRIPTION,
    keywords: landingSeo?.seoKeywords?.length
      ? landingSeo.seoKeywords
      : DEFAULT_KEYWORDS,
    openGraph: {
      title: landingSeo?.seoTitle || DEFAULT_TITLE,
      description: landingSeo?.seoDescription || DEFAULT_DESCRIPTION,
      type: "website",
    },
  };
}

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head className="">
          <CanonicalLink />
          {/* Add robots meta tag */}
          <meta name="robots" content="index, follow" />
          {/* Tracking Scripts */}

          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MMGTJ8TG');`,
            }}
          />
          {/* End Google Tag Manager */}

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-975642063"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-975642063');
            `}
          </Script>
          <Script
            type="text/javascript"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "pfpw764hl7");
              `,
            }}
          />
          <Script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            strategy="afterInteractive"
            src="//js.hs-scripts.com/48301226.js"
          />

          {/* Meta Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1214200300035848');
                fbq('track', 'PageView');
              `,
            }}
          />
          {/* End Meta Pixel Code */}
        </head>
        <body
          className={`${montserrat.variable} ${inter.variable} antialiased bg-white`}
        >
          {/* Google Tag Manager (noscript) */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMGTJ8TG"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}

          {/* Meta Pixel noscript . maybe not needed*/}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=1214200300035848&ev=PageView&noscript=1"
              />`,
            }}
          />

          {/* Development script logger */}
          {process.env.NODE_ENV === "development" && <ScriptLogger />}

          {children}
          <ConditionalFooterComponents />
          <VercelAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
