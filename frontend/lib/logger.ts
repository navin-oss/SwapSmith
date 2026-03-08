/**
 * Logger utility for frontend API routes
 * Provides structured logging with consistent formatting
 * In production, this should integrate with a centralized logging service
 */

// Log levels enum for type safety
export enum LogLevel {
  error = 0,
  warn = 1,
  info = 2,
  debug = 3,
}

// Current log level - can be controlled via environment
const currentLevel = process.env.NEXT_PUBLIC_LOG_LEVEL 
  ? LogLevel[process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel]
  : LogLevel.info;

/**
 * Format log message with timestamp and metadata
 */
<<<<<<< HEAD
function formatMessage(level: string, message: string, metadata?: Record<string, unknown>): string {
=======
function formatMessage(level: string, message: string, metadata?: Record<string, any>): string {
>>>>>>> 941ae72
  const timestamp = new Date().toISOString();
  const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message}${metadataStr}`;
}

/**
 * Logger instance with methods for each log level
 */
export const logger = {
<<<<<<< HEAD
  error: (message: string, metadata?: Record<string, unknown>) => {
=======
  error: (message: string, metadata?: Record<string, any>) => {
>>>>>>> 941ae72
    if (currentLevel >= LogLevel.error) {
      console.error(formatMessage('error', message, metadata));
    }
  },
  
<<<<<<< HEAD
  warn: (message: string, metadata?: Record<string, unknown>) => {
=======
  warn: (message: string, metadata?: Record<string, any>) => {
>>>>>>> 941ae72
    if (currentLevel >= LogLevel.warn) {
      console.warn(formatMessage('warn', message, metadata));
    }
  },
  
<<<<<<< HEAD
  info: (message: string, metadata?: Record<string, unknown>) => {
=======
  info: (message: string, metadata?: Record<string, any>) => {
>>>>>>> 941ae72
    if (currentLevel >= LogLevel.info) {
      console.log(formatMessage('info', message, metadata));
    }
  },
  
<<<<<<< HEAD
  debug: (message: string, metadata?: Record<string, unknown>) => {
=======
  debug: (message: string, metadata?: Record<string, any>) => {
>>>>>>> 941ae72
    if (currentLevel >= LogLevel.debug) {
      console.debug(formatMessage('debug', message, metadata));
    }
  },
};

// Default export for convenience
export default logger;
