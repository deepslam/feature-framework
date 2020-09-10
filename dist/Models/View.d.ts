import { IView } from '../Interfaces/IView';
export default abstract class View<T> implements IView<T> {
    readonly components: Record<string, T>;
    constructor(components: Record<string, T>);
}
