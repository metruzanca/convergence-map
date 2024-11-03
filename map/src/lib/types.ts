import { Component, JSX } from "solid-js";

export type Stringify<T> = {
  [K in keyof T]: string;
};

// eslint-disable-next-line
export type Styled<P = {}> = Component<
  P & {
    children?: JSX.Element;
    class?: string;
  }
>;
