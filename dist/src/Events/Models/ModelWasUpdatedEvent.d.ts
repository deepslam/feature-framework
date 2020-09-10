import Event from '../../Models/Event';
import { IModel } from '../../Interfaces/IModel';
export default class ModelWasUpdatedEvent<T> extends Event<IModel<T>> {
}
