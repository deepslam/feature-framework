import { IDataProvider } from '../Interfaces/IDataProvider';
export default class DefaultDataProvider implements IDataProvider {
    save(key: string, saveData: unknown): Promise<boolean>;
    load(key: string): Promise<unknown>;
    remove(key: string): Promise<boolean>;
}
