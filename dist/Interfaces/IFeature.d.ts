import { IDataCollection } from './IDataCollection';
import { Slice } from '@reduxjs/toolkit';
import { IEvent } from './IEvent';
import { IView } from './IView';
import { IModel } from './IModel';
import { IDataManager } from './IDataManager';
import { ConfigType } from '../Types';
import Application from '../Application/Application';
import { Translations, Factory } from '../Models';
export interface IFeature<C = Record<string, ConfigType>, A = Application<unknown>> {
    name: string;
    baseEvents: Record<string, IEvent<unknown>>;
    events?: Record<string, IEvent<unknown>>;
    factories?: Record<string, Factory<any>>;
    features?: Record<string, IFeature>;
    slices?: Record<string, Slice>;
    translations?: Record<string, Translations<unknown>>;
    view?: IView<unknown> | null;
    models?: Record<string, IModel<unknown>>;
    collections?: Record<string, IDataCollection<unknown>>;
    dataManagers?: Record<string, IDataManager<unknown>>;
    init(): Promise<boolean>;
    initFeature(): Promise<boolean>;
    setApp(app: A): boolean;
    getApp(): A | null;
    hasApp(): boolean;
    isInitialized(): boolean;
    setInitialized(val: boolean): void;
    cfg(): C;
    extendConfig(config: Partial<C>): void;
    hasSlice(): boolean;
}
