import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navigation from "@/components/Navigation";

const defaultMetadata = {
  title: "SkipLegal Immigration Guides",
  description: "Comprehensive immigration guides and resources",
  keywords: ["immigration guides", "immigration resources", "legal guidance"],
};

export async function generateMetadata({
  params,
}: {
  params: { guides: string };
}): Promise<Metadata> {
  const guideData = await client.fetch(
    `*[_type == "guides" && slug.current == $slug][0]{
      title,
      seo
    }`,
    { slug: params.guides }
  );

  if (!guideData?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: guideData.seo.metaTitle,
    description: guideData.seo.metaDescription,
    keywords: guideData.seo.keywords,
    openGraph: {
      title: guideData.seo.metaTitle,
      description: guideData.seo.metaDescription,
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
