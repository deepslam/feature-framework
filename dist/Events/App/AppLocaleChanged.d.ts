import { Locale } from 'locale-enum';
import Event from '../../Models/Event';
export default class AppLocaleChangedEvent extends Event<Locale> {
    readonly events: {};
}
