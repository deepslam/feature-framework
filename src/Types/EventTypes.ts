import { Errors } from 'validatorjs';
import { IDataCollection, IEvent } from '../Interfaces';
import {
  AppDataUpdatedEvent,
  AppErrorEvent,
  AppFeatureInitializedEvent,
  AppFeatureUpdatedEvent,
  AppLoadedEvent,
  AppLocaleChangedEvent,
  AppUpdatedEvent,
  CollectionClearedEvent,
  CollectionExtendedEvent,
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
  onDataUpdated: AppDataUpdatedEvent<C>;
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
  onCollectionExtended: CollectionExtendedEvent<IDataCollection<T>>;
  onCollectionFilled: CollectionExtendedEvent<IDataCollection<T>>;
};

export type ModelStandardEventsType<T> = {
  onUpdate: ModelWasUpdatedEvent<T>;
  onValidationFailed: IEvent<{ errors: Errors; fields: T }>;
  onValidationPassed: IEvent<T>;
  onSave: IEvent<boolean>;
  onLoad: IEvent<boolean>;
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
  onDataUpdated: IEvent<C>;
};
