export interface NumberOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currency?: string;
  style?: "decimal" | "currency" | "percent";
}

export class NumberFormatter {
  private static instance: NumberFormatter;
  private options: NumberOptions;

  private constructor(options: NumberOptions = {}) {
    this.options = {
      locale: "zh-CN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      style: "decimal",
      ...options,
    };
  }

  static getInstance(options?: NumberOptions): NumberFormatter {
    if (!NumberFormatter.instance) {
      NumberFormatter.instance = new NumberFormatter(options);
    }
    return NumberFormatter.instance;
  }

  format(value: number): string {
    return new Intl.NumberFormat(this.options.locale, {
      minimumFractionDigits: this.options.minimumFractionDigits,
      maximumFractionDigits: this.options.maximumFractionDigits,
      style: this.options.style,
      currency: this.options.currency,
    }).format(value);
  }

  formatCurrency(value: number, currency: string = "CNY"): string {
    return new Intl.NumberFormat(this.options.locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatPercent(value: number): string {
    return new Intl.NumberFormat(this.options.locale, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  formatCompact(value: number): string {
    return new Intl.NumberFormat(this.options.locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  formatRange(min: number, max: number): string {
    return `${this.format(min)} - ${this.format(max)}`;
  }

  parse(value: string): number {
    return Number(value.replace(/[^0-9.-]+/g, ""));
  }

  isValid(value: string | number): boolean {
    return !isNaN(Number(value));
  }

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  round(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  floor(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  }

  ceil(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  }

  sum(...values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }

  average(...values: number[]): number {
    return this.sum(...values) / values.length;
  }

  min(...values: number[]): number {
    return Math.min(...values);
  }

  max(...values: number[]): number {
    return Math.max(...values);
  }

  setOptions(options: Partial<NumberOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export const numberFormatter = NumberFormatter.getInstance();

export function useNumber() {
  const format = (value: number): string => {
    return numberFormatter.format(value);
  };

  const formatCurrency = (value: number, currency?: string): string => {
    return numberFormatter.formatCurrency(value, currency);
  };

  const formatPercent = (value: number): string => {
    return numberFormatter.formatPercent(value);
  };

  const formatCompact = (value: number): string => {
    return numberFormatter.formatCompact(value);
  };

  const formatRange = (min: number, max: number): string => {
    return numberFormatter.formatRange(min, max);
  };

  const parse = (value: string): number => {
    return numberFormatter.parse(value);
  };

  const isValid = (value: string | number): boolean => {
    return numberFormatter.isValid(value);
  };

  const clamp = (value: number, min: number, max: number): number => {
    return numberFormatter.clamp(value, min, max);
  };

  const round = (value: number, decimals?: number): number => {
    return numberFormatter.round(value, decimals);
  };

  const floor = (value: number, decimals?: number): number => {
    return numberFormatter.floor(value, decimals);
  };

  const ceil = (value: number, decimals?: number): number => {
    return numberFormatter.ceil(value, decimals);
  };

  const sum = (...values: number[]): number => {
    return numberFormatter.sum(...values);
  };

  const average = (...values: number[]): number => {
    return numberFormatter.average(...values);
  };

  const min = (...values: number[]): number => {
    return numberFormatter.min(...values);
  };

  const max = (...values: number[]): number => {
    return numberFormatter.max(...values);
  };

  const setOptions = (options: Partial<NumberOptions>): void => {
    numberFormatter.setOptions(options);
  };

  return {
    format,
    formatCurrency,
    formatPercent,
    formatCompact,
    formatRange,
    parse,
    isValid,
    clamp,
    round,
    floor,
    ceil,
    sum,
    average,
    min,
    max,
    setOptions,
  };
}
