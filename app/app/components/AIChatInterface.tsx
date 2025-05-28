"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  highlightArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface AIChatInterfaceProps {
  onHighlight?: (
    area: { x: number; y: number; width: number; height: number } | null
  ) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const AIChatInterface = ({
  onHighlight,
  isMinimized,
  onToggleMinimize,
}: AIChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm here to help you fill out your forms. I've analyzed your documents and I have a few questions. Let's start with your personal information - can you confirm your full legal name as it appears on your passport?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponses = [
          "Perfect! I can see that matches your passport. Now, looking at your I-94 document, I need to verify your date of entry. Can you see the admission date highlighted in the document?",
          "Great! I've found your address in the uploaded documents. However, I need to confirm - is this your current residential address or do you have a different address where you currently live?",
          "Excellent! Now I'm looking at your employment information. I can see your current employer, but I need to know your exact job title and start date. Can you provide those details?",
          "Thank you! I'm now reviewing your educational background. I can see your diploma, but I need to confirm the exact graduation date and degree title for the form.",
        ];

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date(),
          highlightArea:
            Math.random() > 0.5
              ? {
                  x: Math.random() * 200,
                  y: Math.random() * 200,
                  width: 150 + Math.random() * 100,
                  height: 30 + Math.random() * 20,
                }
              : undefined,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);

        // Trigger highlight if provided
        if (aiMessage.highlightArea && onHighlight) {
          onHighlight(aiMessage.highlightArea);
        }
      },
      1000 + Math.random() * 2000
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggleMinimize}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4L5 20l.94-5.66A8.003 8.003 0 013 12a8.003 8.003 0 018-8c4.418 0 8 3.582 8 8z"
            />
          </svg>
          <span className="text-sm font-medium">Skiplegal</span>
          {messages.length > 1 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length - 1}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div> */}
          <div>
            <h3 className="font-semibold text-gray-800">Skiplegal AI</h3>
          </div>
        </div>
        {/* Replace SVG button with Lucide icon */}
        <ChevronDown
          onClick={onToggleMinimize}
          className="w-7 h-7 text-black cursor-pointer hover:bg-gray-200 rounded-lg p-1 transition-colors"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                message.type === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-12"
                  : "bg-white border border-gray-200 text-gray-800 mr-12 shadow-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span
                className={`text-xs mt-2 block ${
                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 shadow-md mr-12">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-500 shadow-sm transition-all duration-200"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Press Enter to send • Skiplegal will highlight relevant sections in
          your documents
        </p>
      </div>
    </div>
  );
};

export default AIChatInterface;
