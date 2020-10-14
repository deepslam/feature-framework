import { IView } from '../Interfaces/IView';

export default abstract class View<T> implements IView<T> {
  constructor(public readonly components: Record<string, T>) {}
}
