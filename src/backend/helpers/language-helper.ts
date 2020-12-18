import GlobalMethods from "@Core/Global/global-methods";
import IHash from "@Lib/interfaces/hash-interface";

/**
 * Language helper class
 */
export default class LanguageHelper {
    private langs: IHash<IHash<string>> = {};
    private _lang?: string;

    /**
     * Get lang
     */
    public get lang(): string {
        return this._lang || "";
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
        if (null == this.langs[lang]) {
            const path: string = GlobalMethods.rPath(
                "src/lang",
                `${lang}.json`
            );

            this.langs[lang] = await GlobalMethods.loadModule(path);
        }
    }

    /**
     * Return translated word
     * @param key
     */
    public __(key: string, lang?: string): string {
        return this.langs[lang || this.lang][key];
    }
}
