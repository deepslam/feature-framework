import { Locale } from 'locale-enum';
import { Translations } from '../../Models';
import {
  TestTranslationType,
  TestTranslations,
} from '../TestData/TestTranslations/TestTranslations';
import TestApp from '../TestData/Application/TestApplication';

type TestTranslationAnotherType = {
  hello: string;
  anotherOne: string;
};
class TestAnotherTranslations extends Translations<TestTranslationAnotherType> {}

describe('Translations test', () => {
  it('Test if everything is correct', () => {
    const translationsEn: TestTranslationType = {
      hello: 'Hello',
      plural: {
        one: 'Product {name}',
        plural: (n: number) => `${n} products ({name})`,
        zero: 'No products ({name})',
      },
    };
    const translationsRu: TestTranslationType = {
      hello: 'Привет',
      plural: {
        one: 'Продукт {name}',
        plural: (n: number) => `${n} продукта ({name})`,
        zero: 'Нет продуктов ({name})',
      },
    };
    const app = new TestApp(
      {
        config: { version: '3.4.3' },
      },
      {
        defaultLocale: Locale.en,
        locales: [Locale.ru, Locale.en],
      },
    );
    const msg = new TestTranslations({
      [Locale.en]: translationsEn,
      [Locale.ru]: translationsRu,
    });
    expect(msg.t).toBe(null);
    msg.setApp(app);
    expect(msg.t).toStrictEqual(translationsEn);
    expect(app.t(msg.t!.hello)).toBe('Hello');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 0)).toBe(
      'No products (iPhone)',
    );
    expect(app.t(msg.t!.plural, {}, 0)).toBe('No products ({name})');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 1)).toBe('Product iPhone');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 2)).toBe(
      '2 products (iPhone)',
    );

    app.setCurrentLocale(Locale.ru);
    expect(msg.t).toStrictEqual(translationsRu);

    expect(app.t(msg.t!.hello)).toBe('Привет');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 0)).toBe(
      'Нет продуктов (iPhone)',
    );
    expect(app.t(msg.t!.plural, {}, 0)).toBe('Нет продуктов ({name})');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 1)).toBe('Продукт iPhone');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 2)).toBe(
      '2 продукта (iPhone)',
    );
  });

  it('Test if something went wrong', () => {
    const translationsEn: TestTranslationType = {
      hello: 'Hello',
      plural: {
        one: 'Product {name}',
        plural: (n: number) => `${n} products ({name})`,
        zero: 'No products ({name})',
      },
    };
    const app = new TestApp(
      { config: { version: '3.4.3' } },
      {
        defaultLocale: Locale.it,
        fallbackLocale: Locale.en,
        locales: [Locale.ru, Locale.en, Locale.it],
      },
    );
    const msg = new TestTranslations({
      [Locale.en]: translationsEn,
    });
    msg.setApp(app);
    expect(msg.t).toStrictEqual(translationsEn);
    expect(app.t(msg.t!.hello)).toBe('Hello');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 0)).toBe(
      'No products (iPhone)',
    );
    expect(app.t(msg.t!.plural, {}, 0)).toBe('No products ({name})');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 1)).toBe('Product iPhone');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 2)).toBe(
      '2 products (iPhone)',
    );
    app.setCurrentLocale(Locale.ru);
    expect(app.getCurrentLocale()).toBe(Locale.ru);
    expect(msg.t).toStrictEqual(translationsEn);
    expect(app.t(msg.t!.hello)).toBe('Hello');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 0)).toBe(
      'No products (iPhone)',
    );
    expect(app.t(msg.t!.plural, {}, 0)).toBe('No products ({name})');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 1)).toBe('Product iPhone');
    expect(app.t(msg.t!.plural, { name: 'iPhone' }, 2)).toBe(
      '2 products (iPhone)',
    );
  });

  it('Test toArray conversion', () => {
    const translationsEn: TestTranslationAnotherType = {
      hello: 'Hello',
      anotherOne: 'Another string',
    };
    const app = new TestApp(
      { config: { version: '3.4.3' } },
      {
        defaultLocale: Locale.it,
        fallbackLocale: Locale.en,
        locales: [Locale.ru, Locale.en, Locale.it],
      },
    );
    const msg = new TestAnotherTranslations({
      [Locale.en]: translationsEn,
    });

    expect(msg.toArray()).toStrictEqual([]);

    msg.setApp(app);

    expect(msg.toArray()).toStrictEqual(['Hello', 'Another string']);
  });
});
