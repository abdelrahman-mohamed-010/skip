"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [{ text: "Hello! How can I help you today?", isUser: false }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message! Our team will get back to you soon.",
          isUser: false,
        },
      ]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-6 sm:right-6  ">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "hidden" : "flex"
        } items-center justify-center p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } flex-col bg-white rounded-2xl shadow-xl sm:w-96 w-full sm:h-[500px] h-screen fixed sm:relative sm:bottom-auto sm:right-auto bottom-0 right-0 transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-primary text-white sm:rounded-t-2xl">
          <h3 className="font-semibold">SkipLegal Assistant</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.isUser
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-primary/5 text-secondary rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-primary/10"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-xl border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-primary/5"
            />
            <button
              type="submit"
              className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
