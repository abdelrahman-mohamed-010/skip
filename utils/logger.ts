/**
 * Simple logger utility for consistent logging across the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Log a message with the specified level and metadata
 */
export async function log(
  level: LogLevel,
  message: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  // Format for console output
  const logData = {
    timestamp,
    level,
    message,
    ...metadata
  };
  
  // Log to console based on level
  switch (level) {
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}`, metadata);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}`, metadata);
      break;
    case 'debug':
      console.debug(`[${timestamp}] DEBUG: ${message}`, metadata);
      break;
    case 'info':
    default:
      console.log(`[${timestamp}] INFO: ${message}`, metadata);
  }
  
  // In production, you could send logs to a service like Grafana, Datadog, etc.
  // Here we'll just do console logging
  
  return Promise.resolve();
} 