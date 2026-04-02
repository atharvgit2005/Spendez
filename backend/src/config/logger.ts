import winston from 'winston';

export class AppLogger {
  private static instance: winston.Logger;

  static getInstance(): winston.Logger {
    if (!AppLogger.instance) {
      AppLogger.instance = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
          )
        ),
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: 'backend.log' })
        ],
      });
    }
    return AppLogger.instance;
  }

  static info(message: string, meta?: any) {
    this.getInstance().info(message, meta);
  }

  static error(message: string, meta?: any) {
    this.getInstance().error(message, meta);
  }

  static warn(message: string, meta?: any) {
    this.getInstance().warn(message, meta);
  }

  static debug(message: string, meta?: any) {
    this.getInstance().debug(message, meta);
  }
}

export const logger = AppLogger.getInstance();
