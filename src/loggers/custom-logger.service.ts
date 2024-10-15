/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { LoggerService, Injectable, LogLevel } from '@nestjs/common';
import { blue, red, yellow, green, cyan, bold } from 'colorette';
import * as moment from 'moment';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logLevels: LogLevel[] = ['error', 'verbose', 'warn', 'debug'];

  private formatTimestamp() {
    return moment().format('HH:mm:ss DD/MM/YYYY');
  }

  private getPID() {
    return process.pid;
  }

  private formatMessage(
    level: string,
    context: string,
    message: string,
    color: Function,
    icon: string = '',
  ) {
    const timestamp = this.formatTimestamp();
    const pid = this.getPID();
    return `${icon}${bold(color(`[Nest] ${pid} - ${timestamp} ${level}`))} ${yellow(`[${context}]`)} ${bold(color(`${message}`))}${icon}`;
  }

  log(message: string, context = 'Application') {
    if (this.logLevels.includes('log')) {
      console.log(
        this.formatMessage(bold(blue('[LOG]')), context, message, blue, '✨'),
      );
    }
  }

  error(message: string, trace?: string, context = 'Application') {
    if (this.logLevels.includes('error')) {
      console.error(
        this.formatMessage(bold(red('[ERROR]')), context, message, red, '❌'),
      );
      if (trace) {
        console.error(red(trace));
      }
    }
  }

  warn(message: string, context = 'Application') {
    if (this.logLevels.includes('warn')) {
      console.warn(
        this.formatMessage(
          bold(yellow('[WARN]')),
          context,
          message,
          yellow,
          '⚠️',
        ),
      );
    }
  }

  debug(message: string, context = 'Application') {
    if (this.logLevels.includes('debug')) {
      console.debug(
        this.formatMessage(
          bold(green('[DEBUG]')),
          context,
          message,
          green,
          '🐞',
        ),
      );
    }
  }

  verbose(message: string, context = 'Application') {
    if (this.logLevels.includes('verbose')) {
      console.log(
        this.formatMessage(
          bold(cyan('[VERBOSE]')),
          context,
          message,
          cyan,
          '🎉',
        ),
      );
    }
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }
}
