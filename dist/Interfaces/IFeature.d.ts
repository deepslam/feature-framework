import { IApp } from './IApp';
import { FeatureCommonType, FeatureStandardEventsType } from '../Types';
export interface IFeature<F extends FeatureCommonType, A extends IApp<any>> {
    name: string;
    config: F['config'];
    baseEvents: FeatureStandardEventsType<F['config']>;
    events: F['events'];
    factories: F['factories'];
    translations: F['translations'];
    views: F['views'];
    models: F['models'];
    collections: F['collections'];
    dataManagers: F['dataManagers'];
    features: F['features'];
    init(): Promise<boolean>;
    initFeature(): Promise<boolean>;
    setData(data: F): boolean;
    setPartialData(data: Partial<F>): boolean;
    setApp(app: A): boolean;
    getApp(): A;
    hasApp(): boolean;
    isInitialized(): boolean;
    setInitialized(val: boolean): void;
    cfg(): F['config'];
    extendConfig(config: Partial<F['config']>): void;
}
