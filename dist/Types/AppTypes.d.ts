import { Locale } from 'locale-enum';
import { IFeature, IApp } from '../Interfaces';
import { ConfigType } from './Common';
export declare type DefaultAppConfigType = {
    fallbackLocale: Locale;
    locales: Locale[];
    defaultLocale: Locale;
};
export declare type AppConfig = number | string | boolean | unknown[] | {
    [key: string]: AppConfig;
};
export declare type AppFeaturesType = Record<string, IFeature<Record<string, ConfigType>, IApp>>;
