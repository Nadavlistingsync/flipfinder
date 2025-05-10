import { NextRequest } from 'next/server';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Log context interface
interface LogContext {
  requestId?: string;
  path?: string;
  method?: string;
  duration?: number;
  [key: string]: any;
}

// Generate a unique request ID
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Format timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Create a structured log entry
const createLogEntry = (level: LogLevel, message: string, context: LogContext = {}) => {
  const entry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...context,
  };

  // In development, use console for better readability
  if (process.env.NODE_ENV === 'development') {
    const color = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    }[level];

    console.log(`${color}[${level.toUpperCase()}] ${message}\x1b[0m`, context);
  } else {
    // In production, use JSON format for better parsing
    console.log(JSON.stringify(entry));
  }

  return entry;
};

// Create a logger instance for a request
export const createRequestLogger = (req?: NextRequest) => {
  const requestId = generateRequestId();
  const startTime = Date.now();

  return {
    debug: (message: string, context: LogContext = {}) => {
      return createLogEntry(LogLevel.DEBUG, message, {
        requestId,
        path: req?.nextUrl?.pathname,
        method: req?.method,
        duration: Date.now() - startTime,
        ...context,
      });
    },

    info: (message: string, context: LogContext = {}) => {
      return createLogEntry(LogLevel.INFO, message, {
        requestId,
        path: req?.nextUrl?.pathname,
        method: req?.method,
        duration: Date.now() - startTime,
        ...context,
      });
    },

    warn: (message: string, context: LogContext = {}) => {
      return createLogEntry(LogLevel.WARN, message, {
        requestId,
        path: req?.nextUrl?.pathname,
        method: req?.method,
        duration: Date.now() - startTime,
        ...context,
      });
    },

    error: (message: string, error?: Error, context: LogContext = {}) => {
      return createLogEntry(LogLevel.ERROR, message, {
        requestId,
        path: req?.nextUrl?.pathname,
        method: req?.method,
        duration: Date.now() - startTime,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : undefined,
        ...context,
      });
    },
  };
};

// Create a default logger for non-request contexts
export const logger = createRequestLogger(); 