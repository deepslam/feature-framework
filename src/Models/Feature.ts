/* eslint-disable indent */
import { v4 as uuid4 } from 'uuid';
import SuccessFullyInitializedEvent from '../Events/Features/SuccessfullyInitializedEvent';
import { IFeature, IEvent } from '../Interfaces';
import { ConfigType } from '../Types';
import Application from '../Application/Application';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new Map<string, Partial<AbstractFeaturePrivateDataType>>();

export default abstract class Feature<
  C = Record<string, ConfigType>,
  A = Application<unknown>
> implements IFeature<C, A> {
  public readonly uuid: string;
  public readonly baseEvents: { initialized: IEvent<boolean> } = {
    initialized: new SuccessFullyInitializedEvent(),
  };
  protected app: A | null = null;

  constructor(protected config: C) {
    this.uuid = uuid4();
  }

  public setApp(app: A): boolean {
    if (this.app === null) {
      this.app = app;
      return true;
    }

    return false;
  }

  public getApp(): A | null {
    return this.app;
  }

  public hasApp(): boolean {
    return this.app !== null;
  }

  init(this: IFeature): Promise<boolean> {
    return new Promise((resolve) => {
      const promises: unknown[] = [];
      if (this.features) {
        Object.keys(this.features).forEach((key) => {
          if (this.features && this.features[key]) {
            const feature = this.features[key];
            promises.push(feature.init());
          }
        });
      }
      Promise.all(promises).then(() => {
        this.initFeature().then((result) => {
          this.setInitialized(result);
          this.baseEvents.initialized.fire(result);
          resolve(result);
        });
      });
    });
  }

  abstract initFeature(): Promise<boolean>;

  cfg(): C {
    return this.config;
  }

  extendConfig(newConfig: Partial<C>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  isInitialized(): boolean {
    return privateData.get(this.uuid)?.initialized || false;
  }

  setInitialized(initialized: boolean): void {
    privateData.set(this.uuid, {
      initialized,
    });
  }

  hasSlice(this: IFeature): boolean {
    return (
      typeof this.slices !== undefined &&
      Object.keys(this.slices!).length > 0 &&
      this.isInitialized()
    );
  }
}
