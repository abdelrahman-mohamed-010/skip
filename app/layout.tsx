/* eslint-disable @next/next/inline-script-id */
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import CanonicalLink from "../components/CanonicalLink";
import { client } from "@/sanity/lib/client";
import Script from "next/script";
import ConditionalFooterComponents from "@/components/ConditionalFooterComponents";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <CanonicalLink />
        {/* Tracking Scripts */}
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ConditionalFooterComponents />
        <VercelAnalytics />
      </body>
    </html>
  );
}
