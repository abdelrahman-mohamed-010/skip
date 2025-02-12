/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactLawyerForm from "@/components/ContactLawyerForm";
import Footer from "@/components/Footer";
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
      <ContactLawyerForm />
      <Footer />
    </div>
  );
}
