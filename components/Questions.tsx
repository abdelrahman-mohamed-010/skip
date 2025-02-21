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
    <div className="py-8 md:py-16  px-4 bg-gradient-to-br from-primary/5 via-white to-gray-50 relative">
      <div className="absolute inset-0 opacity-[0.03] background-pattern"></div>
      <div className="max-w-[1260px] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl relative overflow-hidden
                        border border-gray-100/50 hover:border-primary/30
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-primary/10 before:to-primary/5
                        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                        transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary/10
                        animate-float cursor-pointer"
            >
              <div className="flex flex-col h-full justify-between gap-3 md:gap-6">
                <div>
                  <div
                    className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 rounded-lg md:rounded-xl 
                                bg-gradient-to-br from-primary/20 to-primary/10 
                                flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500"
                  >
                    {React.createElement(getIcon(q.icon || "help-circle"), {
                      className:
                        "w-4 h-4 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-all duration-500",
                    })}
                  </div>
                  <h3
                    className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 
                               group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  >
                    {q.question}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700">
                    {q.description}
                  </p>
                </div>
                <button
                  onClick={() => handleQuestionClick(q.chatbotQuestion)}
                  className="w-full bg-white text-primary border-2 z-20 cursor-pointer
                           hover:text-white hover:bg-primary border-primary 
                           py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl
                           transition-all duration-300 ease-out
                           text-xs md:text-sm font-semibold 
                           shadow-sm hover:shadow-lg hover:shadow-primary/25
                           transform group-hover:translate-y-[-2px]"
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
