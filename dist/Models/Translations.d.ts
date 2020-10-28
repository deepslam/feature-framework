import { Locale } from 'locale-enum';
import { IApp } from '../Interfaces';
import { TranslationItemType } from '../Types';
export declare type LocaleKey = keyof typeof Locale;
export default class Translations<T = TranslationItemType> {
    private readonly translations;
    private app?;
    constructor(translations?: {
        [key in keyof typeof Locale]?: T;
    });
    static template(str: string, data: Record<string, string>): string;
    setApp(app: IApp): void;
    get t(): T | null;
}
