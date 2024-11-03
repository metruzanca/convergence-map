// import { debounce } from "lodash";
import { createEffect, createSignal } from "solid-js";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 500
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export function createPersistedSignal<T>(key: string, initialValue: T) {
  let cached: T;
  try {
    //@ts-ignore JSON.parse can receive null without throwing
    cached = JSON.parse(localStorage.getItem(key)) as T;
  } catch (error) {
    // Do nothing
  }

  // @ts-ignore Intentional using before assignment
  const [state, setState] = createSignal<T>(cached ?? initialValue);

  const debouncedUpdate = debounce((state: T) => {
    localStorage.setItem(key, JSON.stringify(state));
  });

  createEffect(() => {
    const nextState = state();
    debouncedUpdate(nextState);
  });

  return [state, setState] as const;
}
