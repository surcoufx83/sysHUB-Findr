import { Env } from "syshub-rest-module"

export type FindrEnvironment = {
    production?: boolean,
    api: Env,
    app?: {
        baseUrl?: string,
        promotionLink?: string,
        minPhraseLength?: number,
        useCache?: boolean,
    },
    i10n?: {
        fallback?: 'de' | 'en',
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