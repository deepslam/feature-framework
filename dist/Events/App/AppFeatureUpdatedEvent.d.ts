import Event from '../../Models/Event';
import { IFeature } from '../../Interfaces';
export default class AppFeatureUpdatedEvent extends Event<IFeature<any, any>> {
}
