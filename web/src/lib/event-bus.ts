export type EventCallback = (...args: any[]) => void;

export interface EventBusOptions {
  maxListeners?: number;
  onError?: (error: Error) => void;
}

export class EventBus {
  private static instance: EventBus;
  private events: Map<string, Set<EventCallback>>;
  private options: EventBusOptions;

  private constructor(options: EventBusOptions = {}) {
    this.events = new Map();
    this.options = {
      maxListeners: 10,
      onError: undefined,
      ...options,
    };
  }

  static getInstance(options?: EventBusOptions): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(options);
    }
    return EventBus.instance;
  }

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const callbacks = this.events.get(event)!;
    if (callbacks.size >= (this.options.maxListeners || 10)) {
      this.options.onError?.(
        new Error(
          `Max listeners (${this.options.maxListeners}) reached for event "${event}"`
        )
      );
      return;
    }

    callbacks.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          this.options.onError?.(error as Error);
        }
      });
    }
  }

  once(event: string, callback: EventCallback): void {
    const onceCallback = (...args: any[]) => {
      this.off(event, onceCallback);
      callback(...args);
    };
    this.on(event, onceCallback);
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  listeners(event: string): EventCallback[] {
    return Array.from(this.events.get(event) || new Set());
  }

  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  setOptions(options: EventBusOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export const eventBus = EventBus.getInstance();

export function useEventBus() {
  const on = (event: string, callback: EventCallback): void => {
    eventBus.on(event, callback);
  };

  const off = (event: string, callback: EventCallback): void => {
    eventBus.off(event, callback);
  };

  const emit = (event: string, ...args: any[]): void => {
    eventBus.emit(event, ...args);
  };

  const once = (event: string, callback: EventCallback): void => {
    eventBus.once(event, callback);
  };

  const removeAllListeners = (event?: string): void => {
    eventBus.removeAllListeners(event);
  };

  const listenerCount = (event: string): number => {
    return eventBus.listenerCount(event);
  };

  const listeners = (event: string): EventCallback[] => {
    return eventBus.listeners(event);
  };

  const eventNames = (): string[] => {
    return eventBus.eventNames();
  };

  const setOptions = (options: EventBusOptions): void => {
    eventBus.setOptions(options);
  };

  return {
    on,
    off,
    emit,
    once,
    removeAllListeners,
    listenerCount,
    listeners,
    eventNames,
    setOptions,
  };
}
