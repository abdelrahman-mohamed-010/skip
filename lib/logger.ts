/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClientIPInfo } from "./ipUtils";

export type UserEventType = "call_click" | "chat_start" | "form_submit";

export type EventMetadata = {
  userId?: string;
  location?: string;
  userAgent?: string;
  path?: string;
  ip?: string;
  geoInfo?: {
    city?: string;
    country?: string;
    region?: string;
  };
} & Record<string, any>;

const GRAFANA_USERNAME = "1120495";
const GRAFANA_URL = "https://logs-prod-036.grafana.net/loki/api/v1/push";

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogMetadata = Record<string, any>;

// Configure based on environment
const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
const serviceName = process.env.SERVICE_NAME || 'skiplegal-app';

// Log level configuration
const minLogLevel: Record<string, LogLevel> = {
  development: 'debug',
  preview: 'info',
  production: 'info',
};

const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  const configuredLevel = process.env.LOG_LEVEL as LogLevel || minLogLevel[environment] || 'info';
  return logLevelPriority[level] >= logLevelPriority[configuredLevel];
};

const logToGrafana = async (
  level: LogLevel,
  message: string,
  metadata?: LogMetadata
): Promise<void> => {
  // Skip if we shouldn't log this level
  if (!shouldLog(level)) return;

  // Skip debug logs in Grafana to reduce noise
  if (level === 'debug') {
    logToConsole(level, message, metadata);
    return;
  }

  if (!process.env.GRAFANA_API_KEY) {
    logToConsole(level, message, metadata); // Fallback if API key is missing
    return;
  }

  const timestamp = new Date().getTime() * 1000000; // Nanoseconds
  
  const labels = {
    level,
    app: serviceName,
    env: environment,
    source: "vercel"
  };

  const payload = {
    streams: [{
      stream: labels,
      values: [
        [
          timestamp.toString(),
          JSON.stringify({
            message,
            ...metadata
          })
        ]
      ]
    }]
  };

  // Only attempt to send to Grafana in a server context
  if (typeof window !== 'undefined') {
    logToConsole(level, message, metadata); // Fallback in browser context
    return;
  }

  const auth = Buffer.from(`${GRAFANA_USERNAME}:${process.env.GRAFANA_API_KEY}`).toString('base64');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`,
    'X-Scope-OrgID': GRAFANA_USERNAME
  };

  let lastError: any = null;
  const maxRetries = 3; // 3 retries means 4 attempts total

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GRAFANA_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return; // Successfully sent to Grafana
      }

      // Handle non-ok responses
      const status = response.status;
      const errorText = await response.text();
      lastError = { status, statusText: response.statusText, error: errorText };

      if (status >= 400 && status < 500) {
        // Do not retry for 4xx errors
        console.error('Grafana logging failed with client error (will not retry):', lastError);
        logToConsole(level, message, { ...metadata, grafanaError: lastError });
        return;
      }

      // For 5xx errors or other non-ok responses that aren't 4xx
      console.warn(`Grafana logging attempt ${attempt + 1} failed with status ${status}:`, lastError);

      if (attempt === maxRetries) {
        // All retries failed
        console.error('All Grafana logging attempts failed.', { originalMessage: message, finalError: lastError });
        logToConsole(level, message, { ...metadata, grafanaError: `All ${maxRetries + 1} attempts to log to Grafana failed. Last error: ${JSON.stringify(lastError)}` });
        return;
      }

      // Wait before retrying
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));

    } catch (error) { // Network error or other fetch-related error
      lastError = error;
      console.warn(`Grafana logging attempt ${attempt + 1} failed with network/fetch error:`, error);
      
      if (attempt === maxRetries) {
        // All retries failed
        console.error('All Grafana logging attempts failed due to network/fetch errors.', { originalMessage: message, finalError: error });
        logToConsole(level, message, { ...metadata, grafanaError: `All ${maxRetries + 1} attempts to log to Grafana failed. Last error: ${error instanceof Error ? error.message : String(error)}` });
        return;
      }

      // Wait before retrying
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Console logging implementation
const logToConsole = (level: LogLevel, message: string, metadata?: LogMetadata): void => {
  // Skip if we shouldn't log this level
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${serviceName}]: ${message}${metaStr}`;
  
  switch (level) {
    case 'debug':
      console.debug(formattedMessage);
      break;
    case 'info':
      console.info(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'error':
      console.error(formattedMessage);
      break;
  }
};

// For backward compatibility with your existing implementation
export const log = async (
  level: 'info' | 'error' | 'warn',
  message: string,
  metadata?: Record<string, any>
) => {
  if (!process.env.GRAFANA_API_KEY) {
    console.log(`[${level}] ${message}`, metadata);
    return;
  }

  const timestamp = new Date().getTime() * 1000000; // Nanoseconds
  
  const labels = {
    level,
    app: "skiplegal-api",
    env: process.env.VERCEL_ENV || 'development',
    source: "vercel"
  };

  const payload = {
    streams: [{
      stream: labels,
      values: [
        [
          timestamp.toString(),
          JSON.stringify({
            message,
            ...metadata
          })
        ]
      ]
    }]
  };

  try {
    // Using the exact format from the Grafana docs
    const auth = Buffer.from(`${GRAFANA_USERNAME}:${process.env.GRAFANA_API_KEY}`).toString('base64');
    
    const response = await fetch(GRAFANA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'X-Scope-OrgID': GRAFANA_USERNAME
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grafana logging failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: GRAFANA_URL,
        authType: 'Basic',
        username: GRAFANA_USERNAME
      });
    }
  } catch (error) {
    console.error('Failed to send log to Grafana:', error);
  }
};

