import { IView } from '../Interfaces/IView';
import { ComponentType } from '../Types';

export default abstract class View<T, P> implements IView<T, P> {
  public abstract components: Record<string, ComponentType<T, P>>;
}
