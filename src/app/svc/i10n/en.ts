import { L10nLocale } from './l10n-locale';

export const L10nEn: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Invalid request.',
            forbidden: 'Unauthorized access.',
            notFound: 'Resource not available.',
            serverUnavailable: 'Unable to connect to the server. Please check if the server is running and available.',
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
        },
        configurationFileMissing: 'The Findr configuration could not be loaded. <a class="text-light" target="_blank" href="https://github.com/surcoufx83/sysHUB-Findr?tab=readme-ov-file#konfiguration-work-in-progress-see-3">Please configure according to the instructions.</a>',
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
            no: ['no', 'No'],
            none: '»None«',
            okUc: 'OK',
            toggleItem: 'Toggle [0]',
            toggleSection: ['Click to expand section "[0]"', 'Click to collapse section "[0]"'],
            yes: ['yes', 'Yes'],
        },
    },
    home: {
        moreFilter: 'Advanced Filters',
        moreFilterToggle: 'Search with advanced filters',
        runSearch: 'Start Search',
        welcomeSubtitleNoUser: 'Hello, what would you like to find today?',
        welcomeSubtitleUser: 'Hello [0], what would you like to find today?',
        welcomeTitle: 'sysHUBFindr',
        disabledFindr: {
            title: 'Findr disabled!',
            description: 'Findr requires a specific configuration for searching and displaying results.',
            documentationLink: 'See Readme on Github, Configuration Parameters section, Parameter syshub.oauth.scope'
        }
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
        clearCacheLink: 'Clear Cache',
        helpLink: 'Help',
        homeLink: 'Home',
        logoutLink: 'Logout',
        promoLink: 'Findr on Github',
        resultLink: 'Search Result',
        searchBtn: 'Search',
        searchBtnBusy: 'Searching...',
        searchOptions: 'Options',
        searchPlaceholder: '🔍 Search term, e.g., currentjob',
        statsLink: 'Statistics',
        themeSwitch: ['light', 'dark', 'automatic'],
        webclientLink: 'sysHUB web client'
    },
    result: {
        certStoreItem: {
            title: 'Certificate Store',
            subtitle: `
                The certificate store is divided into Keystore and Truststore.
                The Keystore stores private keys used for encryption, authentication, and integrity verification.
                The Truststore contains trusted public keys used for verifying the authenticity of remote systems or peers.
                If the search term is found in a certificate, the corresponding entry is highlighted.
            `,
            nodeInspector: {
                alias: 'Alias',
                certX509IssuerDN: 'Issued by',
                certX509NotAfter: 'Valid until',
                certX509NotBefore: 'Valid from',
                certX509PrivateKey: 'Private Key',
                certX509PublicKey: 'Public Key',
                certX509SerialNumber: 'Serial Number',
                certX509SignatureAlogorithm: 'Algorithm',
                certX509SubjectDN: 'Issued to',
                fingerprintSHA1: 'SHA-1 Hash',
                subject: 'Certificate',
                subjectAlternativeName: 'Alternative Names',
                version: 'Version',
            },
        },
        common: {
            clickToOpenDialog: 'Click to open details for entry "[0]"',
            nodeInspector: {
                copyTooltip: 'Copy to clipboard',
                copied: 'Text "[0]" has been copied to the clipboard.',
            },
        },
        config: {
            title: 'Expert Configuration',
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
        ippDevice: {
            title: 'sysHUB IPP Printers',
            subtitle: `
                The following list contains printers registered in sysHUB (IPP Devices).
                Search results are highlighted, and clicking on an entry will display the details in the right panel.
            `,
            nodeInspector: {
                desc: 'Description',
                form: 'Form',
                location: 'Location',
                maxInputQueueSize: 'Limit Input Queue',
                name: 'Name',
                outputThreshold: 'Output Threshold',
                queueSettingsGroup: 'Job Queue',
                si: 'Spool-in',
                so: 'Spool-out',
                state: 'Active',
                subject: 'IPP Device',
                uri: 'Address',
            }
        },
        jobtype: {
            title: 'Job Types',
            subtitle: `
                This page lists the configured job types, and matches are visually highlighted.
                When clicking on an entry, the details are displayed on the right side.
            `,
            toggleHideEmptySettings: ['Empty and %-values are hidden. Click to show', 'Click to hide empty or %-values'],
            nodeInspector: {
                category: 'Category',
                classificationGroup: 'Classification',
                classifiedworkflowuuid: 'Workflow (by Classification)',
                datatype: 'Data Type',
                deldays: 'Delete After Days',
                description: 'Description',
                initialtextstatus: 'Initial Text Status',
                inputchannel: 'Input Channel',
                jobAttributesGroup: 'Job Attributes for Classification',
                name: 'Name',
                priority: 'Priority',
                processingGroup: 'Processing',
                senderhost: 'Sending Host',
                sourcefile: 'Source File',
                starttype: 'Start Type',
                starttypes: ['Automatic', 'Hold', 'Timed hold'],
                subject: 'Job Types',
                textstatus: 'Text Status',
                ticketfile: 'Ticket File',
                title: 'Title',
                userkey: 'User Key',
                username: 'Username',
                uuid: 'Uuid',
                workflowsGroup: 'Workflows',
                workflowuuid: 'Workflow (Processing)',
                xid: 'Xid',
            },
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
            title: 'Parameter Set',
            subtitle: `
                This page displays the complete tree structure of the parameter set,
                with matches visually highlighted and automatically expanded.
                Clicking on an entry will display the details in the right-hand section.
            `,
            nodeInspector: {
                description: 'Description',
                modified: 'Modified',
                parentUuid: 'Parent',
                path: 'Path',
                subject: 'Parameter Set',
                type: 'Type',
                uuid: 'UUID',
                value: 'Value',
            }
        },
        serverInfo: {
            title: 'Server Information',
            subtitle: `
                The following list contains information provided by the server.
                Matches are highlighted in color.
            `,
        },
        serverProperties: {
            title: 'Server Configuration (server.properties)',
            subtitle: `
                The following list contains all configuration entries returned by the server,
                corresponding to the server.properties file. Matches are highlighted in color.
            `,
        },
        showWorkflow: 'Show Workflow',
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
        useraccount: {
            title: 'User Accounts',
            subtitle: `
                The table contains user accounts registered in sysHUB.
                Matches are highlighted in color.
            `,
            toggleHideUnassignedRoles: ['Unassigned roles are hidden. Click to show', 'Click to hide unassigned roles'],
            nodeInspector: {
                email: 'Email',
                enabled: 'Enabled',
                forcechange: 'Must change password',
                modified: 'Modified',
                name: 'Name',
                roles: 'Roles',
                subject: 'User Account',
                type: 'Type',
                types: {
                    'INTERNAL': 'sysHUB User',
                    'LDAP': 'Domain User',
                    'WINDOWS': 'Windows User',
                },
                uuid: 'Uuid',
            },
        },
        workflow: {
            title: 'Workflows',
            subtitle: `
                In the list, workflows are highlighted in color if there is a match in the metadata or the workflow itself.
                Click on an entry to see the details or on the flowchart icon to display the workflow.
            `,
            nodeInspector: {
                cacheable: 'Cache active',
                categoryName: 'Category',
                description: 'Description',
                format: 'Format',
                formats: ['Native Client', 'Webclient'],
                lockedByUser: 'Locked',
                modified: 'Modified',
                name: 'Name',
                subject: 'Workflow',
                uuid: 'Uuid',
                version: 'Version',
            },
        },
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
        cardTitle: 'Searching for »[0]«',
        progress: {
            done: 'All done. Redirecting to the results view...',
            evaluatingResults: 'The results have been loaded from the server and are being prepared for display...',
            queryingObjects: 'The match objects are now being loaded from the server and may be cached in the browser...',
            preparingResultView: 'Preparing the result view...',
            waitingForResults: 'The search request has been sent to the server. Waiting for the results...',
        }
    },
    workflowUi: {
        title: 'Workflow »[0]«',
        subtitle: '',
        failed: {
            noCache: 'No workflow could be found under the specified workflow ID.',
            noUuid: 'The called URL is faulty.',
        },
        failedBackToFindr: 'Back to homepage',
        failedCommon: 'Error displaying the workflow: ',
        errorConnector: 'On Error',
        celement: {
            instanceName: 'Instance',
            subject: 'CElement',
            variable: 'Variable',
        },
        decision: {
            subject: 'Decision',
        },
        process: {
            subject: ['Process', 'Loop Process'],
        },
        shared: {
            agent: 'Agent',
            loop: 'Looparray',
            parametersetRef: 'Parameterset',
        },
        workflow: {
            startpoint: 'Startpoint',
            subject: ['Workflow', 'Loop Workflow'],
            threads: 'Threads',
        },
        versionsDropdown: {
            title: ['[0] versions (current: [1])', '[0] versions (edited: [1])'],
            versionstr: '[0].[1]',
            isactive: 'active',
            lastactive: 'in progress'
        },
        referencesDropdown: {
            title: ['No references', '[0] reference', '[0] references'],
            occurencesInWorkflow: '[0]x in [1]',
        },
    },
};
