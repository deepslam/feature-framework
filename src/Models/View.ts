import { IView } from '../Interfaces/IView';

export default abstract class View<T> implements IView<T> {
  abstract readonly components: Record<string, T>;
}
