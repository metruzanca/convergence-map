import { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} class={twMerge("btn btn-primary", props.class)} />
);
