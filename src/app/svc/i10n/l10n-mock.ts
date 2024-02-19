import { L10nLocale } from './l10n-locale';

export const MockL10n: L10nLocale = {
    api: {
        failed: {
            badRequest: 'mock-badRequest',
            forbidden: 'mock-forbidden',
            notFound: 'mock-notFound',
            serverUnavailable: 'mock-serverUnavailable',
            unauthorized: 'mock-unauthorized',
            unknown: 'mock-unknown',
        },
        errorCommon: 'mock-errorCommon',
    },
    app: {
        title: 'mock-title',
        titles: {
            home: 'mock-home',
            searchOngoing: 'mock-searchOngoing',
            resultView: 'mock-resultView',
            resultConfigView: 'mock-resultConfigView',
        },
        configurationFileMissing: 'mock-configurationFileMissing',
    },
    common: {
        clipboard: {
            confirm: 'mock-confirm',
        },
        locales: {
            de: 'mock-de',
            en: 'mock-en',
            fr: 'mock-fr',
        },
        phrases: {
            no: ['mock-no0', 'mock-no1'],
            none: 'mock-none',
            okUc: 'mock-okUc',
            toggleItem: 'mock-toggleItem',
            toggleSection: ['mock-toggleSection0', 'mock-toggleSection1'],
            yes: ['mock-yes0', 'mock-yes1'],
        },
    },
    home: {
        moreFilter: 'mock-moreFilter',
        moreFilterToggle: 'mock-moreFilterToggle',
        runSearch: 'mock-runSearch',
        welcomeSubtitleNoUser: 'mock-welcomeSubtitleNoUser',
        welcomeSubtitleUser: 'mock-welcomeSubtitleUser',
        welcomeTitle: 'mock-welcomeTitle',
        disabledFindr: {
            title: 'mock-title',
            description: 'mock-description',
            documentationLink: 'mock-documentationLink',
        }
    },
    login: {
        title: 'mock-title',
        unlockDescription: 'mock-unlockDescription',
        usernameField: {
            label: 'mock-label',
            placeholder: 'mock-placeholder',
            invalidFeedback: 'mock-invalidFeedback',
        },
        passwordField: {
            label: 'mock-label',
            placeholder: 'mock-placeholder',
            invalidFeedback: 'mock-invalidFeedback',
        },
        submitBtn: 'mock-submitBtn',
        submitBtnBusy: 'mock-submitBtnBusy',
        inputInvalidToast: 'mock-inputInvalidToast',
        inputCredentialsToast: 'mock-inputCredentialsToast',
        inputServerNotAvailableToast: 'mock-inputServerNotAvailableToast',
    },
    logout: {
        logoutOngoingMsg: 'mock-logoutOngoingMsg',
    },
    navbar: {
        aboutLink: 'mock-aboutLink',
        clearCacheLink: 'mock-clearCacheLink',
        helpLink: 'mock-helpLink',
        homeLink: 'mock-homeLink',
        logoutLink: 'mock-logoutLink',
        promoLink: 'mock-promoLink',
        resultLink: 'mock-resultLink',
        searchBtn: 'mock-searchBtn',
        searchBtnBusy: 'mock-searchBtnBusy',
        searchOptions: 'mock-searchOptions',
        searchPlaceholder: 'mock-searchPlaceholder',
        statsLink: 'mock-statsLink',
        themeSwitch: ['mock-themeSwitch0', 'mock-themeSwitch1', 'mock-themeSwitch2'],
        webclientLink: 'mock-webclientLink',
    },
    result: {
        certStoreItem: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            nodeInspector: {
                alias: 'mock-alias',
                certX509IssuerDN: 'mock-certX509IssuerDN',
                certX509NotAfter: 'mock-certX509NotAfter',
                certX509NotBefore: 'mock-certX509NotBefore',
                certX509PrivateKey: 'mock-certX509PrivateKey',
                certX509PublicKey: 'mock-certX509PublicKey',
                certX509SerialNumber: 'mock-certX509SerialNumber',
                certX509SignatureAlogorithm: 'mock-certX509SignatureAlogorithm',
                certX509SubjectDN: 'mock-certX509SubjectDN',
                fingerprintSHA1: 'mock-fingerprintSHA1',
                subject: 'mock-subject',
                subjectAlternativeName: 'mock-subjectAlternativeName',
                version: 'mock-version',
            },
        },
        common: {
            clickToOpenDialog: 'mock-clickToOpenDialog',
            nodeInspector: {
                copyTooltip: 'mock-copyTooltip',
                copied: 'mock-copied',
            },
        },
        config: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            nodeInspector: {
                description: 'mock-description',
                modified: 'mock-modified',
                parentUuid: 'mock-parentUuid',
                path: 'mock-path',
                subject: 'mock-subject',
                type: 'mock-type',
                uuid: 'mock-uuid',
                value: 'mock-value',
            }
        },
        header: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
        },
        ippDevice: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            nodeInspector: {
                desc: 'mock-desc',
                form: 'mock-form',
                location: 'mock-location',
                maxInputQueueSize: 'mock-maxInputQueueSize',
                name: 'mock-name',
                outputThreshold: 'mock-outputThreshold',
                queueSettingsGroup: 'mock-queueSettingsGroup',
                si: 'mock-si',
                so: 'mock-so',
                state: 'mock-state',
                subject: 'mock-subject',
                uri: 'mock-uri',
            }
        },
        jobtype: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            toggleHideEmptySettings: ['mock-toggleHideEmptySettings0', 'mock-toggleHideEmptySettings1'],
            nodeInspector: {
                category: 'mock-category',
                classificationGroup: 'mock-classificationGroup',
                classifiedworkflowuuid: 'mock-classifiedworkflowuuid',
                datatype: 'mock-datatype',
                deldays: 'mock-deldays',
                description: 'mock-description',
                initialtextstatus: 'mock-initialtextstatus',
                inputchannel: 'mock-inputchannel',
                jobAttributesGroup: 'mock-jobAttributesGroup',
                name: 'mock-name',
                priority: 'mock-priority',
                processingGroup: 'mock-processingGroup',
                senderhost: 'mock-senderhost',
                sourcefile: 'mock-sourcefile',
                starttype: 'mock-starttype',
                starttypes: ['mock-starttypes0', 'mock-starttypes1', 'mock-starttypes2'],
                subject: 'mock-subject',
                textstatus: 'mock-textstatus',
                ticketfile: 'mock-ticketfile',
                title: 'mock-title',
                userkey: 'mock-userkey',
                username: 'mock-username',
                uuid: 'mock-uuid',
                workflowsGroup: 'mock-workflowsGroup',
                workflowuuid: 'mock-workflowuuid',
                xid: 'mock-xid',
            },
        },
        overview: {
            title: 'mock-title',
            subtitle1: 'mock-subtitle1',
            subtitle2: 'mock-subtitle2',
            propertyType: 'mock-propertyType',
        },
        parameterset: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            nodeInspector: {
                description: 'mock-description',
                modified: 'mock-modified',
                parentUuid: 'mock-parentUuid',
                path: 'mock-path',
                subject: 'mock-subject',
                type: 'mock-type',
                uuid: 'mock-uuid',
                value: 'mock-value',
            }
        },
        serverInfo: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
        },
        serverProperties: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
        },
        showWorkflow: 'mock-showWorkflow',
        toolbar: {
            certStore: 'mock-certStore',
            config: 'mock-config',
            exportResults: 'mock-exportResults',
            ippDevices: 'mock-ippDevices',
            jobtypes: 'mock-jobtypes',
            matches: 'mock-matches',
            noMatches: 'mock-noMatches',
            overview: 'mock-overview',
            parameterset: 'mock-parameterset',
            serverConfig: 'mock-serverConfig',
            serverInfo: 'mock-serverInfo',
            users: 'mock-users',
            workflows: 'mock-workflows',
        },
        useraccount: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            toggleHideUnassignedRoles: ['mock-toggleHideUnassignedRoles0', 'mock-toggleHideUnassignedRoles1'],
            nodeInspector: {
                email: 'mock-email',
                enabled: 'mock-enabled',
                forcechange: 'mock-forcechange',
                modified: 'mock-modified',
                name: 'mock-name',
                roles: 'mock-roles',
                subject: 'mock-subject',
                type: 'mock-type',
                types: {
                    'INTERNAL': 'mock-INTERNAL',
                    'LDAP': 'mock-LDAP',
                    'WINDOWS': 'mock-WINDOWS',
                },
                uuid: 'mock-uuid',
            },
        },
        workflow: {
            title: 'mock-title',
            subtitle: 'mock-subtitle',
            nodeInspector: {
                cacheable: 'mock-cacheable',
                categoryName: 'mock-categoryName',
                description: 'mock-description',
                format: 'mock-format',
                formats: ['mock-formats0', 'mock-formats1'],
                lockedByUser: 'mock-lockedByUser',
                modified: 'mock-modified',
                name: 'mock-name',
                subject: 'mock-subject',
                uuid: 'mock-uuid',
                version: 'mock-version',
            },
        },
    },
    search: {
        errors: {
            phraseEmpty: 'mock-phraseEmpty',
        },
        filter: {
            categoryFilter: 'mock-categoryFilter',
            categoryFilterNone: 'mock-categoryFilterNone',
            excludeBComments: 'mock-excludeBComments',
            includeUuids: 'mock-includeUuids',
            searchWorkflowContent: 'mock-searchWorkflowContent',
        },
        options: {
            enableCache: 'mock-enableCache',
            enableCacheDescription: 'mock-enableCacheDescription',
        },
        topics: {
            categories: 'mock-categories',
            certstore: 'mock-certstore',
            config: 'mock-config',
            ippDevices: 'mock-ippDevices',
            jobtypes: 'mock-jobtypes',
            keystore: 'mock-keystore',
            parameterset: 'mock-parameterset',
            serverConfig: 'mock-serverConfig',
            serverInfo: 'mock-serverInfo',
            truststore: 'mock-truststore',
            users: 'mock-users',
            workflows: 'mock-workflows',
        }
    },
    searching: {
        title: 'mock-title',
        cardTitle: 'mock-cardTitle',
        progress: {
            done: 'mock-done',
            evaluatingResults: 'mock-evaluatingResults',
            queryingObjects: 'mock-queryingObjects',
            preparingResultView: 'mock-preparingResultView',
            waitingForResults: 'mock-waitingForResults',
        }
    },
    workflowUi: {
        title: 'mock-title',
        subtitle: 'mock-subtitle',
        failed: {
            noCache: 'mock-noCache',
            noUuid: 'mock-noUuid',
        },
        failedBackToFindr: 'mock-failedBackToFindr',
        failedCommon: 'mock-failedCommon',
        errorConnector: 'mock-errorConnector',
        celement: {
            instanceName: 'mock-instanceName',
            subject: 'mock-subject',
            variable: 'mock-variable',
        },
        decision: {
            subject: 'mock-subject',
        },
        process: {
            subject: ['mock-subject0', 'mock-subject1'],
        },
        shared: {
            agent: 'mock-agent',
            loop: 'mock-loop',
            parametersetRef: 'mock-parametersetRef',
        },
        workflow: {
            startpoint: 'mock-startpoint',
            subject: ['mock-subject0', 'mock-subject1'],
            threads: 'mock-threads',
        },
        versionsDropdown: {
            title: ['mock-title0', 'mock-title1'],
            titleActiveVersion: ['mock-titleActiveVersion0', 'mock-titleActiveVersion1'],
            versionstr: 'mock-versionstr',
            isactive: 'mock-isactive',
            lastactive: 'mock-lastactive',
        },
        referencesDropdown: {
            title: ['mock-title0', 'mock-title1'],
            occurencesInWorkflow: 'mock-occurencesInWorkflow',
        },
    },
};
