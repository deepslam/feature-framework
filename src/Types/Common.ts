export type Constructor<T = { new (...args: any[]): unknown }> = new (
  ...args: any[]
) => T;

export type ConfigType =
  | boolean
  | string
  | number
  | ConfigType[]
  | undefined
  | any
  | { [name: string]: ConfigType };
