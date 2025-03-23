"use client";

import {
  MessageSquare,
  Phone as PhoneIcon,
  SendHorizontal,
  Paperclip,
  X,
  LogIn,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { chatStore } from "@/lib/chatStore";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { logUserEvent } from "@/lib/logger";
import logger from "@/lib/logger";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "ai";
  content: string;
}

const PageCTA = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome! I'm SkipGenius your AI assistant specializing in U.S. immigration. How may I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isLoaded, userId } = useAuth();

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

  useEffect(() => {
    const handleChatMessage = (message: string) => {
      setIsChatOpen(true);
      sendMessage(message);
    };

    chatStore.subscribe(handleChatMessage);
    return () => chatStore.unsubscribe(handleChatMessage);
  }, []);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    console.log("===== CHAT DEBUGGING START =====");
    console.log("User message:", content);
    console.log(
      "Current authentication state:",
      isAuthenticated ? "Authenticated" : "Not authenticated"
    );
    console.log("User message count:", userMessageCount);

    // Check if user is authenticated or has messages remaining
    if (!isAuthenticated && userMessageCount >= 3) {
      setShowAuthPrompt(true);
      console.log("Auth limit reached, showing auth prompt");
      // Show authentication prompt instead of redirecting
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content }]);
    setInputMessage("");
    setIsLoading(true);

    // Increment message count for unauthenticated users
    if (!isAuthenticated) {
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      localStorage.setItem("userMessageCount", newCount.toString());
      console.log("Updated user message count:", newCount);

      // Show auth prompt if this was the 3rd message
      if (newCount >= 3) {
        setShowAuthPrompt(true);
        console.log("Auth limit reached after increment, showing auth prompt");
      }
    }

    try {
      // Convert messages to the format expected by the API
      const chatHistory = messages.map((msg) => ({
        type: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      console.log("Sending message to API:", content);
      console.log("Chat history:", JSON.stringify(chatHistory));

      // Determine the correct URL to use - include port in development
      const host =
        window.location.hostname === "localhost" ? window.location.origin : "";

      const apiUrl = `${host}/api/chat`;

      console.log("Window location:", window.location.toString());
      console.log("Using API URL:", apiUrl);

      // Make the API call
      console.log("Initiating fetch to API");
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

      console.log("API response status:", response.status);
      console.log(
        "API response headers:",
        Object.fromEntries([...response.headers.entries()])
      );

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

      console.log("Starting to read response stream");
      const decoder = new TextDecoder();
      let responseText = "";

      // Use a temporary variable to build the response
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      console.log("Created empty AI response message");

      let streamingStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream completed");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", chunk);

        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data === "[DONE]") {
              console.log("Received DONE signal");
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                responseText += parsed.content;
                streamingStarted = true;
                console.log("Updated response text:", responseText);

                // Update the AI message with the accumulated response text
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "ai",
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
          role: "ai",
          content:
            "I'm sorry, but I encountered an error while processing your request. Please try again later.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      console.log("===== CHAT DEBUGGING END =====");
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

  const handleCallAttorney = async () => {
    try {
      await logUserEvent("call_click", {
        phoneNumber: "+18444754753",
        source: "pageCTA",
        buttonType: "floating",
      });

      logger.info("Call button clicked", {
        phoneNumber: "+18444754753",
        source: "pageCTA",
        buttonType: "floating",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log call event:", error);
    }

    window.location.href = "tel:+18444754753";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 text-gray-700">
        <div className="group relative flex items-center">
          <div className="absolute right-[calc(100%+0.75rem)] bottom-1/2 translate-y-1/2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
              Chat with your AI immigration assistant
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 transform rotate-45 w-3 h-3 bg-gray-900"></div>
            </div>
          </div>
          <button
            ref={buttonRef}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-105"
            aria-label="Open chat"
          >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="group relative flex items-center">
          <div className="absolute right-[calc(100%+0.75rem)] bottom-1/2 translate-y-1/2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
              Call 844-4-SKIPLEGAL (844-475-4753)
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 transform rotate-45 w-3 h-3 bg-gray-900"></div>
            </div>
          </div>
          <button
            onClick={handleCallAttorney}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            <PhoneIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
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
              <div className="flex items-center gap-2">
                {/* Removed "Legal Assistant" text */}
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-primary/10 rounded-full"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-gray-700 ${
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
                    {message.role === "ai" ? (
                      <div className="prose prose-sm max-sm:prose-xs prose-p:my-1 prose-headings:mb-1 prose-headings:mt-2 prose-li:my-0.5">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
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
                    <div className="prose prose-sm max-sm:prose-xs">
                      <p className="text-gray-700 my-0">Typing...</p>
                    </div>
                  </div>
                </div>
              )}

              {showAuthPrompt && !isAuthenticated && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      AI
                    </span>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 text-left">
                    <div className="prose prose-sm max-sm:prose-xs">
                      <p className="my-1 text-gray-700">
                        You&apos;ve reached the maximum number of messages for
                        today. Please sign in to continue our conversation.
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

            {/* Input Area */}
            <div className="p-4 border-t border-primary/10 ">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && sendMessage(inputMessage)
                  }
                  placeholder={
                    !isAuthenticated && userMessageCount >= 3
                      ? "Sign in to continue..."
                      : "Type your immigration question..."
                  }
                  className="w-full px-4 py-2.5 text-primary rounded-xl bg-white border border-primary/20 focus:outline-none focus:border-primary/50 pr-20 text-sm"
                  disabled={!isAuthenticated && userMessageCount >= 3}
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    onClick={() =>
                      document.getElementById("file-upload-input")?.click()
                    }
                    className="p-1.5 text-primary hover:text-primary/80 transition-colors"
                    disabled={!isAuthenticated && userMessageCount >= 3}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={
                      isLoading || (!isAuthenticated && userMessageCount >= 3)
                    }
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

              {!isAuthenticated && !showAuthPrompt && (
                <div className="mt-1.5 text-xs text-gray-500">
                  {userMessageCount >= 3
                    ? "You've reached your limit of messages. Login to continue for free"
                    : `${3 - userMessageCount} messages remaining. Login to continue for free`}
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
                    disabled={
                      isLoading || (!isAuthenticated && userMessageCount >= 3)
                    }
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              {/* Fixed disclaimer at the bottom */}
              <div className="mt-3 pt-2 border-t border-primary/10">
                <p className="text-xs text-gray-600 italic">
                  <span className="font-medium text-primary">Disclaimer:</span>{" "}
                  Please note that this information is general in nature and
                  does not constitute legal advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageCTA;
