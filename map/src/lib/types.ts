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

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartial<Thing> = Thing extends Function
  ? Thing
  : Thing extends Array<infer InferrerArrayMember>
    ? DeepPartialArray<InferrerArrayMember>
    : Thing extends object
      ? DeepPartialObject<Thing>
      : Thing | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>;
};

export type OnSubmit<T> = (thing: T) => void;
