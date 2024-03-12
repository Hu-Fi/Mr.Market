import { Injectable, Logger, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class CustomLogger extends Logger {
  private logger: winston.Logger;

  constructor(context?: string) {
    super(context);
    const logsDir = process.env.IS_DEV
      ? path.join(__dirname, '..', '..', 'logs')
      : path.join(__dirname, '..', 'logs'); // Adjust as necessary for production

    this.logger = winston.createLogger({
      level: 'info', // Default logging level
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] [${info.level.toUpperCase()}] [${
              context || this.context
            }] ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
        }),
      ],
    });
  }

  log(message: any, context?: string) {
    super.log(message, context); // NestJS's internal logging
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context); // NestJS's internal error logging
    this.logger.error(`${message}, Trace: ${trace}`, { context });
  }

  // Implement warn, debug, verbose similarly...

  onModuleInit() {
    this.log('Logger module initialized', 'Logger');
  }

  onModuleDestroy() {
    this.log('Logger module destroyed. Performing cleanup...', 'Logger');
  }
}
