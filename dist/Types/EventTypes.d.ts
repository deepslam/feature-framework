import { IEvent, IDataCollection } from '../Interfaces';
import { AppLoadedEvent, AppUpdatedEvent, AppErrorEvent, AppLocaleChangedEvent, AppFeatureInitializedEvent, AppFeatureUpdatedEvent, CollectionItemAddedEvent, CollectionItemRemovedEvent, CollectionItemsFoundEvent, CollectionClearedEvent, CollectionItemsSortedEvent, ModelWasUpdatedEvent } from '../Events';
import { DataManagerErrorsType } from './DataManagerTypes';
export declare type EventPrivateType<T> = WeakMap<IEvent<unknown>, T[]>;
export declare type AppStandardEventsType<C> = {
    onAppLoaded: AppLoadedEvent;
    onUpdate: AppUpdatedEvent<C>;
    onAppError: AppErrorEvent;
    onAppLocaleChanged: AppLocaleChangedEvent;
    onFeatureInitialized: AppFeatureInitializedEvent;
    onFeatureUpdated: AppFeatureUpdatedEvent;
};
export declare type DataCollectionStandardEventsType<T> = {
    onItemAdded: CollectionItemAddedEvent<T>;
    onItemRemoved: CollectionItemRemovedEvent<T>;
    onCollectionCleared: CollectionClearedEvent<IDataCollection<T>>;
    onItemsFound: CollectionItemsFoundEvent<IDataCollection<T>>;
    onItemsSorted: CollectionItemsSortedEvent<IDataCollection<T>>;
};
export declare type ModelStandardEventsType<T> = {
    updated: ModelWasUpdatedEvent<T>;
};
export declare type DataManagerStandardEventsType<T> = {
    DataLoaded: IEvent<T>;
    DataLoadingError: IEvent<DataManagerErrorsType>;
    DataSaved: IEvent<string>;
    DataSavingError: IEvent<DataManagerErrorsType>;
    DataRemoved: IEvent<string>;
    DataRemovingError: IEvent<DataManagerErrorsType>;
};
export declare type FeatureStandardEventsType<C> = {
    initialized: IEvent<boolean>;
    onError: IEvent<boolean>;
    onUpdate: IEvent<C>;
};
