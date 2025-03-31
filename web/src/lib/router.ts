import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  children?: Route[];
  redirect?: string;
}

export interface RouterOptions {
  routes: Route[];
  onRouteChange?: (path: string) => void;
}

export class Router {
  private static instance: Router;
  private routes: Route[];
  private options: RouterOptions;
  private currentPath: string;
  private subscribers: Set<(path: string) => void>;

  private constructor(options: RouterOptions) {
    this.routes = options.routes;
    this.options = options;
    this.currentPath = window.location.pathname;
    this.subscribers = new Set();
  }

  static getInstance(options: RouterOptions): Router {
    if (!Router.instance) {
      Router.instance = new Router(options);
    }
    return Router.instance;
  }

  navigate(path: string): void {
    if (path === this.currentPath) {
      return;
    }

    const oldPath = this.currentPath;
    this.currentPath = path;
    window.history.pushState({}, "", path);
    this.notifySubscribers(oldPath);
  }

  replace(path: string): void {
    if (path === this.currentPath) {
      return;
    }

    const oldPath = this.currentPath;
    this.currentPath = path;
    window.history.replaceState({}, "", path);
    this.notifySubscribers(oldPath);
  }

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  subscribe(callback: (path: string) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(oldPath: string): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.currentPath);
      } catch (error) {
        this.options.onRouteChange?.(this.currentPath);
      }
    });
  }

  matchRoute(path: string): Route | null {
    for (const route of this.routes) {
      if (route.exact && route.path === path) {
        return route;
      }

      if (!route.exact && path.startsWith(route.path)) {
        return route;
      }

      if (route.children) {
        const childRoute = this.matchChildRoute(route.children, path);
        if (childRoute) {
          return childRoute;
        }
      }
    }

    return null;
  }

  private matchChildRoute(routes: Route[], path: string): Route | null {
    for (const route of routes) {
      if (route.exact && route.path === path) {
        return route;
      }

      if (!route.exact && path.startsWith(route.path)) {
        return route;
      }

      if (route.children) {
        const childRoute = this.matchChildRoute(route.children, path);
        if (childRoute) {
          return childRoute;
        }
      }
    }

    return null;
  }

  setOptions(options: Partial<RouterOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export function createRouter(options: RouterOptions) {
  return Router.getInstance(options);
}

export function useRouter(router: Router) {
  const navigate = (path: string): void => {
    router.navigate(path);
  };

  const replace = (path: string): void => {
    router.replace(path);
  };

  const goBack = (): void => {
    router.goBack();
  };

  const goForward = (): void => {
    router.goForward();
  };

  const getCurrentPath = (): string => {
    return router.getCurrentPath();
  };

  const subscribe = (callback: (path: string) => void): (() => void) => {
    return router.subscribe(callback);
  };

  const matchRoute = (path: string): Route | null => {
    return router.matchRoute(path);
  };

  const setOptions = (options: Partial<RouterOptions>): void => {
    router.setOptions(options);
  };

  return {
    navigate,
    replace,
    goBack,
    goForward,
    getCurrentPath,
    subscribe,
    matchRoute,
    setOptions,
  };
}
