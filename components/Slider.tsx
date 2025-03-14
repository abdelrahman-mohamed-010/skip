/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import RichTextRenderer from "./RichTextRenderer";

interface FAQProps {
  title?: string;
  faqs?: {
    question: string;
    answer: any[];
  }[];
}

export default function Slider({ title, faqs = [] }: FAQProps) {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleIndex = (index: number) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 text-gray-700">
      {title && (
        <h2 className="text-3xl font-bold mb-8 text-primary">{title}</h2>
      )}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4  text-left flex justify-between items-center bg-white hover:bg-gray-50"
              onClick={() => toggleIndex(index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  activeIndices.includes(index) ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeIndices.includes(index) && (
              <div className="px-6 py-4 pt-2 bg-gray-50">
                <div className="prose max-w-none">
                  <RichTextRenderer content={faq.answer} alignment="left" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
