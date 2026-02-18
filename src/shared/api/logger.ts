/**
 * CENTRALIZED LOGGER
 *
 * Unified logging utility with:
 * - Different log levels (info, warn, error, debug)
 * - Development/production modes
 * - Structured logging
 * - Optional context
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: unknown;
}

class Logger {
  private context: string;
  private isDevelopment: boolean;

  constructor(context: string) {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${this.context}]`;

    if (data && Object.keys(data).length > 0) {
      return `${prefix} ${message} | ${JSON.stringify(data)} | ${timestamp}`;
    }

    return `${prefix} ${message} | ${timestamp}`;
  }

  private serializeData(data: LogData): LogData {
    const result: LogData = {};

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Error) {
        const errorWithExtras = value as Error & {
          status?: number;
          statusText?: string;
          data?: unknown;
        };
        // Extract Error properties that JSON.stringify normally misses
        result[key] = {
          name: value.name,
          message: value.message,
          stack: value.stack,
          // Include ApiError specific properties
          ...('status' in errorWithExtras && { status: errorWithExtras.status }),
          ...('statusText' in errorWithExtras && { statusText: errorWithExtras.statusText }),
          ...('data' in errorWithExtras && { data: errorWithExtras.data }),
        };
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    const serializedData = data ? this.serializeData(data) : undefined;
    const formattedMessage = this.formatMessage(level, message, serializedData);

    switch (level) {
      case 'error':
        // Only log errors in development, or if explicitly enabled
        if (this.isDevelopment) {
          console.error(formattedMessage, serializedData || '');
        } else {
          // In production, silently log or send to error tracking service
          // You can integrate with services like Sentry, LogRocket, etc. here
        }
        break;
      case 'warn':
        if (this.isDevelopment) {
          console.warn(formattedMessage, serializedData || '');
        }
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage, serializedData || '');
        }
        break;
      case 'info':
      default:
        if (this.isDevelopment) {
          console.log(formattedMessage, serializedData || '');
        }
        break;
    }
  }

  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }
}

/**
 * Create a logger instance with a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Default logger instance
 */
export const logger = createLogger('App');
