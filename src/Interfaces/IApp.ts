import { Store } from '@reduxjs/toolkit';
import { AppFeatures, AppReducers, Config } from '../types';

export default interface IApp<F = AppFeatures, R = AppReducers, C = Config> {
  features(): F;
  config(): C;
  reducers(): R;
  store(): Store<R>;
  // state(): Store<R>;
}
