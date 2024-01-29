import { L10nLocale } from './l10n-locale';

export const L10nDe: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Ungültige Anfrage.',
            forbidden: 'Keine Berechtigung.',
            notFound: 'Resource nicht verfügbar.',
            unauthorized: 'Anmeldung fehlgeschlagen.',
            unknown: 'Unbekannter Fehler.'
        },
        errorCommon: 'Fehler beim Abrufen der Daten vom Server: [0]'
    },
    app: {
        title: 'Findr',
        titles: {
            home: 'sysHUB Findr',
            searchOngoing: 'Suche läuft...',
            resultView: 'Ergebnisansicht',
            resultConfigView: 'Ergebnis (Konfig)'
        }
    },
    common: {
        clipboard: {
            confirm: 'Wert wurde in die Zwischenablage kopiert'
        },
        locales: {
            de: 'Deutsch',
            en: 'Englisch',
            fr: 'Französisch',
        },
        phrases: {
            none: '»Keine«',
            okUc: 'OK',
            toggleItem: '[0] auf- bzw. zuklappen'
        }
    },
    home: {
        moreFilter: 'Erweiterte Filter',
        moreFilterToggle: 'Suche mit erweiterten Filtern',
        runSearch: 'Suche starten',
        welcomeSubtitleNoUser: 'Hallo, was möchtest du heute finden?',
        welcomeSubtitleUser: 'Hallo [0], was möchtest du heute finden?',
        welcomeTitle: 'sysHUBFindr',
    },
    login: {
        title: 'Anmeldung',
        unlockDescription: 'Bitte gib deine sysHUB Zugangsdaten für Zugriff auf den Server an.',
        usernameField: {
            label: 'sysHUB Benutzername',
            placeholder: 'username',
            invalidFeedback: 'Bitte einen Benutzernamen angeben.'
        },
        passwordField: {
            label: 'Passwort',
            placeholder: 'password',
            invalidFeedback: 'Bitte ein Passwort eingeben.'
        },
        submitBtn: 'Anmelden',
        submitBtnBusy: 'Anmeldung läuft...',
        inputInvalidToast: 'Die Zugangsdaten sind unvollständig. Bitte prüfe deine Eingaben.',
        inputCredentialsToast: 'Anmeldung vom Server abgewiesen. Bitte prüfe deine Eingaben und versuche es nochmal.',
        inputServerNotAvailableToast: 'Anmeldung fehlgeschlagen. Der Server ist gerade nicht erreichbar.'
    },
    logout: {
        logoutOngoingMsg: 'Du wirst abgemeldet...',
    },
    navbar: {
        aboutLink: 'Über',
        searchPlaceholder: '🔍 Suchbegriff, z.B. currentjob',
        clearCacheLink: 'Cache leeren',
        helpLink: 'Hilfe',
        homeLink: 'Start',
        logoutLink: 'Abmelden',
        resultLink: 'Suchergebnis',
        searchBtn: 'Suchen',
        searchBtnBusy: 'Suche läuft...',
        searchOptions: 'Optionen',
        statsLink: 'Statistiken',
        promoLink: 'Findr auf Github',
        webclientLink: 'sysHUB web client'
    },
    result: {
        config: {
            title: 'Treffer in der Konfiguration, Suche nach »[0]«',
            subtitle: `
                Auf dieser Seite wird die komplette Baumstruktur der Expertenkonfiguration
                dargestellt und Treffer sind optisch hervorgehoben.
                Beim Zeigen mit dem Cursor auf einen Eintrag wird dieser im rechten Bereich
                dargestellt. Ist die Pinnadel aktiv, findet beim Zeigen kein Wechsel mehr
                statt, aber beim Klicken.
            `,
            properties: {
                description: 'Beschreibung',
                name: 'Name',
                path: 'Pfad',
                type: 'Elementtyp',
                uuid: 'Uuid',
                value: 'Wert',
            },
            selected: 'Details zu »[0]«'
        },
        header: {
            title: 'Trefferliste für die Suche nach »[0]«',
            subtitle: `
                Die übersicht zeigt eine kurze Zusammenfassung der Treffer. Mehr Details
                findest du nach dem Klicken auf die Buttons der jeweiligen Kategorien. 
                Grauer Button = kein Treffer in diesem Bereich.
            `
        },
        jobtype: {
            title: 'Treffer bei den Auftragstypen, Suche nach »[0]«',
            subtitle: `
                Diese Seite listet die konfigurierten Auftragstypen auf und
                hebt Treffer sind optisch hervorgehoben.
                Beim Zeigen mit dem Cursor auf einen Eintrag wird dieser im rechten Bereich
                dargestellt. Ist die Pinnadel aktiv, findet beim Zeigen kein Wechsel mehr
                statt, aber beim Klicken.
            `,
            attributes: {
                category: 'Kategorie',
                classifiedworkflowuuid: 'Workflow (nach Klassifizierung)',
                datatype: 'Datentyp',
                deldays: 'Löschen nach Tagen',
                description: 'Beschreibung',
                initialtextstatus: 'Initialer Textstatus',
                inputchannel: 'Eingabekanal',
                name: 'Name',
                priority: 'Priorität',
                senderhost: 'Sendender Host',
                sourcefile: 'Quelldatei',
                starttype: 'Starttyp',
                textstatus: 'Textstatus',
                ticketfile: 'Ticketdatei',
                title: 'Titel',
                userkey: 'Userkey',
                username: 'Benutzername',
                workflowuuid: 'Workflow (Verarbeitung)',
                xid: 'Xid'
            },
            customAttributes: 'Attribute',
            selected: 'Details zu »[0]«',
            classifySection: 'Klassifizierung',
            moreAttributesSection: 'Klassifizierung Jobattribute',
            processingSection: 'Verarbeitung',
            workflowsSection: 'Workflows'
        },
        overview: {
            title: 'Zusammenfassung',
            subtitle1: 'Die Suche hat insgesamt <strong>[0]</strong> Treffer ergeben.',
            subtitle2: `
                Nachfolgend findest du eine Auflistung aller Treffer. Wenn du diese in einer Baumstruktur (z.B. für Konfig und
                Parameterset) sehen möchtest, verwende die obenstehenden Buttons um an die entsprechende Stelle zu navigieren.`,
            propertyType: 'Typ: [0]'
        },
        parameterset: {
            title: 'Treffer im Parameterset, Suche nach »[0]«',
            subtitle: `
                Auf dieser Seite wird die komplette Baumstruktur des Parametersets
                dargestellt und Treffer sind optisch hervorgehoben.
                Beim Zeigen mit dem Cursor auf einen Eintrag wird dieser im rechten Bereich
                dargestellt. Ist die Pinnadel aktiv, findet beim Zeigen kein Wechsel mehr
                statt, aber beim Klicken.
            `,
            properties: {
                description: 'Beschreibung',
                name: 'Name',
                path: 'Pfad',
                type: 'Elementtyp',
                uuid: 'Uuid',
                value: 'Wert',
            },
            selected: 'Details zu »[0]«'
        },
        toolbar: {
            certStore: 'Zertifikatsspeicher: [0]',
            config: 'Konfig: [0]',
            exportResults: 'Trefferliste exportieren',
            ippDevices: 'Drucker: [0]',
            jobtypes: 'Jobtypes: [0]',
            matches: 'Treffer',
            noMatches: 'keine Treffer',
            overview: 'Übersicht',
            parameterset: 'Parameterset: [0]',
            serverConfig: 'Server properties: [0]',
            serverInfo: 'Server infos: [0]',
            users: 'Benutzer: [0]',
            workflows: 'Workflows: [0]',
        },
        showWorkflow: 'Workflow anzeigen'
    },
    search: {
        errors: {
            phraseEmpty: 'Bitte einen Suchbegriff mit mindestens [0] Zeichen eingeben.'
        },
        filter: {
            categoryFilter: 'Filtern nach Kategorie',
            categoryFilterNone: 'Nicht angewendet',
            excludeBComments: '[B]-Kommentare ignorieren',
            includeUuids: 'UUID\'s durchsuchen',
            searchWorkflowContent: 'Inklusive Workflowinhalte',
        },
        options: {
            enableCache: 'Browser-Cache verwenden',
            enableCacheDescription: `
                Ist diese Option gesetzt, so werden diverse Elemente im Browser
                zwischengespeichert. Werden diese Elemente später erneut gefunden,
                müssen sie nicht nochmal vom Server geladen werden.
            `
        },
        topics: {
            categories: 'Kategorien',
            certstore: 'Zertifikatsspeicher',
            config: 'Konfiguration',
            ippDevices: 'Drucker',
            jobtypes: 'Auftragstypen',
            keystore: 'Keystore',
            parameterset: 'Parameterset',
            serverConfig: 'Server properties',
            serverInfo: 'Server Infos',
            truststore: 'Truststore',
            users: 'Benutzer',
            workflows: 'Workflows',
        }
    },
    searching: {
        title: '',
        cardTitle: 'Suchen nach [0]',
        progress: {
            done: 'Alles erledigt. Weiterleitung zur Ergebnisansicht...',
            evaluatingResults: 'Die Ergebnisse wurden vom Server geladen und werden für die Anzeige vorbereitet...',
            queryingObjects: 'Die Treffer-Objekte werden nun vom Server geladen und ggf. im Browser-Cache gespeichert...',
            preparingResultView: 'Die Ergebnis-Ansicht wird vorbereitet...',
            waitingForResults: 'Die Suchanfrage wurde an den Server gesendet. Warten auf das Ergebnis...',
        }
    }
};
