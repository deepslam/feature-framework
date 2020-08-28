import { AppFeatures, AppReducers, AppConfig, AppInitParams } from '../Types';

export default interface IApp<F = AppFeatures, R = AppReducers, C = AppConfig> {
  constructor(options: AppInitParams<F, R, C>): IApp<F, R, C>;

  features(): F;
  config(): C;
  reducers(): R;
  // store(): Store<R>;
  // state(): Store<R>;
  // on<F extends typeof FeatureInstance,E keysof F>()
}
