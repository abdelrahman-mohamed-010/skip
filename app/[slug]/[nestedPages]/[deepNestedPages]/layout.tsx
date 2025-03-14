/* eslint-disable @typescript-eslint/no-explicit-any */
import Navigation from "@/components/Navigation";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";

const defaultMetadata = {
  title: "SkipLegal - Immigration Law Made Simple",
  description:
    "Get expert immigration guidance and free consultations. Navigate US immigration processes with confidence.",
  keywords: [
    "immigration law",
    "US visa",
    "green card",
    "citizenship",
    "immigration attorney",
  ],
  openGraph: {
    title: "SkipLegal - Immigration Law Made Simple",
    description:
      "Get expert immigration guidance and free consultations. Navigate US immigration processes with confidence.",
    type: "website",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string; nestedPages: string; deepNestedPages: string };
}): Promise<Metadata> {
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      innerPages[]{
        "slug": slug.current,
        deepNestedPages[]{
          "slug": slug.current,
          title,
          seo
        }
      }
    }`,
    { slug: params.slug }
  );

  // Find the correct inner page first
  const innerPage = pageData?.innerPages?.find(
    (page: any) => page.slug === params.nestedPages
  );

  // Then find the deep nested page
  const deepNestedPage = innerPage?.deepNestedPages?.find(
    (page: any) => page.slug === params.deepNestedPages
  );

  if (!deepNestedPage?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: deepNestedPage.seo.metaTitle,
    description: deepNestedPage.seo.metaDescription,
    keywords: deepNestedPage.seo.keywords,
    openGraph: {
      title: deepNestedPage.seo.metaTitle,
      description: deepNestedPage.seo.metaDescription,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
    </div>
  );
}
