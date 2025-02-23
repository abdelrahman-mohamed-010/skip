/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { client } from "@/sanity/lib/client";
import RichTextRenderer from "@/components/RichTextRenderer";
import ImageSlider from "@/components/imageSlider";
import ContentSlider from "@/components/ContentSlider";
import PdfViewer from "@/components/PdfViewer";
import PageCTA from "@/components/PageCTA";
import Header from "@/components/Header";
import Finale from "@/components/Finale";
import BlockComponent from "@/components/BlockComponent";
import Questions from "@/components/Questions";
import InlineShareButtons from "@/components/InlineShareButtons";
import Slider from "@/components/Slider";

type Params = {
  params: {
    slug: string;
    nestedPages: string;
  };
};

export default async function Page({ params }: Params) {
  const { slug, nestedPages } = params;
  // Fetch the parent page including inner pages with their content.
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      innerPages[]{
        title,
        "slug": slug.current,
        showShareButton,
        content[]{
          _type,
          // ...other fields as needed per component...
          title,
          subtitle,
          "backgroundImageUrl": image.asset->url,
          content,
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
          sliderTitle,
          slides,
          pdfFile {
            asset->
          },
          // Add these fields for responsibilities component
          sideImage {
            asset->{
              url
            },
            alt
          },
          cta[] {  // changed from cta { ... }
            text,
            link
          },
          "reverse": reverse,
          cards[] {
            title,
            description,
            icon,
            isHighlighted
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
        }
      }
    }`,
    { slug }
  );

  // Find the inner page matching the nestedPages parameter.
  const innerPage = pageData?.innerPages?.find(
    (page: any) => page.slug === nestedPages
  );
  if (!innerPage) return <div>Inner page not found</div>;

  const contentLength = innerPage.content?.length || 0;

  // Add this helper function after getting innerPage
  const hasHeaderComponent = innerPage.content?.some(
    (component: any) => component._type === "header"
  );

  // Define url for share buttons
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main>
      {!hasHeaderComponent && (
        <section className="text-center pt-32 relative">
          <h1 className="text-5xl max-sm:text-4xl font-bold text-primary">
            {innerPage.title}
          </h1>
          <div className="w-48 h-1 mx-auto mt-3 absolute -bottom-5 right-1/2 translate-x-1/2 bg-yellow-500"></div>
        </section>
      )}
      {innerPage.content?.map((component: any, index: number) => {
        const isFirstComponent = index === 0;
        const firstComponentClass = isFirstComponent ? "pt-12" : "";
        switch (component._type) {
          case "richText": {
            let minHeightClass =
              contentLength <= 2 ? "min-h-[500px]" : "min-h-[200px]";
            if (index === 1 && contentLength !== 2) {
              minHeightClass += " pt-0";
            }
            return (
              <section
                key={index}
                className={`${minHeightClass} py-12 pb-0 max-w-[1280px] px-4 mx-auto flex items-center  bg-white ${firstComponentClass}`}
              >
                <RichTextRenderer
                  content={component.content}
                  alignment="left"
                  minHeightClass={minHeightClass}
                />
              </section>
            );
          }
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
                className={`py-16 px-4 max-w-[1160px] mx-auto bg-white ${firstComponentClass}`}
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
                className={`py-6 px-4 max-w-[1280px] mx-auto bg-white ${firstComponentClass}`}
              >
                <BlockComponent
                  title={component.title}
                  sideImage={component.sideImage}
                  content={component.content}
                  cta={component.cta}
                  reverse={component.reverse}
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
                className={`py-12 bg-white ${firstComponentClass}`}
              >
                <Slider title={component.title} faqs={component.faqs} />
              </section>
            );
          default:
            return null;
        }
      })}
      {innerPage.showShareButton && (
        <section className="text-center my-4">
          <InlineShareButtons url={url} title={innerPage.title} />
        </section>
      )}
      <PageCTA />
    </main>
  );
}
