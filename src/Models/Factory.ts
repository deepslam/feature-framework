export default abstract class Factory<M extends { new (...args: any[]): any }> {
  constructor(public readonly model: M) {}

  public static create<T extends { new (...args: any[]): any }>(
    ClassToCreate: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    return new ClassToCreate(...args);
  }

  public new(...args: ConstructorParameters<M>): InstanceType<M> {
    return new this.model(args);
  }
}
