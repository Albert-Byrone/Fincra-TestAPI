const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');


// Define the custom settings for each transport (file, console)
var transport = new DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: 'logs'
});

var consoleTransport = new winston.transports.Console();

// Instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }), // to log the stack trace
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    transport,
    consoleTransport
  ],
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;