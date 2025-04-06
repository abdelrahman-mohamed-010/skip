import CTAButton from "./CTAButton";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface RichTextRendererProps {
  content: any[];
  alignment?: string;
  minHeightClass?: string;
  responsibilities?: boolean;
}

export default function BlogRichText({
  content,
  alignment = "left",
  responsibilities = false,
}: RichTextRendererProps) {
  const allBlocks = content || [];

  return (
    <div className="max-sm:px-4">
      <div
        className={`prose max-w-none text-gray-700 [&_p]:whitespace-pre-wrap [&_p]:break-words [&_p]:mb-0 [&_p+p]:mt-6 [&_strong]:inline [&_strong]:text-gray-700 [&_a]:inline [&_u]:inline text-${alignment}`}
      >
        {allBlocks.map((block: any, blockIndex: number) => {
          if (block._type === "ctaButtons") {
            return (
              <div key={blockIndex} className="flex justify-center gap-4 my-12">
                <CTAButton
                  buttonType="call"
                  text="Call Us Now"
                  link={block.phoneNumber}
                />
                <CTAButton
                  buttonType="chat"
                  text="Ask a Question"
                  chatbotQuestion={block.chatQuestion}
                />
              </div>
            );
          }
          if (block._type === "image") {
            return (
              <div
                key={blockIndex}
                className="flex flex-col md:flex-row gap-8 my-8 items-stretch"
              >
                <div className="md:w-[35%] flex justify-center">
                  <img
                    src={block.asset?.url || block.imageUrl}
                    alt={block.alt || ""}
                    className="h-full rounded-lg object-cover"
                  />
                </div>
                <div className="md:w-[65%] flex flex-col">
                  {(block.description || []).map(
                    (descBlock: any, descIndex: number) => {
                      if (descBlock._type !== "block") return null;

                      if (descBlock.listItem === "bullet") {
                        return (
                          <ul key={descIndex} className="list-disc ml-6 mt-3">
                            <li className="mb-2">
                              {descBlock.children.map(
                                (span: any, spanIndex: number) => {
                                  const marks = span.marks || [];
                                  let text = span.text;
                                  if (marks.includes("strong")) {
                                    text = (
                                      <strong key={spanIndex}>{text}</strong>
                                    );
                                  }
                                  if (marks.includes("underline")) {
                                    text = <u key={spanIndex}>{text}</u>;
                                  }
                                  return text;
                                }
                              )}
                            </li>
                          </ul>
                        );
                      }

                      const Component =
                        descBlock.style === "normal" ? "p" : descBlock.style;
                      const className =
                        descBlock.style === "h1"
                          ? `text-4xl max-sm:text-2xl font-bold mb-8${responsibilities ? " mt-0" : ""} text-primary`
                          : descBlock.style === "h2"
                            ? `text-3xl max-sm:text-xl font-bold mb-6${responsibilities ? " mt-0" : ""} text-primary`
                            : descBlock.style === "h3"
                              ? `text-2xl max-sm:text-lg font-bold mb-5${responsibilities ? " mt-0" : ""} text-primary`
                              : descBlock.style === "h4"
                                ? `text-xl font-bold mb-4${responsibilities ? " mt-0" : ""}`
                                : descBlock.style === "h5"
                                  ? `text-lg font-bold mb-3${responsibilities ? " mt-0" : ""}`
                                  : "mb-4 leading-relaxed";

                      return (
                        <Component key={descIndex} className={className}>
                          {descBlock.children.map(
                            (span: any, spanIndex: number) => {
                              const marks = span.marks || [];
                              let text = span.text;
                              if (marks.includes("strong")) {
                                text = <strong key={spanIndex}>{text}</strong>;
                              }
                              if (marks.includes("underline")) {
                                text = <u key={spanIndex}>{text}</u>;
                              }
                              return text;
                            }
                          )}
                        </Component>
                      );
                    }
                  )}
                </div>
              </div>
            );
          }

          if (block._type === "block") {
            if (block.listItem === "bullet") {
              const bulletLevelClass =
                block.level === 2
                  ? "ml-10"
                  : block.level === 3
                    ? "ml-14"
                    : "ml-6";
              const markerColorClass =
                block.level && block.level >= 2 ? "marker:text-black" : "";
              return (
                <ul
                  key={blockIndex}
                  className={`list-disc ${bulletLevelClass} mt-3 text-gray-700 ${markerColorClass}`}
                >
                  <li className="mb-2">
                    {block.children.map((span: any, spanIndex: number) => {
                      const marks = span.marks || [];
                      let text = span.text;

                      const linkMark = span.marks?.find((mark: string) =>
                        block.markDefs?.find(
                          (def: any) =>
                            def._key === mark && def._type === "link"
                        )
                      );

                      const linkDef = linkMark
                        ? block.markDefs.find(
                            (def: any) => def._key === linkMark
                          )
                        : null;

                      if (linkDef) {
                        const isInternal = linkDef.href
                          ? linkDef.href.startsWith("/")
                          : false;
                        const target = linkDef.openInNewTab
                          ? "_blank"
                          : undefined;
                        const rel = linkDef.openInNewTab
                          ? "noopener noreferrer"
                          : undefined;

                        return isInternal ? (
                          <Link
                            key={spanIndex}
                            href={linkDef.href || "#"}
                            className="text-primary underline hover:underline transition-all"
                            target={target}
                            rel={rel}
                          >
                            {text}
                          </Link>
                        ) : (
                          <a
                            key={spanIndex}
                            href={linkDef.href || "#"}
                            target={target}
                            rel={rel}
                            className="text-primary underline hover:underline transition-all"
                          >
                            {text}
                          </a>
                        );
                      }
                      if (marks.includes("strong"))
                        text = <strong key={spanIndex}>{text}</strong>;
                      if (marks.includes("underline"))
                        text = <u key={spanIndex}>{text}</u>;
                      return text;
                    })}
                  </li>
                </ul>
              );
            }

            if (block.listItem === "number") {
              if (block._processedInList) return null;

              const currentIndex = allBlocks.indexOf(block);
              const listItems = [];

              for (let i = currentIndex; i < allBlocks.length; i++) {
                const currentBlock = allBlocks[i];
                if (currentBlock.listItem !== "number") break;

                currentBlock._processedInList = true;
                listItems.push({
                  children: currentBlock.children,
                  markDefs: currentBlock.markDefs,
                });
              }

              return (
                <ol
                  key={blockIndex}
                  className="list-decimal mt-2 ml-6 [&>li]:pl-2 [&>li::marker]:text-primary [&>li::marker]:font-bold"
                >
                  {listItems.map((item: any, itemIndex: number) => (
                    <li key={itemIndex} className="mb-2">
                      {item.children.map((span: any, spanIndex: number) => {
                        const marks = span.marks || [];
                        let text = span.text;

                        const linkMark = span.marks?.find((mark: string) =>
                          item.markDefs?.find(
                            (def: any) =>
                              def._key === mark && def._type === "link"
                          )
                        );

                        const linkDef = linkMark
                          ? item.markDefs.find(
                              (def: any) => def._key === linkMark
                            )
                          : null;

                        if (linkDef) {
                          const isInternal = linkDef.href
                            ? linkDef.href.startsWith("/")
                            : false;
                          const target = linkDef.openInNewTab
                            ? "_blank"
                            : undefined;
                          const rel = linkDef.openInNewTab
                            ? "noopener noreferrer"
                            : undefined;

                          return isInternal ? (
                            <Link
                              key={spanIndex}
                              href={linkDef.href || "#"}
                              className="text-primary underline hover:underline transition-all"
                              target={target}
                              rel={rel}
                            >
                              {text}
                            </Link>
                          ) : (
                            <a
                              key={spanIndex}
                              href={linkDef.href || "#"}
                              target={target}
                              rel={rel}
                              className="text-primary underline hover:underline transition-all"
                            >
                              {text}
                            </a>
                          );
                        }
                        if (marks.includes("strong"))
                          text = <strong key={spanIndex}>{text}</strong>;
                        if (marks.includes("underline"))
                          text = <u key={spanIndex}>{text}</u>;
                        return text;
                      })}
                    </li>
                  ))}
                </ol>
              );
            }

            if (!block.listItem) {
              const Component =
                block.style === "normal"
                  ? "p"
                  : block.style === "h1"
                    ? "h2"
                    : block.style;
              return (
                <Component
                  key={blockIndex}
                  className={`text-${alignment} ${
                    block.style === "h1"
                      ? `text-4xl max-sm:text-2xl font-bold mb-8 ${responsibilities ? "mt-0" : "mt-4"} text-primary`
                      : block.style === "h2"
                        ? `text-3xl max-sm:text-xl font-bold mb-6 ${responsibilities ? "mt-0" : "mt-8"} text-primary`
                        : block.style === "h3"
                          ? `text-2xl max-sm:text-lg font-bold mb-5 ${responsibilities ? "mt-0" : "mt-8"} text-primary`
                          : block.style === "h4"
                            ? `text-xl max-sm:text-base font-bold mb-5 ${responsibilities ? "mt-0" : "mt-8"} text-primary`
                            : block.style === "h5"
                              ? `text-lg max-sm:text-sm font-bold mb-4 ${responsibilities ? "mt-0" : "mt-8"} text-primary`
                              : "leading-relaxed max-sm:text-sm text-gray-700"
                  }`}
                >
                  {block.children.map((span: any, spanIndex: number) => {
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
                      const isInternal = linkDef.href
                        ? linkDef.href.startsWith("/")
                        : false;
                      const target = linkDef.openInNewTab
                        ? "_blank"
                        : undefined;
                      const rel = linkDef.openInNewTab
                        ? "noopener noreferrer"
                        : undefined;

                      return isInternal ? (
                        <Link
                          key={spanIndex}
                          href={linkDef.href || "#"}
                          className="text-primary underline hover:underline transition-all"
                          target={target}
                          rel={rel}
                        >
                          {text}
                        </Link>
                      ) : (
                        <a
                          key={spanIndex}
                          href={linkDef.href || "#"}
                          className="text-primary underline hover:underline transition-all"
                          target={target}
                          rel={rel}
                        >
                          {text}
                        </a>
                      );
                    }
                    if (marks.includes("strong"))
                      text = <strong key={spanIndex}>{text}</strong>;
                    if (marks.includes("underline"))
                      text = <u key={spanIndex}>{text}</u>;
                    return text;
                  })}
                </Component>
              );
            }
          }
        })}
      </div>
    </div>
  );
}