// Main logger object
const logger = {
  debug: (message: string, metadata?: LogMetadata): void => {
    // Debug can use console directly as you weren't logging these to Grafana
    logToConsole('debug', message, metadata);
  },
  
  info: (message: string, metadata?: LogMetadata): void => {
    logToGrafana('info', message, metadata);
  },
  
  warn: (message: string, metadata?: LogMetadata): void => {
    logToGrafana('warn', message, metadata);
  },
  
  error: (message: string, metadata?: LogMetadata): void => {
    logToGrafana('error', message, metadata);
  },
  
  // Convenience method for API request logging
  logApiRequest: (req: any, metadata?: LogMetadata): void => {
    const requestInfo = {
      method: req.method,
      url: req.url || req.path,
      ...(req.headers ? { 
        userAgent: req.headers['user-agent'],
        contentType: req.headers['content-type']
      } : {}),
      ...metadata
    };
    
    logger.info(`API Request: ${req.method} ${req.url || req.path}`, requestInfo);
  },
  
  // Convenience method for API response logging
  logApiResponse: (req: any, res: any, responseTime: number, metadata?: LogMetadata): void => {
    const responseInfo = {
      method: req.method,
      url: req.url || req.path,
      statusCode: res.statusCode || res.status,
      responseTime: `${responseTime}ms`,
      ...metadata
    };
    
    logger.info(`API Response: ${req.method} ${req.url || req.path} ${res.statusCode || res.status} (${responseTime}ms)`, responseInfo);
  },
  
  // Add this method for Vercel request tracing
  withRequestId: (requestId: string) => {
    return {
      debug: (message: string, metadata?: LogMetadata) => 
        logger.debug(message, { ...metadata, requestId }),
      info: (message: string, metadata?: LogMetadata) => 
        logger.info(message, { ...metadata, requestId }),
      warn: (message: string, metadata?: LogMetadata) => 
        logger.warn(message, { ...metadata, requestId }),
      error: (message: string, metadata?: LogMetadata) => 
        logger.error(message, { ...metadata, requestId })
    };
  }
};

export default logger;

// Function to enrich event data with IP geolocation
// This is server-side only
export const enrichWithIPInfo = async (
  eventData: LogMetadata,
  ip: string
): Promise<LogMetadata> => {
  try {
    // Get geolocation info
    const geoInfo = await getClientIPInfo(ip);
    
    return {
      ...eventData,
      ip,
      geoInfo
    };
  } catch (error) {
    console.error('Failed to get IP geo information:', error);
    return {
      ...eventData,
      ip
    };
  }
};

export async function logUserEvent(eventType: UserEventType, metadata: EventMetadata = {}) {
  const enrichedMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    path: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof window !== 'undefined' ? document.referrer : '',
    // Extract UTM parameters if they exist
    utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : '',
    utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : '',
    utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : '',
    utm_content: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_content') : '',
    utm_term: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_term') : '',
  };

  // Always log to console for immediate feedback
  console.log(`[${enrichedMetadata.timestamp}] [INFO] [skiplegal-app]: User Event: ${eventType}`, enrichedMetadata);
  
  // If in browser, send to API endpoint
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/log-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          metadata: enrichedMetadata,
        }),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  } else {
    // If server-side, log directly
    await log('info', `User Event: ${eventType}`, enrichedMetadata);
  }
}

// Startup check for Grafana API Key
// This runs once when the module is initialized.
if (typeof process !== 'undefined' && process.env) {
  const grafanaApiKey = process.env.GRAFANA_API_KEY;
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] [INFO] [${serviceName}]`;

  if (grafanaApiKey && grafanaApiKey.trim() !== '') {
    console.info(`${logPrefix} Grafana API key is configured. Grafana logging enabled.`);
  } else {
    console.info(`${logPrefix} Grafana API key is MISSING. Grafana logging will be disabled (fallback to console).`);
  }
} else {
  // Fallback for environments where process.env might not be available as expected
  const timestamp = new Date().toISOString();
  // serviceName might not be available here if process itself is undefined, so use a default.
  const currentServiceName = typeof serviceName !== 'undefined' ? serviceName : 'skiplegal-app';
  const logPrefix = `[${timestamp}] [INFO] [${currentServiceName}]`;
  console.info(`${logPrefix} Unable to check Grafana API key (process or process.env not available). Grafana logging status unknown.`);
}

// New function for generic client-side logging
export async function logClientEvent(
  level: LogLevel, 
  message: string, 
  metadata: Record<string, any> = {}
) {
  // Only run this in browser contexts
  if (typeof window === 'undefined') {
    console.warn('logClientEvent should only be called from browser context');
    return;
  }
  
  const enrichedMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    userAgent: window.navigator.userAgent,
    path: window.location.pathname,
  };

  // Log to console for immediate feedback
  console.log(`[${enrichedMetadata.timestamp}] [${level.toUpperCase()}] [skiplegal-app]: ${message}`, enrichedMetadata);
  
  // Send to API endpoint
  try {
    await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'generic',
        level,
        message,
        metadata: enrichedMetadata,
      }),
    });
  } catch (error) {
    console.error('Failed to send log to server:', error);
  }
}
