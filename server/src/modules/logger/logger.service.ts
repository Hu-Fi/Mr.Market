import { Injectable, Logger, Scope } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable({ scope: Scope.DEFAULT })
export class CustomLogger extends Logger {
  private readonly logsDir = path.join(__dirname, '..', '..', 'logs');
  private logFilePath: string;
  private errorFilePath: string;

  constructor(context?: string) {
    super(context);
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
    const date = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    this.logFilePath = this.generateFilePath('log', date);
    this.errorFilePath = this.generateFilePath('error', date);
  }

  private generateFilePath(baseName: string, date: string): string {
    let filePath;
    let fileNumber = 1;
    do {
      filePath = path.join(this.logsDir, `${baseName}_${fileNumber}_${date}.log`);
      fileNumber++;
    } while (fs.existsSync(filePath));
    return filePath;
  }

  private writeToFile(filePath: string, message: string): void {
    fs.appendFile(filePath, message, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
  }

  private formatMessage(level: string, message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context || this.context}] ${message}\n`;
  }

  log(message: any, context?: string) {
    super.log(message, context); // NestJS's internal logging
    const formattedMessage = this.formatMessage('info', message, context);
    this.writeToFile(this.logFilePath, formattedMessage);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context); // NestJS's internal error logging
    const formattedMessage = this.formatMessage('error', `${message}, Trace: ${trace}`, context);
    this.writeToFile(this.errorFilePath, formattedMessage);
  }

  // Implement warn, debug, verbose similarly...


  onModuleInit() {
    this.log('Logger module initialized', 'Logger');
  }

  onModuleDestroy() {
    this.log('Logger module destroyed. Performing cleanup...', 'Logger');
  }

}


