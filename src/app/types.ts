import { BasicRestSettings, OAuthRestSettings, SyshubCategory, SyshubCertStoreItem, SyshubIppDevice, SyshubRole, SyshubServerInformation, SyshubUserAccount } from "syshub-rest-module";

export type FindrEnvironment = {
    api: BasicRestSettings | OAuthRestSettings,
    appInitializationFailure?: {
        configStatusCode: number,
    },
    app?: {
        baseUrl?: string,
        disabledFunctions?: ('config' | 'jobtypes' | 'parameterset' | 'workflows' | 'certstore' | 'serverConfig' | 'serverInfo' | 'ippDevices' | 'users')[];
        promotionLink?: string,
        minPhraseLength?: number,
        useCache?: boolean,
        webclientLink?: string,
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
        tokenKey?: string,
        userconfigKey?: string,
        userdataKey?: string,
        workflowsKey?: string,
    },
}

export type SearchConfig = {
    phrase: string,
    token: string,
    topics: {
        config: boolean,
        jobtypes: boolean,
        parameterset: boolean,
        workflows: boolean,
        system: {
            certstore: boolean,
            serverConfig: boolean,
            serverInfo: boolean,
            ippDevices: boolean,
            users: boolean,
            userRoles: boolean,
        }
    },
    filter: {
        categoryFilter: SyshubCategory | null,
        excludeBComments: boolean,
        includeUuids: boolean,
        searchWorkflowContent: boolean,
    },
    options: {},
}

export type SearchResult = {
    search: SearchConfig,
    result?: SearchResultUuids,
}

export type SearchResultCertStoreContent = {
    keystore: SyshubCertStoreItem[],
    truststore: SyshubCertStoreItem[],
}

export type SearchResultUuids = {
    result: {};
    config: UuidModifiedObject[],
    jobtypes: UuidModifiedObject[],
    parameterset: UuidModifiedObject[],
    workflows: UuidModifiedObject[],
    system?: {
        certstore?: { matches: number, content: SearchResultCertStoreContent } | null | false,
        serverConfig?: { matches: number, content: { [key: string]: string } } | null | false,
        serverInfo?: { matches: number, content: SyshubServerInformation } | null | false,
        ippDevices?: { matches: number, content: SyshubIppDevice[] } | null | false,
        users?: { matches: number, content: SyshubUserAccount[] } | null | false,
        roles?: { matches: number, content: SyshubRole[] } | null | false,
    }
}

export type SimpleKeyValue = {
    key: string,
    value: any
}

export type UuidModifiedObject = {
    uuid: string,
    modifiedtime: string,
}

export type UserConfig = {
    enableCache: boolean,
    showMoreFilter?: boolean,
    showUnmatchedItems?: boolean,
    hideJobtypePercentItems?: boolean,
    hideUnassignedRoles?: boolean,
}

export type UuidModifiedTypeObject = {
    uuid: string,
    modifiedtime: number | string | null,
    path?: string,
    type: 'SyshubCategory' | 'SyshubConfigItem' | 'SyshubJobType' | 'SyshubPSetItem' | 'SyshubWorkflow',
}
