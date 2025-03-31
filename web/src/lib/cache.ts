interface CacheItem<T> {
  value: T;
  expires: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;

  private constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  static getInstance(defaultTTL?: number): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(defaultTTL);
    }
    return CacheManager.instance;
  }

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values<T>(): T[] {
    return Array.from(this.cache.values()).map((item) => item.value);
  }

  entries<T>(): [string, T][] {
    return Array.from(this.cache.entries()).map(([key, item]) => [
      key,
      item.value,
    ]);
  }

  forEach<T>(callback: (value: T, key: string) => void): void {
    this.cache.forEach((item, key) => {
      if (Date.now() <= item.expires) {
        callback(item.value, key);
      } else {
        this.cache.delete(key);
      }
    });
  }

  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  getDefaultTTL(): number {
    return this.defaultTTL;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = CacheManager.getInstance();

export function useCache<T>() {
  const get = (key: string): T | null => {
    return cache.get<T>(key);
  };

  const set = (key: string, value: T, ttl?: number): void => {
    cache.set(key, value, ttl);
  };

  const remove = (key: string): void => {
    cache.delete(key);
  };

  const clear = (): void => {
    cache.clear();
  };

  const has = (key: string): boolean => {
    return cache.has(key);
  };

  const size = (): number => {
    return cache.size();
  };

  const keys = (): string[] => {
    return cache.keys();
  };

  const values = (): T[] => {
    return cache.values<T>();
  };

  const entries = (): [string, T][] => {
    return cache.entries<T>();
  };

  const forEach = (callback: (value: T, key: string) => void): void => {
    cache.forEach(callback);
  };

  const setDefaultTTL = (ttl: number): void => {
    cache.setDefaultTTL(ttl);
  };

  const getDefaultTTL = (): number => {
    return cache.getDefaultTTL();
  };

  const cleanup = (): void => {
    cache.cleanup();
  };

  return {
    get,
    set,
    remove,
    clear,
    has,
    size,
    keys,
    values,
    entries,
    forEach,
    setDefaultTTL,
    getDefaultTTL,
    cleanup,
  };
}
