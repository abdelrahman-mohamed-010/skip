/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

declare global {
  interface Window {
    $crisp: any;
  }
}

import React, { useCallback } from "react";
import { chatStore } from "@/lib/chatStore";

interface CTAButtonProps {
  buttonType: string;
  text: string;
  link?: string;
  chatbotQuestion?: string;
}

export default function CTAButton({
  buttonType,
  text,
  link,
  chatbotQuestion,
}: CTAButtonProps) {
  const handleQuestionClick = useCallback((question: string) => {
    console.log("Sending question:", question); // Debug log
    chatStore.sendMessage(question);
  }, []);

  const baseStyles =
    "inline-block px-6 py-1.5 md:px-12 md:py-2 text-sm md:text-base rounded-full transition-all cursor-pointer";
  const buttonStyle =
    "bg-primary text-white border-2  border-primary hover:bg-white hover:text-primary";

  switch (buttonType) {
    case "call":
      return (
        <div className="group relative inline-block">
          <a
            href={`tel:${link}`}
            className={`${baseStyles} ${buttonStyle} inline-flex items-center gap-2`}
          >
            {text}
          </a>
          <div className="absolute left-0 right-0 top-full mt-2 hidden group-hover:block w-max">
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
            if (chatbotQuestion) {
              console.log("Button clicked:", chatbotQuestion); // Debug log
              handleQuestionClick(chatbotQuestion);
            }
          }}
          className={`${baseStyles} ${buttonStyle}`}
        >
          {text}
        </button>
      );

    default:
      return (
        <a href={link} className={`${baseStyles} ${buttonStyle}`}>
          {text}
        </a>
      );
  }
}
