import Event from '../../Models/Event';
import { IModel } from '../../Interfaces/IModel';

export default class ModelWasUpdated<T> extends Event<IModel<T>> {}
