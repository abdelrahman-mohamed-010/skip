/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "@/sanity/lib/client";
import ImageSlider from "@/components/imageSlider";
import ContentSlider from "@/components/ContentSlider";
import PdfViewer from "@/app/app/components/PdfViewer";
import RichTextRenderer from "@/components/RichTextRenderer";
import PageCTA from "@/components/PageCTA";
import Header from "@/components/Header";
import Finale from "@/components/Finale";
import Head from "next/head";
import BlockComponent from "@/components/BlockComponent";
import Questions from "@/components/Questions";
import InlineShareButtons from "@/components/InlineShareButtons";
import Slider from "@/components/Slider";
import CaseIntroSection from "@/components/CaseIntroSection";

export async function generateStaticParams() {
  const pages = await client.fetch(`*[_type == "page"]{
    "slug": slug.current
  }`);

  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  params = await params;
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
    title,
    showShareButton,
    pageBuilder[] {
      _type,
      title,
      subtitle,
      "backgroundImageUrl": image.asset->url,
      "content": content,
      video,
      description,
      buttonText,
      buttonLink,
      displayType,
      galleryTitle,
      "images": images[] {
        "url": asset->url + "?w=1920&q=85&fit=max&auto=format",
        "alt": alt
      },
      text,
      alignment,
      sliderTitle,
      slides[] {
        title,
        description[] {
          content[] 
        }
      },
      tableTitle,
      tableDescription,
      tables[],
      pdfFile {
        asset->
      },
      formTitle,
      description,
      submitButtonText,
      googleSheetId,
      formFields[] {
        fieldName,
        fieldLabel,
        fieldType,
        required,
        options[] {
          optionLabel,
          value
        }
      },
      sideImage {
        asset->{
          url
        },
        alt
      },
      title,  // Add this line to fetch the title
      cta[]{  
        text,
        link,
        buttonType,    // Add these
        chatbotQuestion  // Add these
      },
      "reverse": reverse,
      cards[] {
        title,
        description,
        icon,
        isHighlighted,
        link
      },
      image {
        asset->{
          url
        }
      },
      questions[] {
        question,
        description,
        buttonText,
        chatbotQuestion,
        icon
      },
      slider[] {
        question,
        answer
      },
      faqs[] {  // Add this block to fetch FAQ data
        question,
        answer
      }
    },
    bodyScript
  }`,
    { slug: params.slug }
  );

  const pageBuilderLength = page.pageBuilder?.length || 0;

  const hasHeaderComponent = page.pageBuilder?.some(
    (component: any) => component._type === "header"
  );

  // Define url for share buttons
  const url = typeof window !== "undefined" ? window.location.href : "";

  const bodyScriptHtml = page?.bodyScript || "";

  return (
    <>
      {/* Add the body script directly to the page */}
      {bodyScriptHtml && (
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: bodyScriptHtml }}
        />
      )}
      {page.seo && (
        <Head>
          <title>{page.seo.metaTitle || page.title}</title>
          <meta name="description" content={page.seo.metaDescription || ""} />
          {page.seo.keywords && (
            <meta name="keywords" content={page.seo.keywords.join(", ")} />
          )}
        </Head>
      )}
      <main className="bg-white">
        <CaseIntroSection />
        {!hasHeaderComponent && (
          <section className="pt-12 text-center">
            <h1 className="text-5xl max-sm:text-4xl font-bold text-primary">
              {page.title}
            </h1>
          </section>
        )}
        {page.pageBuilder?.map((component: any, index: number) => {
          const isFirstComponent = index === 0;
          const firstComponentClass = isFirstComponent ? "pt-12" : "";

          switch (component._type) {
            case "richText":
              let minHeightClass =
                pageBuilderLength <= 2 ? "min-h-[500px]" : "min-h-[200px]";
              if (index === 1 && pageBuilderLength !== 2) {
                minHeightClass += " pt-20";
              }

              return (
                <section
                  key={index}
                  className={`${minHeightClass} py-12 pb-0 max-w-7xl px-4 mx-auto flex items-center justify-start bg-white ${firstComponentClass}`}
                >
                  <RichTextRenderer
                    content={component.content}
                    alignment="left"
                    minHeightClass={minHeightClass}
                  />
                </section>
              );

            case "gallery":
              return (
                <section
                  key={index}
                  className={`py-16 px-4 max-w-[1160px] mx-auto bg-white ${firstComponentClass}`}
                >
                  <div className="container mx-auto px-4">
                    {component.galleryTitle && (
                      <h2 className="text-3xl max-md:text-xl mb-20">
                        {component.galleryTitle}
                      </h2>
                    )}
                    <ImageSlider
                      images={component.images}
                      displayType={component.displayType}
                    />
                  </div>
                </section>
              );

            case "contentSlider":
              return (
                <section
                  key={index}
                  className={`py-0 px-4 max-w-[1160px] mx-auto bg-white ${firstComponentClass}`}
                >
                  <div className="container mx-auto px-4">
                    {component.sliderTitle && (
                      <h2 className="text-3xl max-md:text-xl mb-20">
                        {component.sliderTitle}
                      </h2>
                    )}
                    <ContentSlider slides={component.slides} />
                  </div>
                </section>
              );
            case "pdfViewer":
              return (
                <section
                  key={index}
                  className={`py-16 px-4 max-w-[1160px] mx-auto bg-white ${firstComponentClass}`}
                >
                  <div className="container mx-auto px-4">
                    <PdfViewer pdfUrl={component.pdfFile.asset.url} />
                  </div>
                </section>
              );
            case "blockcomponent":
              return (
                <section
                  key={index}
                  className={` pt-6 pb-12 px-4 max-w-7xl mx-auto bg-white ${firstComponentClass}`}
                >
                  <BlockComponent
                    title={component.title} // Add this line
                    sideImage={component.sideImage}
                    content={component.content}
                    cta={component.cta}
                    reverse={component.reverse} // Added reverse prop
                  />
                </section>
              );
            case "header":
              return (
                <Header
                  key={index}
                  title={component.title}
                  subtitle={component.subtitle}
                  description={component.description}
                  cards={component.cards}
                />
              );
            case "finale":
              return (
                <Finale
                  key={index}
                  title={component.title}
                  subtitle={component.subtitle}
                  description={component.description}
                  backgroundImageUrl={component.image?.asset?.url}
                  cta={component.cta}
                />
              );
            case "questions":
              return (
                <section key={index} className="bg-gray-50">
                  <Questions questions={component.questions} />
                </section>
              );
            case "slider":
              return (
                <section
                  key={index}
                  className={`py-0 bg-white ${firstComponentClass}`}
                >
                  <Slider title={component.title} faqs={component.faqs} />
                </section>
              );
            default:
              return null;
          }
        })}
        {page.showShareButton && (
          <section className="text-center my-4 bg-white">
            <InlineShareButtons url={url} title={page.title} />
          </section>
        )}
        <PageCTA />
      </main>
    </>
  );
}
