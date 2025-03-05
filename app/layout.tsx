import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import CanonicalLink from "../components/CanonicalLink";
import CookieConsent from "@/components/CookieConsent";
import { client } from "@/sanity/lib/client";

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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
