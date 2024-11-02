import { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} class={twMerge("btn btn-primary", props.class)} />
);

// export const H2 = (props: JSX.ButtonHTMLAttributes<HTMLHeadingElement>) => (
//   <h2
//     {...props}
//     class={twMerge("text-2xl font-semibold mb-4 text-center", props.class)}
//   />
// );
