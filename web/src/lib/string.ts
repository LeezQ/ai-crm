export interface StringOptions {
  trim?: boolean;
  caseSensitive?: boolean;
  maxLength?: number;
}

export class StringFormatter {
  private static instance: StringFormatter;
  private options: StringOptions;

  private constructor(options: StringOptions = {}) {
    this.options = {
      trim: true,
      caseSensitive: false,
      maxLength: undefined,
      ...options,
    };
  }

  static getInstance(options?: StringOptions): StringFormatter {
    if (!StringFormatter.instance) {
      StringFormatter.instance = new StringFormatter(options);
    }
    return StringFormatter.instance;
  }

  format(value: string): string {
    let result = value;

    if (this.options.trim) {
      result = result.trim();
    }

    if (this.options.maxLength !== undefined) {
      result = result.slice(0, this.options.maxLength);
    }

    return result;
  }

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  camelCase(value: string): string {
    return value
      .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  }

  snakeCase(value: string): string {
    return value
      .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
      .replace(/[-_\s]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  kebabCase(value: string): string {
    return value
      .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      .replace(/[-_\s]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  truncate(value: string, length: number, suffix: string = "..."): string {
    if (value.length <= length) {
      return value;
    }
    return value.slice(0, length) + suffix;
  }

  slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  mask(
    value: string,
    pattern: string = "*",
    start: number = 0,
    end: number = 4
  ): string {
    const length = value.length;
    if (start >= length || end >= length) {
      return value;
    }
    return (
      value.slice(0, start) + pattern.repeat(end - start) + value.slice(end)
    );
  }

  padStart(value: string, length: number, char: string = " "): string {
    return value.padStart(length, char);
  }

  padEnd(value: string, length: number, char: string = " "): string {
    return value.padEnd(length, char);
  }

  repeat(value: string, count: number): string {
    return value.repeat(count);
  }

  reverse(value: string): string {
    return value.split("").reverse().join("");
  }

  startsWith(value: string, search: string): boolean {
    if (!this.options.caseSensitive) {
      return value.toLowerCase().startsWith(search.toLowerCase());
    }
    return value.startsWith(search);
  }

  endsWith(value: string, search: string): boolean {
    if (!this.options.caseSensitive) {
      return value.toLowerCase().endsWith(search.toLowerCase());
    }
    return value.endsWith(search);
  }

  includes(value: string, search: string): boolean {
    if (!this.options.caseSensitive) {
      return value.toLowerCase().includes(search.toLowerCase());
    }
    return value.includes(search);
  }

  replace(value: string, search: string | RegExp, replace: string): string {
    if (!this.options.caseSensitive && typeof search === "string") {
      const regex = new RegExp(search, "gi");
      return value.replace(regex, replace);
    }
    return value.replace(search, replace);
  }

  split(value: string, separator: string | RegExp): string[] {
    return value.split(separator);
  }

  join(values: string[], separator: string = ""): string {
    return values.join(separator);
  }

  setOptions(options: Partial<StringOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export const stringFormatter = StringFormatter.getInstance();

export function useString() {
  const format = (value: string): string => {
    return stringFormatter.format(value);
  };

  const capitalize = (value: string): string => {
    return stringFormatter.capitalize(value);
  };

  const camelCase = (value: string): string => {
    return stringFormatter.camelCase(value);
  };

  const snakeCase = (value: string): string => {
    return stringFormatter.snakeCase(value);
  };

  const kebabCase = (value: string): string => {
    return stringFormatter.kebabCase(value);
  };

  const truncate = (value: string, length: number, suffix?: string): string => {
    return stringFormatter.truncate(value, length, suffix);
  };

  const slugify = (value: string): string => {
    return stringFormatter.slugify(value);
  };

  const mask = (
    value: string,
    pattern?: string,
    start?: number,
    end?: number
  ): string => {
    return stringFormatter.mask(value, pattern, start, end);
  };

  const padStart = (value: string, length: number, char?: string): string => {
    return stringFormatter.padStart(value, length, char);
  };

  const padEnd = (value: string, length: number, char?: string): string => {
    return stringFormatter.padEnd(value, length, char);
  };

  const repeat = (value: string, count: number): string => {
    return stringFormatter.repeat(value, count);
  };

  const reverse = (value: string): string => {
    return stringFormatter.reverse(value);
  };

  const startsWith = (value: string, search: string): boolean => {
    return stringFormatter.startsWith(value, search);
  };

  const endsWith = (value: string, search: string): boolean => {
    return stringFormatter.endsWith(value, search);
  };

  const includes = (value: string, search: string): boolean => {
    return stringFormatter.includes(value, search);
  };

  const replace = (
    value: string,
    search: string | RegExp,
    replace: string
  ): string => {
    return stringFormatter.replace(value, search, replace);
  };

  const split = (value: string, separator: string | RegExp): string[] => {
    return stringFormatter.split(value, separator);
  };

  const join = (values: string[], separator?: string): string => {
    return stringFormatter.join(values, separator);
  };

  const setOptions = (options: Partial<StringOptions>): void => {
    stringFormatter.setOptions(options);
  };

  return {
    format,
    capitalize,
    camelCase,
    snakeCase,
    kebabCase,
    truncate,
    slugify,
    mask,
    padStart,
    padEnd,
    repeat,
    reverse,
    startsWith,
    endsWith,
    includes,
    replace,
    split,
    join,
    setOptions,
  };
}
