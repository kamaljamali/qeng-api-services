// length	Integer, length of password.	10
// numbers*	Boolean, put numbers in password.	false
// symbols*	Boolean, put symbols in password.	false
// lowercase*	Boolean, put lowercase in password	true
// uppercase*	Boolean, use uppercase letters in password.	true
// excludeSimilarCharacters	Boolean, exclude similar chars, like 'i' and 'l'.	false
// exclude	String, characters to be excluded from password.	''
// strict	Boolean, password must include at least one character from each pool.	false
/**
 * GeneratePasswordConfigType Config Type
 */
export type GeneratePasswordConfigType = {
    length: number;

    numbers: boolean;
    symbols: boolean;
    lowercase: boolean;
    uppercase: boolean;
    excludeSimilarCharacters: boolean;

    exclude: string;

    strict: boolean;
};
