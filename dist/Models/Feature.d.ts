import { IApp, IFeature } from '../Interfaces';
import { FeatureCommonType, FeatureStandardEventsType } from '../Types';
export default abstract class Feature<F extends FeatureCommonType, A extends IApp<any>> implements IFeature<F, A> {
    abstract name: string;
    readonly uuid: string;
    readonly baseEvents: FeatureStandardEventsType<F['config']>;
    config: F['config'];
    events: F['events'];
    factories: F['factories'];
    views: F['views'];
    models: F['models'];
    collections: F['collections'];
    dataManagers: F['dataManagers'];
    features: F['features'];
    translations: F['translations'];
    constructor(settings?: F);
    setData(data: F): boolean;
    setPartialData(data: Partial<F>): boolean;
    setApp(app: A): boolean;
    getApp(): A;
    hasApp(): boolean;
    init(): Promise<boolean>;
    abstract initFeature(): Promise<boolean>;
    cfg(): F['config'];
    extendConfig(newConfig: Partial<F['config']>): void;
    isInitialized(): boolean;
    setInitialized(initialized: boolean): void;
}
