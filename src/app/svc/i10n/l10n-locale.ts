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
            none: string,
            okUc: string,
            toggleItem: string
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
    }
    navbar: {
        aboutLink: string,
        clearCacheLink: string,
        helpLink: string,
        homeLink: string,
        localeIsActive: string,
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
        config: {
            title: string,
            subtitle: string,
            properties: {
                description: string,
                name: string,
                path: string,
                type: string,
                uuid: string,
                value: string,
            },
            selected: string
        },
        jobtype: {
            attributes: {
                category: string,
                classifiedworkflowuuid: string,
                datatype: string,
                deldays: string,
                description: string,
                initialtextstatus: string,
                inputchannel: string,
                name: string,
                priority: string,
                senderhost: string,
                sourcefile: string,
                starttype: string,
                textstatus: string,
                ticketfile: string,
                title: string,
                userkey: string,
                username: string,
                workflowuuid: string,
                xid: string
            },
            classifySection: string,
            customAttributes: string,
            moreAttributesSection: string,
            processingSection: string,
            selected: string,
            subtitle: string,
            title: string,
            workflowsSection: string
        },
        overview: {
            title: string,
            subtitle: string
        },
        parameterset: {
            properties: {
                description: string,
                name: string,
                path: string,
                type: string,
                uuid: string,
                value: string
            },
            selected: string,
            subtitle: string,
            title: string
        },
        showWorkflow: string,
        toolbar: {
            certStore: string,
            config: string,
            ippDevices: string,
            jobtypes: string,
            matches: string,
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
            parameterset: string,
            serverConfig: string,
            serverInfo: string,
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