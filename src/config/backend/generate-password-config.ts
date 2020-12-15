/**
 * generate password
 */
export type GeneratePasswordConfigType = {
    length: 8;

    numbers: true;
    symbols: false;
    lowercase: true;
    uppercase: true;
    excludeSimilarCharacters: false;

    exclude: "0olij ";

    strict: false;
};
