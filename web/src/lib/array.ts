export interface ArrayOptions<T> {
  unique?: boolean;
  sort?: boolean;
  reverse?: boolean;
  filter?: (item: T) => boolean;
  map?: (item: T) => any;
}

export class ArrayFormatter<T> {
  private static instance: ArrayFormatter<any>;
  private options: ArrayOptions<T>;

  private constructor(options: ArrayOptions<T> = {}) {
    this.options = {
      unique: false,
      sort: false,
      reverse: false,
      filter: undefined,
      map: undefined,
      ...options,
    };
  }

  static getInstance<T>(options?: ArrayOptions<T>): ArrayFormatter<T> {
    if (!ArrayFormatter.instance) {
      ArrayFormatter.instance = new ArrayFormatter(options);
    }
    return ArrayFormatter.instance as ArrayFormatter<T>;
  }

  format(array: T[]): T[] {
    let result = [...array];

    if (this.options.filter) {
      result = result.filter(this.options.filter);
    }

    if (this.options.map) {
      result = result.map(this.options.map);
    }

    if (this.options.unique) {
      result = Array.from(new Set(result));
    }

    if (this.options.sort) {
      result.sort();
    }

    if (this.options.reverse) {
      result.reverse();
    }

    return result;
  }

  chunk(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  compact(array: T[]): T[] {
    return array.filter((item) => item !== null && item !== undefined);
  }

  difference(array1: T[], array2: T[]): T[] {
    return array1.filter((item) => !array2.includes(item));
  }

  intersection(array1: T[], array2: T[]): T[] {
    return array1.filter((item) => array2.includes(item));
  }

  union(array1: T[], array2: T[]): T[] {
    return Array.from(new Set([...array1, ...array2]));
  }

  shuffle(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  sample(array: T[], size: number = 1): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, size);
  }

  groupBy<K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  }

  flatten<R>(array: (T | T[])[], depth: number = 1): R[] {
    return array.reduce((result, item) => {
      if (Array.isArray(item) && depth > 0) {
        return result.concat(this.flatten<R>(item, depth - 1));
      }
      return result.concat(item as unknown as R);
    }, [] as R[]);
  }

  rotate(array: T[], count: number): T[] {
    const length = array.length;
    const normalizedCount = ((count % length) + length) % length;
    return [
      ...array.slice(normalizedCount),
      ...array.slice(0, normalizedCount),
    ];
  }

  zip(...arrays: T[][]): T[][] {
    const maxLength = Math.max(...arrays.map((arr) => arr.length));
    return Array.from({ length: maxLength }, (_, i) =>
      arrays.map((arr) => arr[i])
    ) as T[][];
  }

  unzip(array: T[][]): T[][] {
    return array[0].map((_, i) => array.map((arr) => arr[i])) as T[][];
  }

  setOptions(options: Partial<ArrayOptions<T>>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export const arrayFormatter = ArrayFormatter.getInstance<unknown>();

export function useArray<T>() {
  const format = (array: T[]): T[] => {
    return arrayFormatter.format(array) as T[];
  };

  const chunk = (array: T[], size: number): T[][] => {
    return arrayFormatter.chunk(array, size) as T[][];
  };

  const compact = (array: T[]): T[] => {
    return arrayFormatter.compact(array) as T[];
  };

  const difference = (array1: T[], array2: T[]): T[] => {
    return arrayFormatter.difference(array1, array2) as T[];
  };

  const intersection = (array1: T[], array2: T[]): T[] => {
    return arrayFormatter.intersection(array1, array2) as T[];
  };

  const union = (array1: T[], array2: T[]): T[] => {
    return arrayFormatter.union(array1, array2) as T[];
  };

  const shuffle = (array: T[]): T[] => {
    return arrayFormatter.shuffle(array) as T[];
  };

  const sample = (array: T[], size?: number): T[] => {
    return arrayFormatter.sample(array, size) as T[];
  };

  const groupBy = <K extends keyof T>(
    array: T[],
    key: K
  ): Record<string, T[]> => {
    return arrayFormatter.groupBy(array, key) as Record<string, T[]>;
  };

  const flatten = <R>(array: (T | T[])[], depth?: number): R[] => {
    return arrayFormatter.flatten<R>(array, depth);
  };

  const rotate = (array: T[], count: number): T[] => {
    return arrayFormatter.rotate(array, count) as T[];
  };

  const zip = (...arrays: T[][]): T[][] => {
    return arrayFormatter.zip(...arrays) as T[][];
  };

  const unzip = (array: T[][]): T[][] => {
    return arrayFormatter.unzip(array) as T[][];
  };

  const setOptions = (options: Partial<ArrayOptions<T>>): void => {
    arrayFormatter.setOptions(options);
  };

  return {
    format,
    chunk,
    compact,
    difference,
    intersection,
    union,
    shuffle,
    sample,
    groupBy,
    flatten,
    rotate,
    zip,
    unzip,
    setOptions,
  };
}
