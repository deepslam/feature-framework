import { Reducer } from '@reduxjs/toolkit';
import { IFeature } from '../Interfaces';
export declare type AppConfig = number | string | boolean | unknown[] | {
    [key: string]: AppConfig;
};
export declare type AppReducers = Record<string, Reducer>;
export declare type AppInitParams<F = AppFeatures, R = AppReducers, C = AppConfig> = {
    features: F;
    config: R;
    reducers: C;
};
export declare type AppFeatures = Record<string, IFeature>;
