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
    logToConsole(level, message, metadata);
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

  try {
    // Using your exact authentication format
    const auth = Buffer.from(`${GRAFANA_USERNAME}:${process.env.GRAFANA_API_KEY}`).toString('base64');
    
    // Only attempt to send to Grafana in a server context
    if (typeof window === 'undefined') {
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
    } else {
      // In browser context, fall back to console
      logToConsole(level, message, metadata);
    }
  } catch (error) {
    // If Grafana logging fails, fallback to console
    console.error('Failed to send log to Grafana:', error);
    logToConsole(level, message, metadata);
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
