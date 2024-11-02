export type Stringify<T> = {
  [K in keyof T]: string;
};
