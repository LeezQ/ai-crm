export interface ErrorEvent {
  name: string;
  message: string;
  stack?: string;
  timestamp: number;
  tags?: Record<string, string>;
  context?: Record<string, any>;
}

export interface ErrorTrackingOptions {
  enabled?: boolean;
  onError?: (event: ErrorEvent) => void;
  maxEvents?: number;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private events: ErrorEvent[];
  private options: ErrorTrackingOptions;

  private constructor(options: ErrorTrackingOptions = {}) {
    this.events = [];
    this.options = {
      enabled: true,
      onError: undefined,
      maxEvents: 100,
      ...options,
    };
  }

  static getInstance(options?: ErrorTrackingOptions): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(options);
    }
    return ErrorTracker.instance;
  }

  trackError(
    error: Error,
    tags?: Record<string, string>,
    context?: Record<string, any>
  ): void {
    if (!this.options.enabled) {
      return;
    }

    const event: ErrorEvent = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      tags,
      context,
    };

    this.events.push(event);

    if (this.events.length > (this.options.maxEvents || 100)) {
      this.events.shift();
    }

    this.options.onError?.(event);
  }

  trackPromiseError<T>(
    promise: Promise<T>,
    tags?: Record<string, string>,
    context?: Record<string, any>
  ): Promise<T> {
    return promise.catch((error) => {
      this.trackError(error, tags, context);
      throw error;
    });
  }

  getEvents(): ErrorEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  setOptions(options: ErrorTrackingOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  enable(): void {
    this.options.enabled = true;
  }

  disable(): void {
    this.options.enabled = false;
  }

  isEnabled(): boolean {
    return this.options.enabled || false;
  }
}

export const errorTracker = ErrorTracker.getInstance();

export function useErrorTracking() {
  const trackError = (
    error: Error,
    tags?: Record<string, string>,
    context?: Record<string, any>
  ): void => {
    errorTracker.trackError(error, tags, context);
  };

  const trackPromiseError = <T>(
    promise: Promise<T>,
    tags?: Record<string, string>,
    context?: Record<string, any>
  ): Promise<T> => {
    return errorTracker.trackPromiseError(promise, tags, context);
  };

  const getEvents = (): ErrorEvent[] => {
    return errorTracker.getEvents();
  };

  const clearEvents = (): void => {
    errorTracker.clearEvents();
  };

  const setOptions = (options: ErrorTrackingOptions): void => {
    errorTracker.setOptions(options);
  };

  const enable = (): void => {
    errorTracker.enable();
  };

  const disable = (): void => {
    errorTracker.disable();
  };

  const isEnabled = (): boolean => {
    return errorTracker.isEnabled();
  };

  return {
    trackError,
    trackPromiseError,
    getEvents,
    clearEvents,
    setOptions,
    enable,
    disable,
    isEnabled,
  };
}
