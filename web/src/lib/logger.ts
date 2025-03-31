export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  prefix?: string;
  color?: boolean;
}

export class Logger {
  private static instance: Logger;
  private options: LogOptions;
  private isEnabled: boolean;

  private constructor(options: LogOptions = {}) {
    this.options = {
      level: "info",
      timestamp: true,
      prefix: "[AI CRM]",
      color: true,
      ...options,
    };
    this.isEnabled = process.env.NODE_ENV !== "production";
  }

  static getInstance(options?: LogOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case "debug":
        return "#808080";
      case "info":
        return "#0000FF";
      case "warn":
        return "#FFA500";
      case "error":
        return "#FF0000";
      default:
        return "#000000";
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): string {
    const parts: string[] = [];

    if (this.options.prefix) {
      parts.push(this.options.prefix);
    }

    if (this.options.timestamp) {
      parts.push(`[${this.getTimestamp()}]`);
    }

    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);

    if (args.length > 0) {
      parts.push(...args.map((arg) => JSON.stringify(arg)));
    }

    return parts.join(" ");
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.isEnabled) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, ...args);

    if (this.options.color) {
      const color = this.getColor(level);
      console.log(`%c${formattedMessage}`, `color: ${color}`);
    } else {
      console.log(formattedMessage);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.options.level === "debug") {
      this.log("debug", message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (["debug", "info"].includes(this.options.level || "info")) {
      this.log("info", message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (["debug", "info", "warn"].includes(this.options.level || "info")) {
      this.log("warn", message, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    this.log("error", message, ...args);
  }

  setOptions(options: LogOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isLoggingEnabled(): boolean {
    return this.isEnabled;
  }
}

export const logger = Logger.getInstance();

export function useLogger() {
  const debug = (message: string, ...args: any[]): void => {
    logger.debug(message, ...args);
  };

  const info = (message: string, ...args: any[]): void => {
    logger.info(message, ...args);
  };

  const warn = (message: string, ...args: any[]): void => {
    logger.warn(message, ...args);
  };

  const error = (message: string, ...args: any[]): void => {
    logger.error(message, ...args);
  };

  const setOptions = (options: LogOptions): void => {
    logger.setOptions(options);
  };

  const enable = (): void => {
    logger.enable();
  };

  const disable = (): void => {
    logger.disable();
  };

  const isLoggingEnabled = (): boolean => {
    return logger.isLoggingEnabled();
  };

  return {
    debug,
    info,
    warn,
    error,
    setOptions,
    enable,
    disable,
    isLoggingEnabled,
  };
}
