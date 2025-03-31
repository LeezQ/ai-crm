export type StateChangeCallback<T> = (newState: T, oldState: T) => void;

export interface StateOptions<T> {
  initialState: T;
  onStateChange?: StateChangeCallback<T>;
}

export class StateManager<T> {
  private static instance: StateManager<any>;
  private state: T;
  private options: StateOptions<T>;
  private subscribers: Set<StateChangeCallback<T>>;

  private constructor(options: StateOptions<T>) {
    this.state = options.initialState;
    this.options = options;
    this.subscribers = new Set();
  }

  static getInstance<T>(options: StateOptions<T>): StateManager<T> {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(options);
    }
    return StateManager.instance as StateManager<T>;
  }

  getState(): T {
    return { ...this.state };
  }

  setState(newState: Partial<T>): void {
    const oldState = { ...this.state };
    this.state = {
      ...this.state,
      ...newState,
    };

    this.notifySubscribers(oldState);
  }

  updateState(updater: (state: T) => Partial<T>): void {
    const oldState = { ...this.state };
    const updates = updater(this.state);
    this.state = {
      ...this.state,
      ...updates,
    };

    this.notifySubscribers(oldState);
  }

  subscribe(callback: StateChangeCallback<T>): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(oldState: T): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.state, oldState);
      } catch (error) {
        this.options.onStateChange?.(this.state, oldState);
      }
    });
  }

  resetState(): void {
    const oldState = { ...this.state };
    this.state = { ...this.options.initialState };
    this.notifySubscribers(oldState);
  }

  setOptions(options: Partial<StateOptions<T>>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export function createState<T>(initialState: T) {
  return StateManager.getInstance({ initialState });
}

export function useState<T>(stateManager: StateManager<T>) {
  const getState = (): T => {
    return stateManager.getState();
  };

  const setState = (newState: Partial<T>): void => {
    stateManager.setState(newState);
  };

  const updateState = (updater: (state: T) => Partial<T>): void => {
    stateManager.updateState(updater);
  };

  const subscribe = (callback: StateChangeCallback<T>): (() => void) => {
    return stateManager.subscribe(callback);
  };

  const resetState = (): void => {
    stateManager.resetState();
  };

  const setOptions = (options: Partial<StateOptions<T>>): void => {
    stateManager.setOptions(options);
  };

  return {
    getState,
    setState,
    updateState,
    subscribe,
    resetState,
    setOptions,
  };
}
