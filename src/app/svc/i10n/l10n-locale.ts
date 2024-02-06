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
        }
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
        clearCacheLink: string,
        helpLink: string,
        homeLink: string,
        logoutLink: string,
        promoLink: string,
        resultLink: string,
        searchBtn: string,
        searchBtnBusy: string,
        searchOptions: string,
        searchPlaceholder: string,
        statsLink: string,
        webclientLink: string
    },
    result: {
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
            subtitle: string
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
        }
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
    }
}