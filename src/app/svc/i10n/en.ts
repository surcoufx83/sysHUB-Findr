import { L10nLocale } from './l10n-locale';

export const L10nEn: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Invalid request.',
            forbidden: 'Unauthorized access.',
            notFound: 'Resource not available.',
            unauthorized: 'Login failed.',
            unknown: 'Unknown error.'
        },
        errorCommon: 'Error retrieving data from the server: [0]'
    },
    app: {
        title: 'Findr',
        titles: {
            home: 'sysHUB Findr',
            searchOngoing: 'Search in progress...',
            resultView: 'Result View',
            resultConfigView: 'Result (Config)'
        }
    },
    common: {
        clipboard: {
            confirm: 'Value copied to clipboard'
        },
        locales: {
            de: 'German',
            en: 'English',
            fr: 'French',
        },
        phrases: {
            none: 'None',
            okUc: 'OK',
            toggleItem: 'Toggle [0]'
        }
    },
    home: {
        moreFilter: 'Advanced Filters',
        moreFilterToggle: 'Search with advanced filters',
        runSearch: 'Start Search',
        welcomeSubtitleNoUser: 'Hello, what would you like to find today?',
        welcomeSubtitleUser: 'Hello [0], what would you like to find today?',
        welcomeTitle: 'sysHUBFindr',
    },
    login: {
        title: 'Login',
        unlockDescription: 'Please enter your sysHUB credentials for access to the server.',
        usernameField: {
            label: 'sysHUB Username',
            placeholder: 'username',
            invalidFeedback: 'Please provide a username.'
        },
        passwordField: {
            label: 'Password',
            placeholder: 'password',
            invalidFeedback: 'Please enter a password.'
        },
        submitBtn: 'Log In',
        submitBtnBusy: 'Logging in...',
        inputInvalidToast: 'Credentials are incomplete. Please check your inputs.',
        inputCredentialsToast: 'Login rejected by the server. Please verify your credentials and try again.',
        inputServerNotAvailableToast: 'Login failed. The server is currently unavailable.'
    },
    logout: {
        logoutOngoingMsg: 'Logging out...',
    },
    navbar: {
        aboutLink: 'About',
        searchPlaceholder: '🔍 Search term, e.g., currentjob',
        clearCacheLink: 'Clear Cache',
        helpLink: 'Help',
        homeLink: 'Home',
        logoutLink: 'Log Out',
        resultLink: 'Search Results',
        searchBtn: 'Search',
        searchBtnBusy: 'Searching...',
        searchOptions: 'Options',
        statsLink: 'Statistics',
        promoLink: 'Findr on Github',
        webclientLink: 'sysHUB web client'
    },
    result: {
        common: {
            clickToOpenDialog: 'Click to open details for entry "[0]"',
            nodeInspector: {
                copyTooltip: 'Copy to clipboard',
                copied: 'Text "[0]" has been copied to the clipboard.'
            }
        },
        config: {
            title: 'Matches in Expert Configuration',
            subtitle: `
                This page displays the complete tree structure of the expert configuration,
                with matches visually highlighted and automatically expanded.
                Clicking on an entry will display the details in the right-hand section.
            `,
            nodeInspector: {
                description: 'Description',
                modified: 'Modified',
                parentUuid: 'Parent',
                path: 'Path',
                subject: 'Expert Configuration',
                type: 'Type',
                uuid: 'UUID',
                value: 'Value',
            }
        },
        header: {
            title: 'Search Results for "[0]"',
            subtitle: `
                The overview provides a brief summary of the results. For more details,
                click on the buttons of the respective sections below. 
                Gray button = no results in this section.
            `,
        },
        jobtype: {
            title: 'Matches in Job Types, Searching for "[0]"',
            subtitle: `
                This page lists the configured job types, and matches are visually highlighted.
                When hovering over an entry with the cursor, it is displayed on the right side.
                If the pin is active, there will be no change when hovering, but when clicking.
            `,
            attributes: {
                category: 'Category',
                classifiedworkflowuuid: 'Workflow (by Classification)',
                datatype: 'Data Type',
                deldays: 'Delete After Days',
                description: 'Description',
                initialtextstatus: 'Initial Text Status',
                inputchannel: 'Input Channel',
                name: 'Name',
                priority: 'Priority',
                senderhost: 'Sending Host',
                sourcefile: 'Source File',
                starttype: 'Start Type',
                textstatus: 'Text Status',
                ticketfile: 'Ticket File',
                title: 'Title',
                userkey: 'User Key',
                username: 'Username',
                workflowuuid: 'Workflow (Processing)',
                xid: 'Xid'
            },
            customAttributes: 'Attributes',
            selected: 'Details for "[0]"',
            classifySection: 'Classification',
            moreAttributesSection: 'Classification Job Attributes',
            processingSection: 'Processing',
            workflowsSection: 'Workflows'
        },
        overview: {
            title: 'Summary',
            subtitle1: 'The search resulted in a total of <strong>[0]</strong> hits.',
            subtitle2: `
                Below is a list of all the hits. If you want to view these in a tree structure (e.g., for Config and
                Parameterset), use the buttons above to navigate to the respective section.`,
            propertyType: 'Type: [0]'
        },
        parameterset: {
            title: 'Hits in Parameterset, Searching for "[0]"',
            subtitle: `
                On this page, the complete tree structure of the parameterset is displayed,
                and hits are visually highlighted.
                When hovering over an entry with the cursor, it is displayed on the right side.
                If the pin is active, there will be no change when hovering, but there will be when clicking.
            `,
            properties: {
                description: 'Description',
                name: 'Name',
                path: 'Path',
                type: 'Element Type',
                uuid: 'UUID',
                value: 'Value',
            },
            selected: 'Details for "[0]"'
        },
        toolbar: {
            certStore: 'cert. store: [0]',
            config: 'config: [0]',
            exportResults: 'export search results',
            ippDevices: 'printers: [0]',
            jobtypes: 'job types: [0]',
            matches: 'matches',
            noMatches: 'no matches',
            overview: 'overview',
            parameterset: 'param. set: [0]',
            serverConfig: 'server props: [0]',
            serverInfo: 'server info: [0]',
            users: 'users: [0]',
            workflows: 'workflows: [0]',
        },
        showWorkflow: 'Show Workflow'
    },
    search: {
        errors: {
            phraseEmpty: 'Please enter a search term with at least [0] characters.'
        },
        filter: {
            categoryFilter: 'Filter by Category',
            categoryFilterNone: 'Not Applied',
            excludeBComments: 'Ignore [B] Comments',
            includeUuids: 'Search UUIDs',
            searchWorkflowContent: 'Include Workflow Contents',
        },
        options: {
            enableCache: 'Use Browser Cache',
            enableCacheDescription: `
                    When this option is enabled, various elements are cached in the browser.
                    If these elements are found again later, they do not need to be loaded from the server again.
                `
        },
        topics: {
            categories: 'Categories',
            certstore: 'Certificate Store',
            config: 'Configuration',
            ippDevices: 'Printers',
            jobtypes: 'Job Types',
            keystore: 'Keystore',
            parameterset: 'Parameter Set',
            serverConfig: 'Server Properties',
            serverInfo: 'Server Infos',
            truststore: 'Truststore',
            users: 'Users',
            workflows: 'Workflows',
        }
    },
    searching: {
        title: '',
        cardTitle: 'Searching for "[0]"',
        progress: {
            done: 'All done. Redirecting to the results view...',
            evaluatingResults: 'The results have been loaded from the server and are being prepared for display...',
            queryingObjects: 'The match objects are now being loaded from the server and may be cached in the browser...',
            preparingResultView: 'Preparing the result view...',
            waitingForResults: 'The search request has been sent to the server. Waiting for the results...',
        }
    }
};
