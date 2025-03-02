import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navigation from "@/components/Navigation";

const defaultMetadata = {
  title: "SkipLegal Blog",
  description: "Latest immigration law insights and updates",
  keywords: ["immigration law", "legal blog", "immigration updates"],
};

export async function generateMetadata({
  params,
}: {
  params: { blog: string };
}): Promise<Metadata> {
  const blogData = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      title,
      seo
    }`,
    { slug: params.blog }
  );

  if (!blogData?.seo?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: blogData.seo.metaTitle,
    description: blogData.seo.metaDescription,
    keywords: blogData.seo.keywords,
    openGraph: {
      title: blogData.seo.metaTitle,
      description: blogData.seo.metaDescription,
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
