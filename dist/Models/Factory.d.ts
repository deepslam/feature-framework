export default abstract class Factory<M extends {
    new (...args: any[]): any;
}> {
    abstract readonly model: M;
    static create<T extends {
        new (...args: any[]): any;
    }>(ClassToCreate: T, ...args: ConstructorParameters<T>): InstanceType<T>;
    new(...args: ConstructorParameters<M>): InstanceType<M>;
}
