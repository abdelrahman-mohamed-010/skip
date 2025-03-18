import OpenAI from "openai";
import { getPromptConfig } from "@/utils/prompts";
import { log } from "@/lib/logger";
import { getClientIPInfo } from "@/lib/ipUtils";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Helper function to generate UUID compatible with Edge runtime
function generateUUID() {
  return crypto.randomUUID();
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.ANYTHINGLLM_KEY,
    baseURL: process.env.ANYTHINGLLM_URL,
});

// Modified interface for our chat format
interface CustomChatMessage {
  type: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

// Custom interface to support Google AI's role format
interface CustomChatCompletionMessageParam {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  chatHistory: CustomChatMessage[];
  pageName: string;
  conversationId?: string;
}

export async function POST(req: Request) {
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const encoder = new TextEncoder();
  
  try {
    const body = await req.json() as ChatRequestBody;
    const { message, chatHistory = [], pageName } = body;
    
    // Generate or use existing conversation ID using our helper function
    const conversationId = body.conversationId || generateUUID();
    
    // Get client IP from request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Get path from request URL
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Get geolocation info (handle as much as possible in Edge environment)
    let geoInfo = {};
    try {
      geoInfo = await getClientIPInfo(ip);
    } catch (error) {
      console.error('Failed to get IP geo information:', error);
    }
    
    // Ensure we log to console for immediate visibility
    console.log(`User message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
    
    // Log the user's message with proper truncation and enhanced metadata
    log('info', 'Chat API User Input', {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      fullMessage: message,
      pageName,
      conversationId,
      messageCount: chatHistory.length,
      ip,
      path,
      geoInfo: JSON.stringify(geoInfo), // Convert to string to avoid serialization issues
      userAgent: req.headers.get('user-agent') || 'unknown'
    });
    
    // Get the appropriate prompt config based on the page name
    const promptConfig = getPromptConfig(pageName);
    
    // Format messages for OpenAI API
    const messages: CustomChatCompletionMessageParam[] = [];
    let previousRole: string | null = null;
    
    // Add system prompt
    const systemMessage: CustomChatCompletionMessageParam = {
      role: "system",
      content: promptConfig.systemPrompt
    };
    messages.push(systemMessage);
    
    // Process chat history, avoiding consecutive messages with the same role
    chatHistory
      .filter((msg) => !msg.isLoading)
      .forEach((msg) => {
        const role = msg.type === "user" ? "user" : "assistant";
        if (role !== previousRole) {
          messages.push({
            role: role,
            content: msg.content,
          });
          previousRole = role;
        }
      });

    // Add current message if it's not duplicating the previous role
    if (previousRole !== "user") {
      messages.push({
        role: "user",
        content: message
      });
    }
    messages[1].role = "user";
    messages[1].content = "";
    
    const modelName = "immi";
    console.log(`Using model: ${modelName}`);
    console.log(`Message count: ${messages.length}`);
    
    // Set up streaming response
    const stream = new ReadableStream({
      async start(controller) {
        // Send an initial keepalive message to prevent "No streaming content" errors
        // controller.enqueue(
        //   encoder.encode(`data: ${JSON.stringify({ content: "" })}\n\n`)
        // );
        
        let hasReceivedContent = false;
        let responseContent = "";
        try {
          // Since we're using a custom API, we need to bypass TypeScript's strict typing
          // using a type assertion to 'unknown' first then to any for the API call
          const streamResponse = await openai.chat.completions.create({
            model: modelName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: messages as unknown as any, // Custom API requires this approach
            stream: true,
            temperature: promptConfig.temperature || 0.7,
          });
          
          for await (const part of streamResponse) {
            const content = part.choices[0]?.delta?.content || "";
            if (content) {
              hasReceivedContent = true;
              responseContent += content;
              const chunk = encoder.encode(
                `data: ${JSON.stringify({ content })}\n\n`
              );
              controller.enqueue(chunk);
            }
          }
          
          // If we didn't receive any content, send a fallback message
          if (!hasReceivedContent) {
            console.warn("No content received from LLM API");
            const fallbackMessage = "I'm sorry, I couldn't generate a response. Please try again.";
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: fallbackMessage })}\n\n`
              )
            );
            responseContent = fallbackMessage;
          }
          
          // Ensure we log both to console and to Grafana
          console.log(`Bot response: ${responseContent.substring(0, 500)}${responseContent.length > 500 ? '...' : ''}`);
          
          // Log the complete response for debugging with enhanced metadata
          log('info', 'Chat API Bot Response', {
            responseLength: responseContent.length,
            response: responseContent.substring(0, 500) + (responseContent.length > 500 ? '...' : ''),
            fullResponse: responseContent,
            modelName,
            conversationId,
            ip,
            path,
            geoInfo: JSON.stringify(geoInfo), // Convert to string to avoid serialization issues
            userAgent: req.headers.get('user-agent') || 'unknown'
          });
          
          // Add a mirrored log entry in the same format as user input for consistent Grafana logging
          log('info', 'Chat API Bot Output', {
            message: responseContent.substring(0, 100) + (responseContent.length > 100 ? '...' : ''),
            fullMessage: responseContent,
            pageName,
            conversationId,
            messageCount: chatHistory.length + 1,
            ip,
            path,
            geoInfo: JSON.stringify(geoInfo),
            userAgent: req.headers.get('user-agent') || 'unknown'
          });
          
          // Send the DONE signal and close the stream
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Error in streaming:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          // Ensure we log both to console and to Grafana
          console.log(`Error in chat API: ${errorMessage}`);
          
          log('error', 'Chat API Error', {
            error: errorMessage,
            type: error instanceof Error ? 
              ((error as unknown) as {type?: string}).type || "api_error" 
              : "unknown_error",
            conversationId,
            ip,
            path,
            geoInfo: JSON.stringify(geoInfo), // Convert to string to avoid serialization issues
            userAgent: req.headers.get('user-agent') || 'unknown'
          });
          
          // Send structured error response
          const errorData = {
            message: errorMessage,
            type: error instanceof Error ? 
              // Safely access potential 'type' property on error
              ((error as unknown) as {type?: string}).type || "api_error" 
              : "unknown_error"
          };
          
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: JSON.stringify(errorData) })}\n\n`
            )
          );
          
          // Always send DONE signal even in error case
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
      
      // Add cancellation support
      cancel() {
        console.log("Stream cancelled by client");
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Conversation-ID": conversationId
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
      }
    );
  }
} 