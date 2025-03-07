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
  buttonType: "call" | "chat";
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
  const handleQuestionClick = useCallback(() => {
    chatStore.sendMessage(chatbotQuestion || "Hi, I have a question");
  }, [chatbotQuestion]);

  const baseStyles =
    "inline-block px-6  md:px-12 text-sm md:text-base rounded-full transition-all cursor-pointer bg-primary text-white border-2 border-primary hover:bg-white hover:text-primary h-[40px] md:h-[44px] flex items-center justify-center";

  if (buttonType === "call") {
    return (
      <div className="group relative inline-block py-2.5">
        <a
          href={`tel:${link}`}
          className={`${baseStyles} inline-flex  py-3 items-center gap-2`}
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
  }

  return (
    <button
      type="button"
      onClick={handleQuestionClick}
      className="px-6  md:px-12 text-sm md:text-base rounded-full transition-all cursor-pointer bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white h-[40px] md:h-[44px] flex items-center justify-center"
    >
      {text}
    </button>
  );
}
