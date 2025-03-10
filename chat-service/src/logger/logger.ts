import winston, { format, transports } from "winston";
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    logFormat // Use custom log format
  ),
  transports: [
    new transports.Console(),

    new transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
