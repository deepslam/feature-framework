import Event from '../../Models/Event';
import { IFeature } from '../../Interfaces';
export default class AppFeatureInitializedEvent extends Event<IFeature<any, any>> {
}
