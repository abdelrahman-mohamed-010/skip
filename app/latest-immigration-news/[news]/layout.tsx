import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navigation from "@/components/Navigation";

const defaultMetadata = {
  title: "Immigration News | SkipLegal",
  description: "Latest updates on immigration policies and changes",
  keywords: ["immigration news", "policy updates", "immigration changes"],
};

export async function generateMetadata({
  params,
}: {
  params: { news: string };
}): Promise<Metadata> {
  const newsData = await client.fetch(
    `*[_type == "news" && slug.current == $slug][0]{
      title,
      seo
    }`,
    { slug: params.news }
  );

  if (!newsData?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: newsData.seo.metaTitle,
    description: newsData.seo.metaDescription,
    keywords: newsData.seo.keywords,
    openGraph: {
      title: newsData.seo.metaTitle,
      description: newsData.seo.metaDescription,
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
