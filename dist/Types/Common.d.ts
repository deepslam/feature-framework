import { CountryCodeType } from './CountryCodeType';
export declare type Constructor<T = {
    new (...args: any[]): unknown;
}> = new (...args: any[]) => T;
export declare type TranslationItemType = string | {
    [key: string]: TranslationItemType;
};
export declare type TranslationType = {
    [key in CountryCodeType]?: TranslationItemType;
};
export declare type ConfigType = boolean | string | number | ConfigType[] | {
    [name: string]: ConfigType;
};
