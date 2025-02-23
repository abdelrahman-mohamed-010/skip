/* eslint-disable @next/next/no-img-element */
import React from "react";
import RichTextRenderer from "./RichTextRenderer";

interface ResponsibilitiesProps {
  title?: string;
  sideImage?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  cta?: Array<{
    text: string;
    link: string;
  }>;
  reverse?: boolean;
}

export default function BlockComponent({
  title,
  sideImage,
  content,
  cta,
  reverse = false,
}: ResponsibilitiesProps) {
  return (
    <>
      {title && (
        <h2 className="text-3xl font-bold text-primary mb-8">{title}</h2>
      )}
      <div
        className={`flex flex-col min-h-[300px] ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } gap-8 items-stretch`}
      >
        <div className="w-full md:w-1/2 relative">
          {sideImage?.asset?.url && (
            <img
              src={sideImage.asset.url}
              alt={sideImage?.alt || ""}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="prose max-w-none">
            <RichTextRenderer
              content={content}
              alignment="left"
              responsibilities={true}
            />
          </div>
          {cta && Array.isArray(cta) && (
            <div className="flex space-x-4 mt-8">
              {cta.map((button, btnIndex) => (
                <a
                  key={btnIndex}
                  href={button.link}
                  className={`inline-block px-12 py-2 rounded-md transition-colors ${
                    btnIndex === 0
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
