export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface PerformanceOptions {
  enabled?: boolean;
  threshold?: number;
  onMetric?: (metric: PerformanceMetric) => void;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[];
  private options: PerformanceOptions;
  private marks: Map<string, number>;

  private constructor(options: PerformanceOptions = {}) {
    this.metrics = [];
    this.options = {
      enabled: true,
      threshold: 1000,
      onMetric: undefined,
      ...options,
    };
    this.marks = new Map();
  }

  static getInstance(options?: PerformanceOptions): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(options);
    }
    return PerformanceMonitor.instance;
  }

  mark(name: string): void {
    if (!this.options.enabled) {
      return;
    }
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark: string): void {
    if (!this.options.enabled) {
      return;
    }

    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (start === undefined || end === undefined) {
      return;
    }

    const duration = end - start;
    const metric: PerformanceMetric = {
      name,
      value: duration,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    if (duration > (this.options.threshold || 1000)) {
      this.options.onMetric?.(metric);
    }
  }

  measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    if (!this.options.enabled) {
      return fn();
    }

    const start = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - start;
      const metric: PerformanceMetric = {
        name,
        value: duration,
        timestamp: Date.now(),
        tags,
      };

      this.metrics.push(metric);

      if (duration > (this.options.threshold || 1000)) {
        this.options.onMetric?.(metric);
      }
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  setOptions(options: PerformanceOptions): void {
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

export const performanceMonitor = PerformanceMonitor.getInstance();

export function usePerformance() {
  const mark = (name: string): void => {
    performanceMonitor.mark(name);
  };

  const measure = (name: string, startMark: string, endMark: string): void => {
    performanceMonitor.measure(name, startMark, endMark);
  };

  const measureAsync = <T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> => {
    return performanceMonitor.measureAsync(name, fn, tags);
  };

  const getMetrics = (): PerformanceMetric[] => {
    return performanceMonitor.getMetrics();
  };

  const clearMetrics = (): void => {
    performanceMonitor.clearMetrics();
  };

  const setOptions = (options: PerformanceOptions): void => {
    performanceMonitor.setOptions(options);
  };

  const enable = (): void => {
    performanceMonitor.enable();
  };

  const disable = (): void => {
    performanceMonitor.disable();
  };

  const isEnabled = (): boolean => {
    return performanceMonitor.isEnabled();
  };

  return {
    mark,
    measure,
    measureAsync,
    getMetrics,
    clearMetrics,
    setOptions,
    enable,
    disable,
    isEnabled,
  };
}
