/**
 * generate password
 */
export type GeneratePasswordConfigType = {
    length: number;

    numbers: boolean;
    symbols: boolean;
    lowercase: boolean;
    uppercase: boolean;
    excludeSimilarCharacters: boolean;
    strict: boolean;

    exclude: string;
};
