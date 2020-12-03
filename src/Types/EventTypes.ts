import { IDataCollection, IEvent } from '../Interfaces';
import {
  AppErrorEvent,
  AppFeatureInitializedEvent,
  AppFeatureUpdatedEvent,
  AppLoadedEvent,
  AppLocaleChangedEvent,
  AppUpdatedEvent,
  CollectionClearedEvent,
  CollectionItemAddedEvent,
  CollectionItemRemovedEvent,
  CollectionItemsFoundEvent,
  CollectionItemsSortedEvent,
  ModelWasUpdatedEvent,
} from '../Events';
import { DataManagerErrorsType } from './DataManagerTypes';

export type EventPrivateType<T> = WeakMap<IEvent<unknown>, T[]>;

export type AppStandardEventsType<C> = {
  onAppLoaded: AppLoadedEvent;
  onUpdate: AppUpdatedEvent<C>;
  onAppError: AppErrorEvent;
  onAppLocaleChanged: AppLocaleChangedEvent;
  onFeatureInitialized: AppFeatureInitializedEvent;
  onFeatureUpdated: AppFeatureUpdatedEvent;
};

export type DataCollectionStandardEventsType<T> = {
  onItemAdded: CollectionItemAddedEvent<T>;
  onItemRemoved: CollectionItemRemovedEvent<T>;
  onCollectionCleared: CollectionClearedEvent<IDataCollection<T>>;
  onItemsFound: CollectionItemsFoundEvent<IDataCollection<T>>;
  onItemsSorted: CollectionItemsSortedEvent<IDataCollection<T>>;
};

export type ModelStandardEventsType<T> = {
  updated: ModelWasUpdatedEvent<T>;
};

export type DataManagerStandardEventsType<T> = {
  DataLoaded: IEvent<T>;
  DataLoadingError: IEvent<DataManagerErrorsType>;
  DataSaved: IEvent<string>;
  DataSavingError: IEvent<DataManagerErrorsType>;
  DataRemoved: IEvent<string>;
  DataRemovingError: IEvent<DataManagerErrorsType>;
};

export type FeatureStandardEventsType<C> = {
  initialized: IEvent<boolean>;
  onError: IEvent<boolean>;
  onUpdate: IEvent<C>;
};
