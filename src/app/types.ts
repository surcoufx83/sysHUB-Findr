import { SyshubCategory } from "syshub-rest-module";

export interface UserConfig {
    enableCache: boolean;
    showMoreFilter?: boolean;
}

export interface SearchConfig {
    phrase: string;
    token: string;
    topics: SearchConfigTopics;
    filter: SearchConfigFilter;
    options: SearchConfigOptions;
}

export interface SearchConfigFilter {
    categoryFilter: SyshubCategory | null;
    excludeBComments: boolean;
    includeUuids: boolean;
    searchWorkflowContent: boolean;
}

export interface SearchConfigOptions {
}

export interface SearchConfigTopics {
    config: boolean;
    jobtypes: boolean;
    parameterset: boolean;
    workflows: boolean;
}

export interface SearchResult {
    search: SearchConfig;
    result?: SearchResultUuids;
}

export interface SearchResultUuids {
    config: UuidModifiedObject[];
    jobtypes: UuidModifiedObject[];
    parameterset: UuidModifiedObject[];
    workflows: UuidModifiedObject[];
}

export interface UuidModifiedObject {
    uuid: string;
    modifiedtime: string;
}

export type UuidModifiedTypeObject = {
    uuid: string,
    modifiedtime: number | null,
    path?: string,
    type: 'SyshubCategory' | 'SyshubConfigItem' | 'SyshubJobType' | 'SyshubPSetItem' | 'SyshubWorkflow',
}
