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

// Helper function to fetch deep nested page data
async function getDeepNestedPageMetadata(slug: string, nestedPages: string, deepNestedPages: string) {
  const data = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      innerPages[]{
        "slug": slug.current,
        deepNestedPages[]{
          "slug": slug.current,
          title,
          seo,
          headScript
        }
      }
    }`,
    { slug }
  );
  const innerPage = data?.innerPages?.find((page: any) => page.slug === nestedPages);
  const deepNestedPage = innerPage?.deepNestedPages?.find((page: any) => page.slug === deepNestedPages);
  return deepNestedPage;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; nestedPages: string; deepNestedPages: string };
}): Promise<Metadata> {
  params = await params;
  const deepNestedPage = await getDeepNestedPageMetadata(params.slug, params.nestedPages, params.deepNestedPages);

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
    ...(deepNestedPage.headScript && {
      other: {
        custom: deepNestedPage.headScript
      }
    })
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
    </div>
  );
}
