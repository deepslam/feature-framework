export default interface IAbstractFeature {
  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;
  hasSlice(): boolean;
}
