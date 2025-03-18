"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { usePathname } from "next/navigation";

interface ChatMessage {
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hello! How can I help you with your immigration questions today?", isUser: false }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";
  
  // For debugging
  useEffect(() => {
    console.log("ChatBot component initialized");
    console.log("Current pathname:", pathname);
  }, [pathname]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Get the current page name from the URL to use for context
  const getPageName = () => {
    const path = pathname.split("/").filter(Boolean);
    return path.length > 0 ? path[0] : "immigration";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isStreaming) return;

    // Add user message
    const userMessage = { text: message, isUser: true };
    const loadingMessage = { 
      text: "", 
      isUser: false, 
      isLoading: true 
    };
    
    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    const currentMessage = message; // Store current message before clearing input
    setMessage("");
    setIsStreaming(true);

    try {
      // Create a clean copy of messages without loading state for API
      const chatHistory = messages
        .filter(msg => !msg.isLoading)
        .map(({ text, isUser }) => ({ 
          type: isUser ? "user" : "assistant", 
          content: text 
      }));
      
      // For testing, use explicit URL with port 3001
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/chat'
        : '/api/chat';
      
      
      // Send request to API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          chatHistory,
          pageName: getPageName(),
        }),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");
      
      const decoder = new TextDecoder();
      let responseText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                responseText += parsed.content;
                
                // Update the loading message with current text
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    text: responseText,
                    isUser: false,
                  };
                  return updated;
                });
              }
              
              if (parsed.error) {
                console.error("Error in stream data:", parsed.error);
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, "Raw data:", data);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      
      // Update the loading message with error text
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          text: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
          isUser: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "hidden" : "flex"
        } items-center justify-center p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200`}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } flex-col bg-white rounded-2xl shadow-xl sm:w-96 w-full sm:h-[500px] h-screen fixed sm:relative sm:bottom-auto sm:right-auto bottom-0 right-0 transition-all duration-300 animate-fadeIn`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-primary text-white sm:rounded-t-2xl">
          <h3 className="font-semibold">SkipLegal Assistant</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close chat"
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
                {msg.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={isStreaming}
              className={`p-2 ${isStreaming ? 'bg-gray-400' : 'bg-primary'} text-white rounded-xl hover:bg-primary/90 transition-colors`}
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
