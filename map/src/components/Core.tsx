import { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    class={twMerge(
      "w-full p-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-semibold",
      props.class
    )}
  />
);

export const H2 = (props: JSX.ButtonHTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...props}
    class={twMerge("text-2xl font-semibold mb-4 text-center", props.class)}
  />
);
