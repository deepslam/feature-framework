export declare type Constructor<T = {
    new (...args: any[]): unknown;
}> = new (...args: any[]) => T;
export declare type ConfigType = boolean | string | number | ConfigType[] | {
    [name: string]: ConfigType;
};
