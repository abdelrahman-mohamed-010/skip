"use client";

import { SendHorizontal, Paperclip } from "lucide-react"; // changed to FileUp
import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const LawyerBot = () => {
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

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response with better legal responses
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: getLegalResponse(content),
        },
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

  // New file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      // TODO: Implement file upload backend integration
    }
  };

  return (
    <div className="relative rounded-2xl bg-white/80 backdrop-blur-md p-4 max-sm:p-3 shadow-lg border border-primary/10">
      <div className="space-y-4 mb-4 min-h-[240px] max-sm:min-h-[150px] max-h-[240px] max-sm:max-h-[150px] overflow-y-auto p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {message.role === "ai" ? "AI" : "Y"}
              </span>
            </div>
            <div
              className={`rounded-lg p-3 text-left max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary/20 text-primary"
                  : "bg-primary/5"
              }`}
            >
              <p className="text-sm max-sm:text-xs">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">AI</span>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-left">
              <p className="text-sm max-sm:text-xs text-gray-700">Typing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
          placeholder="Type your immigration question..."
          className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl bg-white border border-primary/20 focus:outline-none focus:border-primary/50 pr-24 max-sm:text-sm" // increased right padding
        />
        <div className="absolute right-2 flex items-center gap-1">
          <button
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
            className="p-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={isLoading}
            className="p-2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
        <input
          id="file-upload-input"
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Optionally display uploaded file name */}
      {fileName && (
        <div className="mt-2 text-sm text-gray-500">
          Uploaded file: {fileName}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3 justify-center max-sm:gap-1.5">
        {["Visa requirements", "Green card process", "Processing times"].map(
          (question) => (
            <button
              key={question}
              onClick={() => handleSuggestedQuestion(question)}
              disabled={isLoading}
              className="text-xs max-sm:text-[10px] px-3 py-1.5 max-sm:py-1 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default LawyerBot;
