/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

interface ContentSlide {
  title: string;
  content: any[]; // Keep the rich text content structure
}

interface ContentSliderProps {
  title?: string;
  slides: ContentSlide[];
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  slides = [],
}) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderContent = (content: any[] | undefined) => {
    if (!content || !Array.isArray(content)) return null;
    return content.map((block: any, index: number) => {
      if (block._type === "image") {
        return (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-8 my-8 items-start"
          >
            <div className="md:w-[35%]">
              <img
                src={block.imageUrl}
                alt={block.alt || ""}
                className="w-full rounded-lg"
              />
            </div>
            <div className="md:w-[65%]">
              {(block.description || []).map((descBlock: any, i: number) => {
                if (descBlock._type !== "block") return null;

                if (descBlock.listItem === "bullet") {
                  return (
                    <ul key={i} className="list-disc ml-6 mt-3">
                      <li className="mb-2">
                        {descBlock.children.map((span: any, j: number) => {
                          const marks = span.marks || [];
                          let text = span.text;

                          if (marks.includes("strong")) {
                            text = <strong key={j}>{text}</strong>;
                          }
                          if (marks.includes("underline")) {
                            text = <u key={j}>{text}</u>;
                          }
                          return text;
                        })}
                      </li>
                    </ul>
                  );
                }

                const Component =
                  descBlock.style === "normal" ? "p" : descBlock.style;
                return (
                  <Component
                    key={i}
                    className={
                      descBlock.style === "h4"
                        ? "text-xl font-bold mb-4"
                        : descBlock.style === "h5"
                          ? "text-lg font-bold mb-3"
                          : "mb-4 leading-relaxed"
                    }
                  >
                    {descBlock.children.map((span: any, j: number) => {
                      const marks = span.marks || [];
                      let text = span.text;

                      if (marks.includes("strong")) {
                        text = <strong key={j}>{text}</strong>;
                      }
                      if (marks.includes("underline")) {
                        text = <u key={j}>{text}</u>;
                      }
                      return text;
                    })}
                  </Component>
                );
              })}
            </div>
          </div>
        );
      }

      if (block._type === "block") {
        if (block.listItem === "bullet") {
          return (
            <ul key={index} className="list-disc ml-6 mt-3">
              <li className="mb-2">
                {block.children.map((span: any, i: number) => {
                  const marks = span.marks || [];
                  let text = span.text;

                  const linkMark = span.marks?.find((mark: string) =>
                    block.markDefs?.find(
                      (def: any) => def._key === mark && def._type === "link"
                    )
                  );

                  const linkDef = linkMark
                    ? block.markDefs.find((def: any) => def._key === linkMark)
                    : null;

                  if (linkDef) {
                    text = (
                      <a
                        key={i}
                        href={linkDef.href}
                        className="text-yellow-500 underline hover:text-yellow-600"
                      >
                        {text}
                      </a>
                    );
                  }
                  if (marks.includes("strong")) {
                    text = <strong key={i}>{text}</strong>;
                  }
                  if (marks.includes("underline")) {
                    text = <u key={i}>{text}</u>;
                  }
                  return text;
                })}
              </li>
            </ul>
          );
        }

        if (block.listItem === "number") {
          if (block._processedInList) return null;

          const currentIndex = content.indexOf(block);
          const listItems = [];

          for (let i = currentIndex; i < content.length; i++) {
            const currentBlock = content[i];
            if (currentBlock.listItem !== "number") break;

            currentBlock._processedInList = true;
            listItems.push({
              children: currentBlock.children,
              markDefs: currentBlock.markDefs,
            });
          }

          return (
            <ol
              key={index}
              className="list-decimal mt-2 ml-6 [&>li]:pl-2 [&>li::marker]:text-yellow-500 [&>li::marker]:font-bold"
            >
              {listItems.map((item: any, i: number) => (
                <li key={i} className="mb-2">
                  {item.children.map((span: any, j: number) => {
                    const marks = span.marks || [];
                    let text = span.text;

                    const linkMark = span.marks?.find((mark: string) =>
                      item.markDefs?.find(
                        (def: any) => def._key === mark && def._type === "link"
                      )
                    );

                    const linkDef = linkMark
                      ? item.markDefs.find((def: any) => def._key === linkMark)
                      : null;

                    if (linkDef) {
                      text = (
                        <a
                          key={j}
                          href={linkDef.href}
                          className="text-yellow-500 underline hover:text-yellow-600"
                        >
                          {text}
                        </a>
                      );
                    }
                    if (marks.includes("strong")) {
                      text = <strong key={j}>{text}</strong>;
                    }
                    if (marks.includes("underline")) {
                      text = <u key={j}>{text}</u>;
                    }
                    return text;
                  })}
                </li>
              ))}
            </ol>
          );
        }

        if (!block.listItem) {
          const Component = block.style === "normal" ? "p" : block.style;
          return (
            <Component
              key={index}
              className={
                block.style === "h2"
                  ? "text-3xl font-bold mb-6 mt-4 text-secondary"
                  : block.style === "h3"
                    ? "text-2xl font-bold mb-5 mt-4 text-secondary"
                    : block.style === "h4"
                      ? "text-xl font-bold mb-5 mt-4 text-secondary"
                      : block.style === "h5"
                        ? "text-lg font-bold mb-4 mt-4 text-secondary"
                        : "leading-relaxed"
              }
            >
              {block.children.map((span: any, i: number) => {
                const marks = span.marks || [];
                let text = span.text;

                const linkMark = span.marks?.find((mark: string) =>
                  block.markDefs?.find(
                    (def: any) => def._key === mark && def._type === "link"
                  )
                );

                const linkDef = linkMark
                  ? block.markDefs.find((def: any) => def._key === linkMark)
                  : null;

                if (linkDef) {
                  text = (
                    <a
                      key={i}
                      href={linkDef.href}
                      className="text-yellow-500 underline hover:text-yellow-600"
                    >
                      {text}
                    </a>
                  );
                }
                if (marks.includes("strong")) {
                  text = <strong key={i}>{text}</strong>;
                }
                if (marks.includes("underline")) {
                  text = <u key={i}>{text}</u>;
                }
                return text;
              })}
            </Component>
          );
        }
      }
      return null;
    });
  };

  return (
    <div className="">
      {title && (
        <h2 className="text-xl text-secondary font-bold mb-8">{title}</h2>
      )}
      <div className="space-y-4">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <div
              key={index}
              className={`overflow-hidden ${
                index !== slides.length - 1 ? "border-b-2" : ""
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between py-4 text-left bg-white transition-colors"
              >
                <h3 className="text-xl font-medium">{slide.title}</h3>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    activeIndices.includes(index) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndices.includes(index)
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="py-4 prose max-w-none [&_p]:whitespace-pre-wrap [&_p]:break-words [&_p]:mb-0 [&_p+p]:mt-6 [&_strong]:inline [&_a]:inline [&_u]:inline">
                  {renderContent(slide.content)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No content available</p>
        )}
      </div>
    </div>
  );
};

export default ContentSlider;
