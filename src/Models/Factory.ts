export default class Factory {
  // eslint-disable-next-line space-before-function-paren
  public static create<T extends { new (...args: any[]): any }>(
    ClassToCreate: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    return new ClassToCreate(...args);
  }
}
