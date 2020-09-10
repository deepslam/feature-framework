export interface IDataProvider {
    load(key: string): Promise<unknown>;
    save(key: string, data: unknown): Promise<boolean>;
}
