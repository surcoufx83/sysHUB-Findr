import { SyshubCategory } from "syshub-rest-module";

export interface UserConfig {
    enableCache: boolean;
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

/* 
export interface SyshubCategory {
    description: string;
    modifiedby: string | null;
    modifiedtime: number;
    name: string;
    uuid: string;
}

export interface RestApiCategoryListReply {
    children: SyshubCategory[];
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

export interface SyshubConfig {
    children: SyshubConfig[];
    description: string | null;
    modifiedtime: string;
    name: string;
    parent: string|null;
    parentRef?: SyshubConfig;
    path: string;
    path2copy: string;
    type: string
    uuid: string;
    value: string;
}

export interface SyshubJobtype {
    category: SyshubCategory | null;
    description: string | null;
    name: string;
    settings: SyshubJobtypeSettings;
    uuid: string;
}

export interface RestApiJobtypeListReply {
    children: SyshubJobtype[];
}

export interface SyshubJobtypeSettings {
    classifiedworkflowuuid: SyshubValueItem;
    datatype: SyshubValueItem;
    deldays: SyshubValueItem;
    initialtextstatus: SyshubValueItem;
    inputchannel: SyshubValueItem;
    priority: SyshubValueItem;
    PropChildren?: SyshubNameValueItem[];
    senderhost: SyshubValueItem;
    sourcefile: SyshubValueItem;
    starttype: SyshubValueItem;
    textstatus: SyshubValueItem;
    ticketfile: SyshubValueItem;
    title: SyshubValueItem;
    userkey: SyshubValueItem;
    username: SyshubValueItem;
    workflowuuid: SyshubValueItem;
    xid: SyshubValueItem;
}

export interface SyshubNameValueItem {
    name: string;
    value: string;
}

export interface SyshubValueItem {
    value: string | number | null;
}

export interface SyshubParameterset {
    children: SyshubParameterset[];
    description: string | null;
    modifiedtime: string;
    name: string;
    parent: string | null;
    parentRef?: SyshubParameterset;
    path: string;
    path2copy: string;
    type: string
    uuid: string;
    value: string;
}

export interface SyshubWorkflow {
    activatedBy: string;
    activatedTime: string;
    cacheable: string;
    categoryName: string;
    description: string;
    flag: string;
    format: string;
    lockedByUser: string;
    major: string;
    majorBase: string;
    minor: string;
    minorBase: string;
    modifiedBy: string;
    modifiedTime: string;
    name: string;
    uuid: string;
}

export interface UuidModifiedObject {
    uuid: string;
    modifiedtime: string;
}

export interface Workflow {

}
 */