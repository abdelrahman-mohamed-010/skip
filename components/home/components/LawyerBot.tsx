"use client";

import { SendHorizontal, Paperclip, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
}

const LawyerBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome! I'm SkipGenius your AI search assistant specializing in U.S. immigration. How may I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isLoaded, userId } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = isLoaded && userId;

  // Load message count from localStorage when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      const storedCount = localStorage.getItem("userMessageCount");
      if (storedCount) {
        setUserMessageCount(parseInt(storedCount, 10));
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Check if user is authenticated or has messages remaining
    if (!isAuthenticated && userMessageCount >= 0) {
      setShowAuthPrompt(true);
      // Show authentication prompt instead of redirecting
      return;
    }

    // Create updated messages array with new user message
    const updatedMessages = [...messages, { role: "user" as const, content }];

    // Update the messages state
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    // Increment message count for unauthenticated users
    if (!isAuthenticated) {
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      localStorage.setItem("userMessageCount", newCount.toString());

      // Show auth prompt if this was the 3rd message
      if (newCount >= 0) {
        setShowAuthPrompt(true);
        console.log("Auth limit reached after increment, showing auth prompt");
      }
    }

    try {
      // Convert messages to the format expected by the API
      const chatHistory = updatedMessages.map((msg) => ({
        type: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // Determine the correct URL to use - include port in development
      const host =
        window.location.hostname === "localhost" ? window.location.origin : "";

      const apiUrl = `${host}/api/chat`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          chatHistory: chatHistory,
          pageName:
            window.location.pathname.split("/").filter(Boolean)[0] ||
            "immigration",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API error:", errorText);
        throw new Error(`Chat API error: ${response.status} - ${errorText}`);
      }

      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let responseText = "";

      // Use a temporary variable to build the response
      setMessages((prev) => [...prev, { role: "ai" as const, content: "" }]);

      let streamingStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream completed");
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
                streamingStarted = true;

                // Update the AI message with the accumulated response text
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "ai" as const,
                    content: responseText,
                  };
                  return updated;
                });
              }

              if (parsed.error) {
                console.error("Error in stream:", parsed.error);
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, "Raw data:", data);
            }
          }
        }
      }

      if (!streamingStarted) {
        console.error("No streaming content was received from the API");
        throw new Error("No content received from the API");
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai" as const,
          content:
            "I'm sorry, but I encountered an error while processing your request. Please try again later.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      // TODO: Implement file upload backend integration
    }
  };

  return (
    <div className="relative rounded-2xl text-gray-700 bg-white/80 backdrop-blur-md p-4 max-sm:p-3 shadow-lg border border-primary/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Removed "Legal Assistant" text */}
        </div>
      </div>
      <div
        ref={messagesContainerRef}
        className="space-y-4 mb-4 min-h-[240px] max-sm:min-h-[240px] max-h-[240px] max-sm:max-h-[240px] overflow-y-auto p-2"
      >
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
              className={`rounded-lg p-3 text-left max-w-[95%] ${
                message.role === "user"
                  ? "bg-primary/20 text-primary"
                  : "bg-primary/5"
              }`}
            >
              {message.role === "ai" ? (
                <div className="prose prose-sm max-sm:prose-xs prose-p:my-1 prose-headings:mb-1 prose-headings:mt-2 prose-li:my-0.5 prose-pre:max-w-full max-w-full">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm max-sm:text-xs">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">AI</span>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-left">
              <div className="prose prose-sm max-sm:prose-xs">
                <p className="text-gray-700 my-0">Typing...</p>
              </div>
            </div>
          </div>
        )}

        {showAuthPrompt && !isAuthenticated && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">AI</span>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-left">
              <div className="prose prose-sm max-sm:prose-xs">
                <p className="my-1 text-gray-700">
                  You&apos;ve reached the maximum number of messages for today.
                  Please sign in to continue our conversation.
                </p>
              </div>
              <div className="flex space-x-2 mt-2">
                <SignInButton mode="modal">
                  <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <LogIn className="w-3 h-3" />
                    <span>Sign in</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    <span>Sign up</span>
                  </button>
                </SignUpButton>
              </div>
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
          placeholder={
            !isAuthenticated && userMessageCount >= 0
              ? "Sign in to continue..."
              : "Type your immigration question..."
          }
          className="w-full px-4 max-sm:px-3 py-3 max-sm:py-2 rounded-xl bg-white border border-primary/20 focus:outline-none focus:border-primary/50 pr-24 max-sm:text-sm"
          disabled={!isAuthenticated && userMessageCount >= 0}
        />
        <div className="absolute right-2 flex items-center gap-1">
          <button
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
            className="p-2 text-primary hover:text-primary/80 transition-colors"
            disabled={!isAuthenticated && userMessageCount >= 0}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={isLoading || (!isAuthenticated && userMessageCount >= 0)}
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

      {fileName && (
        <div className="mt-2 text-sm text-gray-500">
          Uploaded file: {fileName}
        </div>
      )}

      {!isAuthenticated && !showAuthPrompt && (
        <div className="mt-1.5 text-xs text-gray-500">
          {userMessageCount >= 0
            ? "Login to continue for free"
            : `${0 - userMessageCount} messages remaining. Login to continue for free`}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3 justify-center max-sm:gap-1.5">
        {["Visa requirements", "Green card process", "Processing times"].map(
          (question) => (
            <button
              key={question}
              onClick={() => handleSuggestedQuestion(question)}
              disabled={
                isLoading || (!isAuthenticated && userMessageCount >= 0)
              }
              className="text-xs max-sm:text-[11px] px-3 py-1.5 max-sm:py-1 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          )
        )}
      </div>

      {/* Fixed disclaimer at the bottom */}
      <div className="mt-3 pt-2 border-t border-primary/10">
        <p className="text-xs text-gray-600 italic">
          <span className="font-medium text-primary">Disclaimer:</span> Please
          note that this information is general in nature and does not
          constitute legal advice.{" "}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Read full terms here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LawyerBot;
