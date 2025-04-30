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

// Helper function to fetch inner page data
async function getInnerPageMetadata(slug: string, nestedPages: string) {
  const data = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      innerPages[]{
        "slug": slug.current,
        title,
        seo,
        headScript
      }
    }`,
    { slug }
  );
  const innerPage = data?.innerPages?.find((page: any) => page.slug === nestedPages);
  return innerPage;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; nestedPages: string };
}): Promise<Metadata> {
  params = await params;
  const innerPage = await getInnerPageMetadata(params.slug, params.nestedPages);

  if (!innerPage?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: innerPage.seo.metaTitle,
    description: innerPage.seo.metaDescription,
    keywords: innerPage.seo.keywords,
    openGraph: {
      title: innerPage.seo.metaTitle,
      description: innerPage.seo.metaDescription,
    },
    ...(innerPage.headScript && {
      other: {
        custom: innerPage.headScript
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
