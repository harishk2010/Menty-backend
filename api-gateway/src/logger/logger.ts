// logger.ts
import winston, { format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Define the log format function with TypeScript types
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Define the logger configuration with TypeScript types
const logger = winston.createLogger({
  level: 'info', // Log level (e.g., 'info', 'error', 'debug')
  format: combine(
    timestamp(), // Add timestamp to logs
    logFormat // Use custom log format
  ),
  transports: [
    // Log to the console
    new transports.Console(),
    // Log to a file
    new transports.File({ filename: 'logs/app.log' }),
  ],
});

export default logger;