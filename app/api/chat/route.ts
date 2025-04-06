import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { CoreMessage, CoreUserMessage, CoreSystemMessage, CoreAssistantMessage } from 'ai';
import { getPromptConfig } from "@/utils/prompts";
import { log } from "@/lib/logger";
import { getClientIPInfo } from "@/lib/ipUtils";
import { auth, currentUser } from '@clerk/nextjs/server';

// Define interface for web search sources
interface WebSearchSource {
  url: string;
  title?: string;
  text?: string;
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Helper function to generate UUID compatible with Edge runtime
function generateUUID() {
  return crypto.randomUUID();
}

// Modified interface for our chat format
interface CustomChatMessage {
  type: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

interface ChatRequestBody {
  message: string;
  chatHistory: CustomChatMessage[];
  pageName: string;
  conversationId?: string;
}

export async function POST(req: Request) {
  // Get user information from Clerk
  const { userId } = await auth();
  const user = await currentUser();
  const userInfo = user ? 
    { 
      userId,
      userEmail: user.emailAddresses[0]?.emailAddress || 'no-email'
    } : 
    { userId: 'anonymous', userEmail: 'anonymous' };
  
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
      ...userInfo,
      geoInfo: JSON.stringify(geoInfo),
      ip,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      fullMessage: message,
      pageName,
      conversationId,
      messageCount: chatHistory.length,
      path,
      userAgent: req.headers.get('user-agent') || 'unknown'
    });
    
    // Get the appropriate prompt config based on the page name
    const promptConfig = getPromptConfig(pageName);
    
    // Format messages for AI SDK
    const formattedMessages: CoreMessage[] = [];
    
    // Add system prompt
    formattedMessages.push({
      role: "system",
      content: promptConfig.systemPrompt
    } as CoreSystemMessage);
    
    // Process chat history
    chatHistory
      .filter((msg) => !msg.isLoading)
      .forEach((msg) => {
        if (msg.type === "user") {
          formattedMessages.push({
            role: "user",
            content: msg.content
          } as CoreUserMessage);
        } else {
          formattedMessages.push({
            role: "assistant",
            content: msg.content
          } as CoreAssistantMessage);
        }
      });

    // Add current message
    formattedMessages.push({
      role: "user",
      content: message
    } as CoreUserMessage);
    
    // Determine the model to use
    const modelName = process.env.OPENAI_MODEL || "gpt-4o";
    console.log(`Using model: ${modelName}`);
    console.log(`Message count: ${formattedMessages.length}`);
    
    // Log web search tool info
    console.log(`Initializing stream with web search capability: web_search_preview tool enabled`);
    
    // Create a response using streamText from Vercel AI SDK
    const response = await streamText({
      model: openai.responses(modelName),
      messages: formattedMessages,
      temperature: promptConfig.temperature || 0.7,
      tools: {
        web_search_preview: openai.tools.webSearchPreview({
          searchContextSize: 'high'
        }),
      },
    });
    
    // Debug log for response object structure
    console.log(`Response object keys: ${Object.keys(response).join(', ')}`);
    console.log(`Response has 'sources' property: ${Object.prototype.hasOwnProperty.call(response, 'sources')}`);
    
    // Create a TransformStream to convert the AI SDK format to the format expected by the frontend
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    
    // Process the stream and convert it to the expected format
    (async () => {
      try {
        let accumulatedText = '';
        let webSources: WebSearchSource[] = [];
        let hasReceivedContent = false;
        
        // Process the text stream
        for await (const chunk of response.textStream) {
          if (chunk) {
            hasReceivedContent = true;
            accumulatedText += chunk;
            
            // Send the content in the format expected by the frontend
            const jsonLine = JSON.stringify({ content: chunk });
            writer.write(encoder.encode(`data: ${jsonLine}\n\n`));
          }
        }
        
        // If we didn't receive any content, send a fallback message
        if (!hasReceivedContent) {
          console.warn("No content received from LLM API");
          const fallbackMessage = "I'm sorry, I couldn't generate a response. Please try again.";
          writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ content: fallbackMessage })}\n\n`
            )
          );
          accumulatedText = fallbackMessage;
        }
        
        // Get sources from the final response
        const sources = await response.sources;
        // Debug log for sources received from API
        console.log(`Sources received from API: ${JSON.stringify(sources)}`);
        
        if (sources && sources.length > 0) {
          webSources = sources.map((source: WebSearchSource) => ({
            url: source.url,
            title: source.title || '',
            snippet: source.text || ''
          }));
          
          // Debug log for formatted sources
          console.log(`Formatted sources being sent to frontend: ${JSON.stringify(webSources)}`);
          
          // Send the sources in the format expected by the frontend
          const sourcesLine = JSON.stringify({ sources: webSources });
          console.log(`Sources data being written to stream: ${sourcesLine}`);
          writer.write(encoder.encode(`data: ${sourcesLine}\n\n`));
        } else {
          console.log('No sources received from API response');
        }
        
        // Ensure we log both to console and to logger
        console.log(`Bot response: ${accumulatedText.substring(0, 500)}${accumulatedText.length > 500 ? '...' : ''}`);
        
        // Log the complete response for debugging with enhanced metadata
        log('info', 'Chat API Bot Response', {
          ...userInfo,
          geoInfo: JSON.stringify(geoInfo),
          ip,
          responseLength: accumulatedText.length,
          response: accumulatedText.substring(0, 500) + (accumulatedText.length > 500 ? '...' : ''),
          fullResponse: accumulatedText,
          modelName,
          conversationId,
          path,
          hasSources: webSources.length > 0,
          sourceCount: webSources.length,
          userAgent: req.headers.get('user-agent') || 'unknown'
        });
        
        // Add a mirrored log entry in the same format as user input for consistent logging
        log('info', 'Chat API Bot Output', {
          ...userInfo,
          geoInfo: JSON.stringify(geoInfo),
          ip,
          message: accumulatedText.substring(0, 100) + (accumulatedText.length > 100 ? '...' : ''),
          fullMessage: accumulatedText,
          pageName,
          conversationId,
          messageCount: chatHistory.length + 1,
          path,
          userAgent: req.headers.get('user-agent') || 'unknown'
        });
        
        // Send the DONE signal and close the stream
        writer.write(encoder.encode("data: [DONE]\n\n"));
        writer.close();
      } catch (error) {
        console.error("Error in streaming:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // Check if error is related to sources extraction
        if (error instanceof Error && error.message && error.message.includes('sources')) {
          console.error("Error appears to be related to sources/citations handling:", error);
        }
        
        // Ensure we log both to console and to logger
        console.log(`Error in chat API: ${errorMessage}`);
        
        log('error', 'Chat API Error', {
          error: errorMessage,
          type: error instanceof Error ? 
            ((error as unknown) as {type?: string}).type || "api_error" : 
            "unknown_error",
          conversationId,
          ip,
          path,
          geoInfo: JSON.stringify(geoInfo),
          userAgent: req.headers.get('user-agent') || 'unknown',
          ...userInfo
        });
        
        // Send structured error response
        const errorData = {
          message: errorMessage,
          type: error instanceof Error ? 
            ((error as unknown) as {type?: string}).type || "api_error" : 
            "unknown_error"
        };
        
        writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: JSON.stringify(errorData) })}\n\n`
          )
        );
        
        // Always send DONE signal even in error case
        writer.write(encoder.encode("data: [DONE]\n\n"));
        writer.close();
      }
    })();

    return new Response(readable, {
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