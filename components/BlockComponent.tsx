/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback } from "react";
import RichTextRenderer from "./RichTextRenderer";
import { chatStore } from "@/lib/chatStore";
import { logUserEvent } from "@/lib/logger";

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
    try {
      logUserEvent("chat_start", {
        chatbotQuestion: question,
        buttonType: "chat",
        source: "block-component",
      });
      chatStore.sendMessage(question);
    } catch (error) {
      console.error("Failed to log chat event:", error);
      chatStore.sendMessage(question);
    }
  }, []);

  const renderButton = (button: CTAButton, index: number) => {
    const baseStyles =
      "inline-block px-6 py-1.5 md:px-12 md:py-2 text-sm md:text-base rounded-md transition-all cursor-pointer";
    const darkStyle =
      "bg-white text-primary border-2 border-primary  hover:bg-primary hover:text-white";
    const lightStyle =
      "bg-primary text-white border-2 border-primary hover:bg-white hover:text-primary";

    const buttonStyle = index === 0 ? darkStyle : lightStyle;

    switch (button.buttonType) {
      case "call":
        return (
          <div className="group relative">
            <a
              href={`tel:${button.link}`}
              className={`${baseStyles} ${buttonStyle}`}
              onClick={async () => {
                try {
                  await logUserEvent("call_click", {
                    phoneNumber: button.link,
                    buttonType: "call",
                    source: "block-component",
                  });
                } catch (error) {
                  console.error("Failed to log call event:", error);
                }
              }}
            >
              {button.text}
            </a>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block">
              <div className="bg-white shadow-lg rounded-md p-3 whitespace-nowrap border border-gray-200">
                <p className="text-primary text-sm">
                  Call Us @ 844-4-SKIPLEGAL (844-475-4753)
                </p>
              </div>
            </div>
          </div>
        );
      case "chat":
        return (
          <button
            type="button"
            onClick={() => {
              if (button.chatbotQuestion) {
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
        <div className="w-full md:w-1/2 max-md:h-[200px] relative">
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
