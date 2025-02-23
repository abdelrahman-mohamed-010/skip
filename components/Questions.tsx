/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { chatStore } from "@/lib/chatStore";
import * as LucideIcons from "lucide-react";
import React from "react";

interface Question {
  question: string;
  description: string;
  buttonText: string;
  chatbotQuestion: string;
  icon: string;
}

interface QuestionsProps {
  questions?: Question[];
}

const Questions = ({ questions = [] }: QuestionsProps) => {
  const handleQuestionClick = (chatbotQuestion: string) => {
    chatStore.sendMessage(chatbotQuestion);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as Record<string, any>)[
      iconName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
    ];
    return Icon || LucideIcons.HelpCircle;
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="py-12 md:py-20 px-4 bg-white">
      <div className="max-w-[1260px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white relative rounded-2xl overflow-hidden
                        shadow-[0_2px_12px_rgba(0,0,0,0.08)]
                        hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                        transition-shadow duration-300
                        border border-gray-100"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70" />
              <div className="p-6">
                <div className="mb-5">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 
                                rounded-xl bg-primary/10 mb-4"
                  >
                    {React.createElement(getIcon(q.icon || "help-circle"), {
                      className: "w-6 h-6 text-primary",
                    })}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {q.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {q.description}
                  </p>
                </div>
                <button
                  onClick={() => handleQuestionClick(q.chatbotQuestion)}
                  className="w-full text-center px-5 py-3 text-sm font-semibold
                           bg-gray-50 text-primary border border-gray-200
                           hover:bg-primary hover:text-white hover:border-primary
                           rounded-xl transition-all duration-200"
                >
                  {q.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
