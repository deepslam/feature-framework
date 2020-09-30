export declare type TranslationReplaceVariablesType = {
    replaceVariables(data: unknown): string;
};
export declare type TranslationPluralItemType = {
    zero: string;
    one: string;
    plural: string | ((n: number) => string);
};
export declare type TranslationItemType = string | TranslationPluralItemType | {
    [key: string]: TranslationItemType;
};
