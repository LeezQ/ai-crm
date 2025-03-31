import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getTheme, setTheme, watchSystemTheme } from "./theme";
import { getItem, setItem } from "./storage";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getItem(key, initialValue);
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      setItem(key, value);
    },
    [key]
  );

  return [storedValue, setValue];
}

export function useTheme(): [string, (theme: string) => void] {
  const [theme, setThemeValue] = useState<string>(getTheme());

  useEffect(() => {
    const unsubscribe = watchSystemTheme((systemTheme) => {
      if (theme === "system") {
        setThemeValue(systemTheme);
      }
    });

    return () => unsubscribe();
  }, [theme]);

  const updateTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    setThemeValue(newTheme);
  }, []);

  return [theme, updateTheme];
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useClickOutside(
  callback: () => void
): React.RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}

export function useScrollPosition(): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return position;
}

export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (token: string) => {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
