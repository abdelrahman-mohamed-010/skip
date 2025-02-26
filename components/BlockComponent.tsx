/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback } from "react";
import RichTextRenderer from "./RichTextRenderer";
import { chatStore } from "@/lib/chatStore";

interface SideImage {
  asset: {
    url: string;
  };
  alt?: string;
}

interface CTAButton {
  text: string;
  link?: string;
  buttonType: "normal" | "call" | "chat";
  chatbotQuestion?: string;
}

interface BlockComponentProps {
  title?: string;
  sideImage?: SideImage;
  content: any;
  cta?: CTAButton[]; // Make sure this matches the Sanity schema
  reverse?: boolean;
}

export default function BlockComponent({
  title,
  sideImage,
  content,
  cta,
  reverse = false,
}: BlockComponentProps) {
  const handleQuestionClick = useCallback((question: string) => {
    console.log("Sending question:", question); // Debug log
    chatStore.sendMessage(question);
  }, []);

  const renderButton = (button: CTAButton, index: number) => {
    const baseStyles =
      "inline-block px-12 py-2 rounded-md transition-all cursor-pointer";
    const darkStyle =
      "bg-primary text-white border-2 border-primary hover:bg-primary/90";
    const lightStyle =
      "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white";

    // Use style based on index position
    const buttonStyle = index === 0 ? darkStyle : lightStyle;

    switch (button.buttonType) {
      case "call":
        return (
          <a
            href={`tel:${button.link}`}
            className={`${baseStyles} ${buttonStyle}`}
          >
            {button.text}
          </a>
        );
      case "chat":
        return (
          <button
            type="button"
            onClick={() => {
              if (button.chatbotQuestion) {
                console.log("Button clicked:", button.chatbotQuestion); // Debug log
                handleQuestionClick(button.chatbotQuestion);
              }
            }}
            className={`${baseStyles} ${buttonStyle}`}
          >
            {button.text}
          </button>
        );
      default:
        return (
          <a href={button.link} className={`${baseStyles} ${buttonStyle}`}>
            {button.text}
          </a>
        );
    }
  };

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
                <React.Fragment key={btnIndex}>
                  {renderButton(button, btnIndex)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
