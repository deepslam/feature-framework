import { Locale } from 'locale-enum';
import Application from '../Application/Application';
import { TranslationItemType } from '../Types';
export declare type LocaleKey = keyof typeof Locale;
export default class Translations<T = TranslationItemType> {
    private readonly translations;
    private app?;
    constructor(translations?: {
        [key in keyof typeof Locale]?: T;
    });
    static template(str: string, data: Record<string, string>): string;
    setApp(app: Application<unknown>): void;
    get t(): T | null;
}
