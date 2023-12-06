import { L10nLocale } from "./l10n-locale";

export const L10nEn: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Invalid request.',
            forbidden: 'No permission.',
            notFound: 'Resource not available.',
            unauthorized: 'Login failed.',
            unknown: 'Unknown error.'
        },
        errorCommon: 'Error retrieving data from the server: {0}'
    },
    app: {
        title: 'Findr',
        titles: {
            home: 'sysHUB Findr',
            searchOngoing: 'Searching...',
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
        },
        phrases: {
            none: '»None«',
            okUc: 'OK',
            toggleItem: 'Toggle {0} open or close'
        }
    },
    home: {
        title: 'Search Configuration',
        welcomeTitle: 'sysHUB Findr Start',
        welcomeSubtitleUser: 'Hello {0}, what would you like to search for today?',
        welcomeSubtitleNoUser: 'Hello, what are you looking to search for today?',
        enterPhrase: 'Enter your search term',
        runSearch: 'Start Search',
        tabs: {
            topics: 'Search Areas',
            filter: 'Restrictions',
            options: 'Options',
        }
    },
    login: {
        title: 'Login',
        unlockDescription: 'Please enter your sysHUB credentials for server access.',
        usernameField: {
            label: 'sysHUB Username',
            placeholder: 'username',
            invalidFeedback: 'Please enter a username.'
        },
        passwordField: {
            label: 'Password',
            placeholder: 'password',
            invalidFeedback: 'Please enter a password.'
        },
        submitBtn: 'Log In',
        submitBtnBusy: 'Logging in...',
        inputInvalidToast: 'The credentials are incomplete. Please check your entries.',
        inputCredentialsToast: 'Login rejected by the server. Please check your entries and try again.',
        inputServerNotAvailableToast: 'Anmeldung fehlgeschlagen. Der Server ist gerade nicht erreichbar.'
    },
    navbar: {
        aboutLink: 'About',
        searchPlaceholder: '🔍 Search term, e.g., currentjob',
        clearCacheLink: 'Clear Cache',
        helpLink: 'Help',
        homeLink: 'Home',
        localeIsActive: 'in use',
        logoutLink: 'Logout',
        searchBtn: 'Search',
        searchBtnBusy: 'Searching...',
        searchOptions: 'Options',
        statsLink: 'Statistics',
        promoLink: 'Findr on Github',
        webclientLink: 'sysHUB web client'
    },
    result: {
        config: {
            title: 'Matches in Configuration, Searching for \"{0}\"',
            subtitle: `
                This page displays the entire tree structure of the expert configuration
                and highlights matches visually.
                Hovering the cursor over an entry displays it on the right side.
                If the pin is active, hovering will no longer switch the display, but clicking will.
            `,
            properties: {
                description: 'Description',
                name: 'Name',
                path: 'Path',
                type: 'Element Type',
                uuid: 'Uuid',
                value: 'Value',
            },
            selected: 'Details for \"{0}\"'
        },
        jobtype: {
            title: 'Matches in Job Types, Searching for \"{0}\"',
            subtitle: `
                This page lists the configured job types and
                visually highlights matches.
                Hovering the cursor over an entry displays it on the right side.
                If the pin is active, hovering will no longer switch the display, but clicking will.
            `,
            attributes: {
                category: 'Category',
                classifiedworkflowuuid: 'Workflow (after Classification)',
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
            selected: 'Details for \"{0}\"',
            classifySection: 'Classification',
            moreAttributesSection: 'Job Attributes Classification',
            processingSection: 'Processing',
            workflowsSection: 'Workflows'
        },
        overview: {
            title: 'Search Results for \"{0}\"',
            subtitle: `
                The following list is just a brief summary. Detailed
                results and graphical representation (tree structure and workflow designer)
                can be accessed via the buttons above.
            `
        },
        parameterset: {
            title: 'Matches in Parameter Set, Searching for \"{0}\"',
            subtitle: `
                This page displays the complete tree structure of the parameter set
                and highlights matches visually.
                Hovering the cursor over an entry displays it on the right side.
                If the pin is active, hovering will no longer switch the display, but clicking will.
            `,
            properties: {
                description: 'Description',
                name: 'Name',
                path: 'Path',
                type: 'Element Type',
                uuid: 'Uuid',
                value: 'Value',
            },
            selected: 'Details for \"{0}\"'
        },
        toolbar: {
            overview: 'Overview',
            config: 'Config: {0}',
            jobtypes: 'Job Types: {0}',
            parameterset: 'Parameter Set: {0}',
            workflows: 'Workflows: {0}',
        },
        showWorkflow: 'Show Workflow'
    },
    search: {
        errors: {
            phraseEmpty: 'Please enter a search term with at least {0} characters.'
        },
        filter: {
            categoryFilter: 'Filter by Category',
            categoryFilterNone: 'Not Filtered',
            categoryFilterDescription: `
                Filter by category: If set, only objects assigned to this category
                are determined. All other objects are ignored.
            `,
            excludeBComments: 'Ignore [B] Comments',
            includeUuids: 'Search UUIDs',
            searchWorkflowContent: 'Include Workflow Contents',
            searchWorkflowContentDescription: `
                Searching the workflow contents takes significantly longer and generates
                a lot of load on the system and database.
            `
        },
        options: {
            enableCache: 'Use Browser Cache',
            enableCacheDescription: `
                If this option is set, various elements are cached in the browser.
                If these elements are found again later, they do not need to be loaded
                from the server again.
            `
        },
        topics: {
            categories: 'Categories',
            config: 'Configuration',
            jobtypes: 'Job Types',
            parameterset: 'Parameter Set',
            workflows: 'Workflows',
        }
    },
    searching: {
        title: '',
        cardTitle: 'Searching for {0}',
        progress: {
            done: 'All done. Redirecting to the results view...',
            evaluatingResults: 'Results have been loaded from the server and are being prepared for display...',
            queryingObjects: 'The matching objects are now being loaded from the server and may be stored in the browser cache...',
            preparingResultView: 'Preparing the results view...',
            waitingForResults: 'Search request has been sent to the server. Waiting for the result...',
        }
    }
};
