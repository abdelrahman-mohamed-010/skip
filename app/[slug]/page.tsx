/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "@/sanity/lib/client";
import ImageSlider from "@/components/imageSlider";
import ContentSlider from "@/components/ContentSlider";
import PdfViewer from "@/components/PdfViewer";
import PageHEader from "@/components/PageHEader";
import RichTextRenderer from "@/components/RichTextRenderer";
import PageCTA from "@/components/PageCTA";

export async function generateStaticParams() {
  const pages = await client.fetch(`*[_type == "page"]{
    "slug": slug.current
  }`);

  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
    title,
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
      cta {
        text,
        link
      }
    }
  }`,
    { slug: params.slug }
  );

  const pageBuilderLength = page.pageBuilder?.length || 0;

  return (
    <main>
      <PageHEader />
      <section className=" pt-12 text-center">
        <h1 className="text-5xl max-sm:text-4xl font-bold text-primary">
          {page.title}
        </h1>
      </section>

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
                className={`${minHeightClass} py-12 max-w-[1160px] px-4 mx-auto flex items-center justify-center bg-white ${firstComponentClass}`}
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
          case "responsibilities":
            return (
              <section
                key={index}
                className={`py-16 px-4 max-w-[1160px] mx-auto bg-white ${firstComponentClass}`}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-auto">
                    {component.sideImage?.asset?.url && (
                      <img
                        src={component.sideImage.asset.url}
                        alt={component.sideImage?.alt || ""}
                        className="object-cover rounded-lg w-full"
                        style={{ height: "400px" }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <div className="prose max-w-none">
                      <RichTextRenderer
                        content={component.content}
                        alignment="left"
                      />
                    </div>
                    {component.cta && (
                      <div>
                        <a
                          href={component.cta.link}
                          className="inline-block px-12 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                          {component.cta.text}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}

      <PageCTA />
    </main>
  );
}
