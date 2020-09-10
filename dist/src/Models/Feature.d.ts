import { IFeature, IEvent } from '../Interfaces';
import { ConfigType } from '../Types';
import Application from '../Application/Application';
export default abstract class Feature<C = Record<string, ConfigType>, A = Application<unknown>> implements IFeature<C, A> {
    protected config: C;
    readonly uuid: string;
    readonly baseEvents: {
        initialized: IEvent<boolean>;
    };
    protected app: A | null;
    constructor(config: C);
    setApp(app: A): boolean;
    getApp(): A | null;
    hasApp(): boolean;
    init(this: IFeature): Promise<boolean>;
    abstract initFeature(): Promise<boolean>;
    cfg(): C;
    extendConfig(newConfig: Partial<C>): void;
    isInitialized(): boolean;
    setInitialized(initialized: boolean): void;
    hasSlice(this: IFeature): boolean;
}
