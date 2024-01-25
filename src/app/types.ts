import { SyshubCategory, SyshubCertStoreItem, SyshubIppDevice, SyshubServerInformation, SyshubUserAccount } from "syshub-rest-module";

export type UserConfig = {
    enableCache: boolean,
    showMoreFilter?: boolean,
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

export type SearchResultUuids = {
    result: {};
    config: UuidModifiedObject[],
    jobtypes: UuidModifiedObject[],
    parameterset: UuidModifiedObject[],
    workflows: UuidModifiedObject[],
    system?: {
        certstore?: { keystore: SyshubCertStoreItem[], truststore: SyshubCertStoreItem[] } | null | false,
        serverConfig?: { [key: string]: string } | null | false,
        serverInfo?: SyshubServerInformation | null | false,
        ippDevices?: SyshubIppDevice[] | null | false,
        users?: SyshubUserAccount[] | null | false,
    }
}

export type UuidModifiedObject = {
    uuid: string,
    modifiedtime: string,
}

export type UuidModifiedTypeObject = {
    uuid: string,
    modifiedtime: number | null,
    path?: string,
    type: 'SyshubCategory' | 'SyshubConfigItem' | 'SyshubJobType' | 'SyshubPSetItem' | 'SyshubWorkflow',
}
