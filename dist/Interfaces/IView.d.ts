import { ComponentType } from './../Types/Common';
export interface IView<T, P> {
    components: Record<string, ComponentType<T, P>>;
}
