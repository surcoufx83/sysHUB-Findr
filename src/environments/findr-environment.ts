import { Env } from "syshub-rest-module"

export type FindrEnvironment = {
    production?: boolean,
    api: Env,
    app?: {
        baseUrl?: string,
        promotionLink?: string,
        minPhraseLength?: number,
        useCache?: boolean,
        webclientLink?: string
    },
    i10n?: {
        fallback?: 'de' | 'en',
        locales?: string[],
    },
    storage?: {
        categoriesKey?: string,
        configKey?: string,
        jobtypesKey?: string,
        l10nKey?: string,
        parametersetKey?: string,
        searchconfigKey?: string,
        userconfigKey?: string,
        userdataKey?: string,
        workflowsKey?: string,
    },
}