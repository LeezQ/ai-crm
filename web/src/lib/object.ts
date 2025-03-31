export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key as K)) {
      result[key as keyof Omit<T, K>] = obj[key as keyof T];
    }
    return result;
  }, {} as Omit<T, K>);
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[key as keyof T] = deepClone(obj[key as keyof T]);
      return result;
    }, {} as T);
  }

  return obj;
}

export function merge<T extends object>(target: T, source: Partial<T>): T {
  return Object.keys(source).reduce(
    (result, key) => {
      const targetKey = key as keyof T;
      const sourceValue = source[targetKey];
      const targetValue = target[targetKey];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        result[targetKey] = merge(targetValue as any, sourceValue as any);
      } else {
        result[targetKey] = sourceValue as any;
      }

      return result;
    },
    { ...target }
  );
}

export function flatten<T extends object>(
  obj: T,
  prefix = ""
): Record<string, any> {
  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key as keyof T];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value as any, newKey));
    } else {
      result[newKey] = value;
    }

    return result;
  }, {} as Record<string, any>);
}

export function unflatten<T extends object>(obj: Record<string, any>): T {
  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];
    const keys = key.split(".");
    let current = result as any;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
    return result;
  }, {} as T);
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function hasOwnProperty<T extends object>(
  obj: T,
  key: keyof T
): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
