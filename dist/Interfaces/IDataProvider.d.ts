export interface IDataProvider {
    load(key: string): Promise<unknown>;
    remove(key: string): Promise<boolean>;
    save(key: string, data: unknown): Promise<boolean>;
}
