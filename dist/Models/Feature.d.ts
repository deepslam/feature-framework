import { IFeature, IEvent, IApp } from '../Interfaces';
import { AppFeaturesType, ConfigType } from '../Types';
export default abstract class Feature<C extends Record<string, ConfigType>, A extends IApp, F extends AppFeaturesType> implements IFeature<C, A> {
    config: C;
    readonly features: F;
    abstract name: string;
    readonly uuid: string;
    readonly baseEvents: {
        initialized: IEvent<boolean>;
        onError: IEvent<boolean>;
        onUpdate: IEvent<C>;
    };
    constructor(config: C, features: F);
    setApp(app: A): boolean;
    getApp(): A;
    hasApp(): boolean;
    init(): Promise<boolean>;
    abstract initFeature(): Promise<boolean>;
    cfg(): C;
    extendConfig(newConfig: Partial<C>): void;
    isInitialized(): boolean;
    setInitialized(initialized: boolean): void;
}
