export type Theme = "light" | "dark" | "system";

export interface ThemeOptions {
  defaultTheme?: Theme;
  storageKey?: string;
  onThemeChange?: (theme: Theme) => void;
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme;
  private options: ThemeOptions;
  private subscribers: Set<(theme: Theme) => void>;
  private mediaQuery: MediaQueryList;

  private constructor(options: ThemeOptions = {}) {
    this.options = {
      defaultTheme: "system",
      storageKey: "theme",
      onThemeChange: undefined,
      ...options,
    };

    this.currentTheme = this.getStoredTheme();
    this.subscribers = new Set();
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    this.mediaQuery.addEventListener("change", this.handleSystemThemeChange);
    this.applyTheme();
  }

  static getInstance(options?: ThemeOptions): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager(options);
    }
    return ThemeManager.instance;
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.options.storageKey || "theme");
    return (stored as Theme) || this.options.defaultTheme || "system";
  }

  private handleSystemThemeChange = (): void => {
    if (this.currentTheme === "system") {
      this.applyTheme();
    }
  };

  private applyTheme(): void {
    const theme = this.getEffectiveTheme();
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }

  private getEffectiveTheme(): "light" | "dark" {
    if (this.currentTheme === "system") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return this.currentTheme;
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    if (theme === this.currentTheme) {
      return;
    }

    this.currentTheme = theme;
    localStorage.setItem(this.options.storageKey || "theme", theme);
    this.applyTheme();
    this.notifySubscribers();
  }

  subscribe(callback: (theme: Theme) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.currentTheme);
      } catch (error) {
        this.options.onThemeChange?.(this.currentTheme);
      }
    });
  }

  setOptions(options: Partial<ThemeOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  destroy(): void {
    this.mediaQuery.removeEventListener("change", this.handleSystemThemeChange);
  }
}

export const themeManager = ThemeManager.getInstance();

export function useTheme() {
  const getTheme = (): Theme => {
    return themeManager.getTheme();
  };

  const setTheme = (theme: Theme): void => {
    themeManager.setTheme(theme);
  };

  const subscribe = (callback: (theme: Theme) => void): (() => void) => {
    return themeManager.subscribe(callback);
  };

  const setOptions = (options: Partial<ThemeOptions>): void => {
    themeManager.setOptions(options);
  };

  const destroy = (): void => {
    themeManager.destroy();
  };

  return {
    getTheme,
    setTheme,
    subscribe,
    setOptions,
    destroy,
  };
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("theme") as Theme) || "system";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export function watchSystemTheme(callback: (theme: Theme) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}

export function getColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function isDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getThemeColor(color: string): string {
  if (typeof window === "undefined") return color;
  const root = window.document.documentElement;
  const computedStyle = getComputedStyle(root);
  return computedStyle.getPropertyValue(`--${color}`).trim();
}

export function setThemeColor(color: string, value: string): void {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.style.setProperty(`--${color}`, value);
}

export function getThemeColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const root = window.document.documentElement;
  const computedStyle = getComputedStyle(root);
  const colors: Record<string, string> = {};

  for (let i = 0; i < computedStyle.length; i++) {
    const prop = computedStyle[i];
    if (prop.startsWith("--")) {
      colors[prop.slice(2)] = computedStyle.getPropertyValue(prop).trim();
    }
  }

  return colors;
}
