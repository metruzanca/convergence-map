import { clsx, type ClassValue } from "clsx";
import { createSignal, onCleanup } from "solid-js";
import { twMerge } from "tailwind-merge";

/** ClassName helper inspired by [Shadcn/Ui](https://ui.shadcn.com/docs/installation/manual) */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Breakpoints taken from tailwind
type Breakpoints = 475 | 640 | 768 | 1024 | 1280 | 1536 | (number & {});

/** JavaScript media query */
export function minWidth(pixels: Breakpoints) {
  const mediaQuery = window.matchMedia(`(min-width: ${pixels}px)`);
  const [matches, setMatches] = createSignal(mediaQuery.matches);

  const listener = () => setMatches(mediaQuery.matches);
  mediaQuery.addEventListener("change", listener);

  onCleanup(() => mediaQuery.removeEventListener("change", listener));

  return matches;
}
