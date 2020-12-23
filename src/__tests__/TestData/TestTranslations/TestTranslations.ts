import { Translations } from '../../../Models';
import { TranslationPluralItemType } from '../../../Types';

export type TestTranslationType = {
  hello: string;
  plural: TranslationPluralItemType;
};

export class TestTranslations extends Translations<TestTranslationType> {}
