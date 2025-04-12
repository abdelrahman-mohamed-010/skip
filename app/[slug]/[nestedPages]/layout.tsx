/* eslint-disable @typescript-eslint/no-explicit-any */
import Navigation from "@/components/Navigation";
import PageScripts from "@/components/PageScripts";
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
  params: { slug: string; nestedPages: string };
}): Promise<Metadata> {
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      innerPages[]{
        "slug": slug.current,
        title,
        seo
      }
    }`,
    { slug: params.slug }
  );

  const innerPage = pageData?.innerPages?.find(
    (page: any) => page.slug === params.nestedPages
  );

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
  };
}

interface PageData {
  innerPages?: Array<{
    slug: string;
    customScripts?: {
      headScript?: string;
      bodyScript?: string;
    };
  }>;
}

async function getPageScripts(
  slug: string,
  nestedPage: string
): Promise<{ headScript?: string; bodyScript?: string }> {
  const pageData = (await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      innerPages[]{
        "slug": slug.current,
        customScripts
      }
    }`,
    { slug }
  )) as PageData;

  const innerPage = pageData?.innerPages?.find(
    (page) => page.slug === nestedPage
  );

  return innerPage?.customScripts || {};
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string; nestedPages: string };
}) {
  const customScripts = await getPageScripts(params.slug, params.nestedPages);

  return (
    <div className="min-h-screen flex flex-col">
      <PageScripts
        headScript={customScripts?.headScript}
        bodyScript={customScripts?.bodyScript}
      />
      <Navigation />
      {children}
    </div>
  );
}
