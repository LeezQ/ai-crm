export interface StorageOptions {
  prefix?: string;
  onError?: (error: Error) => void;
}

export class StorageManager {
  private static instance: StorageManager;
  private options: StorageOptions;

  private constructor(options: StorageOptions = {}) {
    this.options = {
      prefix: "ai-crm",
      onError: undefined,
      ...options,
    };
  }

  static getInstance(options?: StorageOptions): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager(options);
    }
    return StorageManager.instance;
  }

  private getKey(key: string): string {
    return `${this.options.prefix}:${key}`;
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      this.options.onError?.(error as Error);
      return defaultValue || null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.options.prefix + ":")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  has(key: string): boolean {
    try {
      return localStorage.getItem(this.getKey(key)) !== null;
    } catch (error) {
      this.options.onError?.(error as Error);
      return false;
    }
  }

  keys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith(this.options.prefix + ":"))
        .map((key) => key.slice(this.options.prefix!.length + 1));
    } catch (error) {
      this.options.onError?.(error as Error);
      return [];
    }
  }

  size(): number {
    try {
      return Object.keys(localStorage).filter((key) =>
        key.startsWith(this.options.prefix + ":")
      ).length;
    } catch (error) {
      this.options.onError?.(error as Error);
      return 0;
    }
  }

  setOptions(options: Partial<StorageOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export const storage = StorageManager.getInstance();

export function useStorage() {
  const get = <T>(key: string, defaultValue?: T): T | null => {
    return storage.get(key, defaultValue);
  };

  const set = <T>(key: string, value: T): void => {
    storage.set(key, value);
  };

  const remove = (key: string): void => {
    storage.remove(key);
  };

  const clear = (): void => {
    storage.clear();
  };

  const has = (key: string): boolean => {
    return storage.has(key);
  };

  const keys = (): string[] => {
    return storage.keys();
  };

  const size = (): number => {
    return storage.size();
  };

  const setOptions = (options: Partial<StorageOptions>): void => {
    storage.setOptions(options);
  };

  return {
    get,
    set,
    remove,
    clear,
    has,
    keys,
    size,
    setOptions,
  };
}
