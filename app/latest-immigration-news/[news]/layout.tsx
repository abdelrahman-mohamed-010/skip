import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navigation from "@/components/Navigation";

const defaultMetadata = {
  title: "Immigration News | SkipLegal",
  description: "Latest updates on immigration policies and changes",
  keywords: ["immigration news", "policy updates", "immigration changes"],
};

// Helper function to fetch news data
async function getNewsMetadata(slug: string) {
  console.log('Fetching news metadata for slug:', slug);
  const data = await client.fetch(
    `*[_type == "news" && slug.current == $slug][0]{
      title,
      seo,
      headScript
    }`,
    { slug }
  );
  console.log('Fetched headScript:', data?.headScript);
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { news: string };
}): Promise<Metadata> {
  // Await params directly as recommended in the error message
  params = await params;
  const newsData = await getNewsMetadata(params.news);

  if (!newsData?.seo?.metaTitle) {
    return defaultMetadata;
  }

  // Create HTML head object that includes the custom script
  return {
    title: newsData.seo.metaTitle,
    description: newsData.seo.metaDescription,
    keywords: newsData.seo.keywords,
    openGraph: {
      title: newsData.seo.metaTitle,
      description: newsData.seo.metaDescription,
    },
    // Add the script to head via head property
    ...(newsData.headScript && {
      other: {
        custom: newsData.headScript
      }
    })
  };
}

export default async function Layout({ 
  children
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
