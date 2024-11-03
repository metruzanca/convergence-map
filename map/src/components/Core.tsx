import { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} class={twMerge("btn btn-primary", props.class)} />
);

// export const Section: Styled = (props) => (
//   <div class={cn("", props.class)}>{props.children}</div>
// );
