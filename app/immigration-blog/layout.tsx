import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
// import ContactLawyerForm from "@/components/ContactLawyerForm";
// import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PageCTA from "@/components/PageCTA";

const defaultMetadata = {
  title: "Immigration Law Blog | SkipLegal",
  description:
    "Stay informed with the latest immigration law updates, insights, and expert analysis from SkipLegal.",
  keywords: [
    "immigration law blog",
    "legal updates",
    "immigration insights",
    "US immigration news",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(
    `*[_type == "pageListings" && identifier == "blogs"][0].seo`
  );

  if (!pageData?.metaTitle) {
    return defaultMetadata;
  }

  return {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      type: "website",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {children}
      {/* <ContactLawyerForm />
      <Footer /> */}
      <PageCTA />
    </div>
  );
}
