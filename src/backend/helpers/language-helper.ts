import GlobalMethods from "@Core/Global/global-methods";
import IHash from "@Lib/interfaces/hash-interface";

/**
 * Language helper class
 */
export default class LanguageHelper {
    private _lang?: string;
    private _dic: IHash<string> = {};

    /**
     * Get lang
     */
    public get lang(): string {
        return this._lang || "";
    }

    /**
     * Get Dictionary
     */
    public get dic(): IHash<string> {
        return this._dic;
    }

    /**
     * constructor
     * @param lang string Language
     */
    constructor(lang: string) {
        this.setLang(lang);
    }

    /**
     * Set language
     * @param lang string Language
     */
    public async setLang(lang: string): Promise<void> {
        this._lang = lang;
        await this.loadDic(lang);
    }

    /**
     * Load a dictionary
     * @param lang string Language
     */
    public async loadDic(lang: string): Promise<void> {
        const path: string = GlobalMethods.rPath("src/lang", `${lang}.json`);

        this._dic = await GlobalMethods.loadModule(path);
    }

    /**
     * Return translated word
     * @param key
     */
    public __(key: string): string {
        return this.dic[key];
    }
}
