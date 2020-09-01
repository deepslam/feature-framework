import { Constructor } from '../Types/Common';

export interface IDataCollection<T extends Constructor<T>> {
  items: T[];
  
  add<T>(item: T): boolean;
  remove<T>(item: T): boolean;
  find<T>(item: T, params: ConstructorParameters<InstanceType<T>>): boolean;
  paginate<T>
}
