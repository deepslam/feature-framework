import { IView } from '../Interfaces/IView';

export default abstract class View<T> implements IView<T> {
  public abstract components: Record<string, T>;
}
