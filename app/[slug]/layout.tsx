// import ContactLawyerForm from "@/components/ContactLawyerForm";
// import Footer from "@/components/Footer";
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
  params: { slug: string };
}): Promise<Metadata> {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      seo
    }`,
    { slug: params.slug }
  );

  if (!page?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    keywords: page.seo.keywords,
    openGraph: {
      title: page.seo.metaTitle,
      description: page.seo.metaDescription,
    },
  };
}

interface PageData {
  customScripts?: {
    headScript?: string;
    bodyScript?: string;
  };
}

async function getPageScripts(slug: string): Promise<PageData> {
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      customScripts
    }`,
    { slug }
  );

  return pageData || {};
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const pageData = await getPageScripts(params.slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageScripts
        headScript={pageData?.customScripts?.headScript}
        bodyScript={pageData?.customScripts?.bodyScript}
      />
      <Navigation />
      {children}
    </div>
  );
}
