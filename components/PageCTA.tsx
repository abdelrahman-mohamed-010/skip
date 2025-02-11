"use client";

import {
  MessageSquare,
  Phone,
  SendHorizontal,
  Paperclip,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const PageCTA = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome! I'm your legal assistant specializing in U.S. immigration law. How may I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getLegalResponse = (question: string) => {
    const responses: { [key: string]: string } = {
      "Visa requirements":
        "To apply for a U.S. visa, you'll need: a valid passport, completed DS-160 form, application fee payment, and supporting documents specific to your visa type. Would you like me to explain more about a specific visa category?",
      "Green card process":
        "The green card process typically involves filing Form I-485 (Adjustment of Status) or going through consular processing. The requirements vary based on your eligibility category. What specific aspect would you like to learn more about?",
      "Processing times":
        "Current USCIS processing times vary by form type and service center. I can help you check the processing time for your specific application. Which form are you interested in?",
    };
    return (
      responses[question] ||
      `Let me help you understand more about ${question}.`
    );
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: getLegalResponse(content) },
      ]);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleCallAttorney = () => {
    window.location.href = "tel:+1234567890";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <button
          ref={buttonRef}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={handleCallAttorney}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-105"
        >
          <Phone className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {isChatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[420px] lg:w-[450px] z-50 transition-all duration-300 animate-slideIn"
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div className="relative h-[85vh] md:h-[600px] rounded-t-2xl md:rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-primary/10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <h3 className="font-semibold text-primary">Legal Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-primary/10 rounded-full"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">
                      {message.role === "ai" ? "AI" : "Y"}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg p-3 text-left max-w-[85%] ${
                      message.role === "user"
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/5"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      AI
                    </span>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-left">
                    <p className="text-sm text-gray-700">Typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-primary/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && sendMessage(inputMessage)
                  }
                  placeholder="Type your immigration question..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-primary/20 focus:outline-none focus:border-primary/50 pr-20 text-sm"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    onClick={() =>
                      document.getElementById("file-upload-input")?.click()
                    }
                    className="p-1.5 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading}
                    className="p-1.5 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <input
                  id="file-upload-input"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {fileName && (
                <div className="mt-2 text-xs text-gray-500">
                  Uploaded file: {fileName}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Visa requirements",
                  "Green card process",
                  "Processing times",
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageCTA;
