export type L10nLocaleInput = {
    label: string,
    placeholder: string,
    invalidFeedback: string,
};

export type L10nLocale = {
    api: {
        failed: {
            badRequest: string,
            forbidden: string,
            notFound: string,
            serverUnavailable: string,
            unauthorized: string,
            unknown: string
        },
        errorCommon: string
    },
    app: {
        title: string,
        titles: {
            home: string,
            searchOngoing: string,
            resultView: string,
            resultConfigView: string
        },
        configurationFileMissing: string,
    },
    common: {
        clipboard: {
            confirm: string
        },
        locales: { [key: string]: string },
        phrases: {
            no: string[],
            none: string,
            okUc: string,
            toggleItem: string,
            toggleSection: string[],
            yes: string[],
        }
    },
    home: {
        moreFilter: string,
        moreFilterToggle: string,
        runSearch: string,
        welcomeSubtitleNoUser: string,
        welcomeSubtitleUser: string,
        welcomeTitle: string,
        disabledFindr: {
            title: string,
            description: string,
            documentationLink: string,
        }
    },
    login: {
        title: string,
        unlockDescription: string,
        usernameField: L10nLocaleInput,
        passwordField: L10nLocaleInput,
        submitBtn: string,
        submitBtnBusy: string,
        inputInvalidToast: string,
        inputCredentialsToast: string,
        inputServerNotAvailableToast: string
    },
    logout: {
        logoutOngoingMsg: string,
    },
    navbar: {
        aboutLink: string,
        cacheReload: {
            label: string,
            tooltip: string,
        },
        clearCacheLink: string,
        helpLink: string,
        homeLink: string,
        logoutLink: string,
        promoLink: string,
        resultLink: string,
        searchBtn: string,
        searchBtnBusy: string,
        searchHistoryTitle: string,
        searchOptions: string,
        searchPlaceholder: string,
        statsLink: string,
        themeSwitch: string[],
        webclientLink: string
    },
    result: {
        categories: {
            title: string,
        },
        certStoreItem: {
            title: string,
            subtitle: string,
            nodeInspector: {
                alias: string,
                certX509IssuerDN: string,
                certX509NotAfter: string,
                certX509NotBefore: string,
                certX509PrivateKey: string,
                certX509PublicKey: string,
                certX509SerialNumber: string,
                certX509SignatureAlogorithm: string,
                certX509SubjectDN: string,
                fingerprintSHA1: string,
                subject: string,
                subjectAlternativeName: string,
                version: string,
            },
        },
        common: {
            clickToOpenDialog: string,
            nodeInspector: {
                copyTooltip: string,
                copied: string,
            }
        },
        config: {
            title: string,
            subtitle: string,
            nodeInspector: {
                description: string,
                modified: string,
                parentUuid: string,
                path: string,
                subject: string,
                type: string,
                uuid: string,
                value: string,
            }
        },
        header: {
            title: string,
            subtitle: string,
            filterUnmatched: {
                showAll: string,
                showFiltered: string,
            },
        },
        ippDevice: {
            title: string,
            subtitle: string,
            nodeInspector: {
                desc: string,
                form: string,
                location: string,
                maxInputQueueSize: string,
                name: string,
                outputThreshold: string,
                queueSettingsGroup: string,
                si: string,
                so: string,
                state: string,
                subject: string,
                uri: string,
            },
        },
        jobtype: {
            title: string,
            subtitle: string,
            toggleHideEmptySettings: string[],
            nodeInspector: {
                category: string,
                classificationGroup: string,
                classifiedworkflowuuid: string,
                datatype: string,
                deldays: string,
                description: string,
                initialtextstatus: string,
                inputchannel: string,
                jobAttributesGroup: string,
                name: string,
                priority: string,
                processingGroup: string,
                senderhost: string,
                sourcefile: string,
                starttype: string,
                starttypes: string[],
                subject: string,
                textstatus: string,
                ticketfile: string,
                title: string,
                userkey: string,
                username: string,
                uuid: string,
                workflowsGroup: string,
                workflowuuid: string,
                xid: string
            },
        },
        overview: {
            title: string,
            subtitle1: string,
            subtitle2: string,
            propertyType: string
        },
        parameterset: {
            title: string,
            subtitle: string,
            nodeInspector: {
                description: string,
                modified: string,
                parentUuid: string,
                path: string,
                subject: string,
                type: string,
                uuid: string,
                value: string,
            }
        },
        serverInfo: {
            title: string,
            subtitle: string,
        },
        serverProperties: {
            title: string,
            subtitle: string,
        },
        showWorkflow: string,
        toolbar: {
            certStore: string,
            config: string,
            exportResults: string,
            ippDevices: string,
            jobtypes: string,
            matches: string,
            noMatches: string,
            overview: string,
            parameterset: string,
            serverConfig: string,
            serverInfo: string,
            users: string,
            workflows: string,
        },
        useraccount: {
            title: string,
            subtitle: string,
            toggleHideUnassignedRoles: string[],
            nodeInspector: {
                email: string,
                enabled: string,
                forcechange: string,
                modified: string,
                name: string,
                roles: string,
                subject: string,
                type: string,
                types: { [key: string]: string },
                uuid: string,
            },
        },
        workflow: {
            title: string,
            subtitle: string,
            nodeInspector: {
                cacheable: string,
                categoryName: string,
                description: string,
                format: string,
                formats: string[],
                lockedByUser: string,
                modified: string,
                name: string,
                subject: string,
                uuid: string,
                version: string,
            },
        },
    },
    search: {
        errors: {
            phraseEmpty: string
        },
        filter: {
            categoryFilter: string,
            categoryFilterNone: string,
            excludeBComments: string,
            includeUuids: string,
            searchWorkflowContent: string
        },
        options: {
            enableCache: string,
            enableCacheDescription: string
        },
        topics: {
            categories: string,
            certstore: string,
            config: string,
            ippDevices: string,
            jobtypes: string,
            keystore: string,
            parameterset: string,
            serverConfig: string,
            serverInfo: string,
            truststore: string,
            users: string,
            workflows: string
        }
    },
    searching: {
        title: string,
        cardTitle: string,
        progress: { [key: string]: string }
    },
    workflowUi: {
        title: string,
        subtitle: string,
        loading: string[],
        failed: {
            noCache: string,
            noUuid: string,
        },
        failedBackToFindr: string,
        failedCommon: string,
        errorConnector: string,
        celement: {
            instanceName: string,
            subject: string,
            variable: string,
        },
        decision: {
            subject: string,
        },
        process: {
            subject: string[],
        },
        shared: {
            agent: string,
            loop: string,
            parametersetRef: string,
        },
        workflow: {
            startpoint: string,
            subject: string[],
            threads: string,
        },
        versionsDropdown: {
            title: string[],
            titleActiveVersion: string[],
            versionstr: string,
            isactive: string,
            lastactive: string,
        },
        referencesDropdown: {
            title: string[],
            occurencesInWorkflow: string,
        },
    },
}