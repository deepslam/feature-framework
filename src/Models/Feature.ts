import IFeature from '../Interfaces/IFeature';
import { FeatureOptions, FeatureComponentType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new WeakMap<
  IFeature,
  Partial<AbstractFeaturePrivateDataType>
>();

export default abstract class Feature<C, E, R> implements IFeature {
  public readonly slices?: R;
  public readonly config?: C;
  public readonly events?: E;

  constructor(options: FeatureOptions<C, E, R>) {
    this.slices = options.slices;
    this.events = options.events;
    this.config = options.config;
  }

  init(this: IFeature): Promise<boolean> {
    return new Promise((resolve) => {
      this.initFeature().then((result) => {
        this.setInitialized(true);
        resolve(result);
      });
    });
  }

  abstract initFeature(): Promise<boolean>;
  abstract components(): Record<string, FeatureComponentType>;

  isInitialized() {
    return privateData.get(this)?.initialized || false;
  }

  setInitialized(initialized: boolean) {
    privateData.set(this, {
      initialized,
    });
  }

  hasSlice(this: IFeature): boolean {
    return Object.keys(this.getSlice()).length > 0 && this.isInitialized();
  }

  on(event, callback) {}
  fireEvent(event) {}
}
