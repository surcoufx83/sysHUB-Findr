import { L10nLocale } from "./l10n-locale";

export const L10nDe: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Ungültige Anfrage.',
            forbidden: 'Keine Berechtigung.',
            notFound: 'Resource nicht verfügbar.',
            unauthorized: 'Anmeldung fehlgeschlagen.',
            unknown: 'Unbekannter Fehler.'
        },
        errorCommon: 'Fehler beim Abrufen der Daten vom Server: {0}'
    },
    app: {
        promotion: 'Den sysHUB Findr Sourcecode findest Du auf Gitlab!',
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
        phrases: {
            none: '»Keine«',
            okUc: 'OK',
            toggleItem: '{0} auf- bzw. zuklappen'
        }
    },
    home: {
        title: 'Suchkonfiguration',
        welcomeTitle: 'sysHUB Findr Start',
        welcomeSubtitleUser: 'Hallo {0}, nach was möchtest du heute suchen?',
        welcomeSubtitleNoUser: 'Hallo, wonach möchtest du heute suchen?',
        enterPhrase: 'Gib deinen Suchbegriff ein',
        runSearch: 'Suche starten',
        tabs: {
            topics: 'Suchbereiche',
            filter: 'Einschränkungen',
            options: 'Optionen',
        }
    },
    login: {
        title: 'Anmeldung',
        unlockDescription: 'Bitte geben Sie Ihre sysHUB Zugangsdaten für Zugriff auf den Server an.'
    },
    navbar: {
        placeholder: 'Suchbegriff...'
    },
    result: {
        config: {
            title: 'Treffer in der Konfiguration, Suche nach »{0}«',
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
            selected: 'Details zu »{0}«'
        },
        jobtype: {
            title: 'Treffer bei den Auftragstypen, Suche nach »{0}«',
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
            selected: 'Details zu »{0}«',
            classifySection: 'Klassifizierung',
            moreAttributesSection: 'Klassifizierung Jobattribute',
            processingSection: 'Verarbeitung',
            workflowsSection: 'Workflows'
        },
        overview: {
            title: 'Trefferliste für die Suche nach »{0}«',
            subtitle: `
                Die folgende Liste stellt nur eine kurze Zusammenfassung dar. Ausführliche
                Ergebnisse und die grafische Repräsentation (Baumstruktur und Workflow-Designer)
                können über die Buttons oben erreicht werden.
            `
        },
        parameterset: {
            title: 'Treffer im Parameterset, Suche nach »{0}«',
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
            selected: 'Details zu »{0}«'
        },
        toolbar: {
            overview: 'Übersicht',
            config: 'Konfig: {0}',
            jobtypes: 'Jobtypes: {0}',
            parameterset: 'Parameterset: {0}',
            workflows: 'Workflows: {0}',
        },
        showWorkflow: 'Workflow anzeigen'
    },
    search: {
        errors: {
            phraseEmpty: 'Bitte einen Suchbegriff mit mindestens {0} Zeichen eingeben.'
        },
        filter: {
            categoryFilter: 'Kategorie filtern',
            categoryFilterNone: 'Nicht gefiltert',
            categoryFilterDescription: `
                Kategorie filtern: Wenn eingestellt, so werden
                ausschließlich Objekte ermittelt, welche dieser Kategorie
                zugeordnet sind. Alle anderen Objekte werden ignoriert.
            `,
            excludeBComments: '[B]-Kommentare ignorieren',
            includeUuids: 'UUID\'s durchsuchen',
            searchWorkflowContent: 'Inklusive Workflowinhalte',
            searchWorkflowContentDescription: `
                Das Durchsuchen der Workflowinhalte dauert deutlich länger und erzeugt
                viel Last auf System und Datenbank.
            `
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
            config: 'Konfiguration',
            jobtypes: 'Auftragstypen',
            parameterset: 'Parameterset',
            workflows: 'Workflows',
        }
    },
    searching: {
        title: '',
        cardTitle: 'Suchen nach {0}',
        progress: {
            done: 'Alles erledigt. Weiterleitung zur Ergebnisansicht...',
            evaluatingResults: 'Die Ergebnisse wurden vom Server geladen und werden für die Anzeige vorbereitet...',
            queryingObjects: 'Die Treffer-Objekte werden nun vom Server geladen und ggf. im Browser-Cache gespeichert...',
            preparingResultView: 'Die Ergebnis-Ansicht wird vorbereitet...',
            waitingForResults: 'Die Suchanfrage wurde an den Server gesendet. Warten auf das Ergebnis...',
        }
    }
};
