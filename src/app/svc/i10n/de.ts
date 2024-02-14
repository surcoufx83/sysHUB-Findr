import { L10nLocale } from './l10n-locale';

export const L10nDe: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Ungültige Anfrage.',
            forbidden: 'Keine Berechtigung.',
            notFound: 'Resource nicht verfügbar.',
            serverUnavailable: 'Es kann keine Verbindung zum Server hergestellt werden. Prüfen Sie, ob der Server läuft und verfügbar ist.',
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
        },
        configurationFileMissing: 'Die Findr-Konfiguration konnte nicht geladen werden. <a class="text-light" target="_blank" href="https://github.com/surcoufx83/sysHUB-Findr?tab=readme-ov-file#konfiguration-work-in-progress-see-3">Bitte gemäß der Anleitung konfigurieren.</a>',
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
            no: ['nein', 'Nein'],
            none: '»Keine«',
            okUc: 'OK',
            toggleItem: '[0] auf- bzw. zuklappen',
            toggleSection: ['Klicken um den Abschnitt [0] einzublenden', 'Klicken um den Abschnitt [0] auszublenden'],
            yes: ['ja', 'Ja'],
        }
    },
    home: {
        moreFilter: 'Erweiterte Filter',
        moreFilterToggle: 'Suche mit erweiterten Filtern',
        runSearch: 'Suche starten',
        welcomeSubtitleNoUser: 'Hallo, was möchtest du heute finden?',
        welcomeSubtitleUser: 'Hallo [0], was möchtest du heute finden?',
        welcomeTitle: 'sysHUBFindr',
        disabledFindr: {
            title: 'Findr deaktiviert!',
            description: 'Der Findr benötigt zur Suche und zur Ergebnisdarstellung eine bestimmte Konfiguration.',
            documentationLink: 'Siehe Readme auf Github, Abschnitt Konfigurationsparameter, Parameter syshub.oauth.scope'
        }
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
        clearCacheLink: 'Cache leeren',
        helpLink: 'Hilfe',
        homeLink: 'Start',
        logoutLink: 'Abmelden',
        promoLink: 'Findr auf Github',
        resultLink: 'Suchergebnis',
        searchBtn: 'Suchen',
        searchBtnBusy: 'Suche läuft...',
        searchOptions: 'Optionen',
        searchPlaceholder: '🔍 Suchbegriff, z.B. currentjob',
        statsLink: 'Statistiken',
        themeSwitch: ['hell', 'dunkel', 'automatisch'],
        webclientLink: 'sysHUB web client'
    },
    result: {
        certStoreItem: {
            title: 'Zertifikatsspeicher',
            subtitle: `
                Der Zertifikatsspeicher unterteilt sich in Keystore und Truststore.
                Der Keystore speichert private Schlüssel, die für Verschlüsselung, Authentifizierung und Integritätsprüfung verwendet werden.
                Der Truststore enthält vertrauenswürdige öffentliche Schlüssel, die zur Überprüfung der Authentizität entfernter Systeme oder Peers verwendet werden.
                Wird der Suchbegriff in einem Zertifikat gefunden, ist der entsprechende Eintrag hervorgehoben.
            `,
            nodeInspector: {
                alias: 'Alias',
                certX509IssuerDN: 'Ausgestellt von',
                certX509NotAfter: 'Gültig bis',
                certX509NotBefore: 'Gültig ab',
                certX509PrivateKey: 'Privater Schlüssel',
                certX509PublicKey: 'Öffentlicher Schlüssel',
                certX509SerialNumber: 'Seriennummer',
                certX509SignatureAlogorithm: 'Algorithmus',
                certX509SubjectDN: 'Ausgestellt für',
                fingerprintSHA1: 'SHA-1 Hash',
                subject: 'Zertifikat',
                subjectAlternativeName: 'Alternative Namen',
                version: 'Version',
            },
        },
        common: {
            clickToOpenDialog: 'Klicken um Details zu Eintrag "[0]" anzuzeigen',
            nodeInspector: {
                copyTooltip: 'In Zwischenablage',
                copied: 'Der Text "[0]" wurde in die Zwischenablage kopiert.'
            }
        },
        config: {
            title: 'Expertenkonfiguration',
            subtitle: `
                Auf dieser Seite wird die komplette Baumstruktur der Expertenkonfiguration
                dargestellt und Treffer sind optisch hervorgehoben und automatisch aufgeklappt.
                Beim Klicken auf einen Eintrag werden die Details im rechten Bereich dargestellt.
            `,
            nodeInspector: {
                description: 'Beschreibung',
                modified: 'Geändert',
                parentUuid: 'Parent',
                path: 'Pfad',
                subject: 'Expertenkonfiguration',
                type: 'Typ',
                uuid: 'Uuid',
                value: 'Wert',
            },
        },
        header: {
            title: 'Trefferliste für die Suche nach »[0]«',
            subtitle: `
                Die übersicht zeigt eine kurze Zusammenfassung der Treffer. Mehr Details
                findest du nach dem Klicken auf die Buttons der jeweiligen Kategorien. 
                Grauer Button = kein Treffer in diesem Bereich.
            `
        },
        ippDevice: {
            title: 'IPP Drucker',
            subtitle: `
                Die folgende Auflistung enthält die in sysHUB registrierten Drucker (IPP Devices).
                Suchtreffer sind farblich hervorgehoben, und beim Klicken auf einen Eintrag werden die Details im rechten Bereich dargestellt.
            `,
            nodeInspector: {
                desc: 'Beschreibung',
                form: 'Formular',
                location: 'Standort',
                maxInputQueueSize: 'Limit Input Queue',
                name: 'Name',
                outputThreshold: 'Ausgabe Schwellwert',
                queueSettingsGroup: 'Auftragswarteschlange',
                si: 'Spool-in',
                so: 'Spool-out',
                state: 'Aktiv',
                subject: 'IPP Device',
                uri: 'Adresse',
            }
        },
        jobtype: {
            title: 'Auftragstypen',
            subtitle: `
                Diese Seite listet die konfigurierten Auftragstypen auf und
                hebt Treffer sind optisch hervorgehoben.
                Beim Klicken auf einen Eintrag werden die Details im rechten Bereich dargestellt.
            `,
            toggleHideEmptySettings: ['Leere und %-Werte sind ausgeblendet. Klicken um einzublenden', 'Klicken um leere oder %-Werte auszublenden'],
            nodeInspector: {
                category: 'Kategorie',
                classificationGroup: 'Klassifizierung',
                classifiedworkflowuuid: 'Workflow (nach Klassifizierung)',
                datatype: 'Datentyp',
                deldays: 'Löschen nach Tagen',
                description: 'Beschreibung',
                initialtextstatus: 'Initialer Textstatus',
                inputchannel: 'Eingabekanal',
                jobAttributesGroup: 'Jobattribute zur Klassifizierung',
                name: 'Name',
                priority: 'Priorität',
                processingGroup: 'Verarbeitung',
                senderhost: 'Sendender Host',
                sourcefile: 'Quelldatei',
                starttype: 'Starttyp',
                starttypes: ['Automatisch', 'Gehalten', 'Zeitlich gehalten'],
                subject: 'Jobtypes',
                textstatus: 'Textstatus',
                ticketfile: 'Ticketdatei',
                title: 'Titel',
                userkey: 'Userkey',
                username: 'Benutzername',
                uuid: 'Uuid',
                workflowsGroup: 'Workflows',
                workflowuuid: 'Workflow (Verarbeitung)',
                xid: 'Xid',
            },
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
            title: 'Parameterset',
            subtitle: `
                Auf dieser Seite wird die komplette Baumstruktur des Parametersets
                dargestellt und Treffer sind optisch hervorgehoben und automatisch aufgeklappt.
                Beim Klicken auf einen Eintrag werden die Details im rechten Bereich dargestellt.
            `,
            nodeInspector: {
                description: 'Beschreibung',
                modified: 'Geändert',
                parentUuid: 'Parent',
                path: 'Pfad',
                subject: 'Parameterset',
                type: 'Typ',
                uuid: 'Uuid',
                value: 'Wert',
            },
        },
        serverInfo: {
            title: 'Serverinformationen',
            subtitle: `
                Die folgende Auflistung enthält Informationen, welche der Server 
                zurückgeliefert hat.Treffer sind farblich hervorgehoben.
            `,
        },
        serverProperties: {
            title: 'Serverkonfiguration (server.properties)',
            subtitle: `
                Die folgende Auflistung enthält alle Konfigurationseinträge, welche der Server 
                zurückgeliefert hat und entspricht der server.properties-Datei.
                Treffer sind farblich hervorgehoben.
            `,
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
        showWorkflow: 'Workflow anzeigen',
        useraccount: {
            title: 'Benutzerkonten',
            subtitle: `
                Die Tabelle enthält die Benuzterkonten die im sysHUB registriert sind.
                Treffer sind farblich hervorgehoben.
            `,
            toggleHideUnassignedRoles: ['Nicht zugewiesene Rollen sind ausgeblendet. Klicken um einzublenden', 'Klicken um nicht zugewiesene Rollen auszublenden'],
            nodeInspector: {
                email: 'E-Mail',
                enabled: 'Freigeschaltet',
                forcechange: 'Muss Passwort ändern',
                modified: 'Geändert',
                name: 'Name',
                roles: 'Rollen',
                subject: 'Benutzerkonto',
                type: 'Art',
                types: {
                    'INTERNAL': 'sysHUB Benutzer',
                    'LDAP': 'Domain-Benutzer',
                    'WINDOWS': 'Windows-Benutzer',
                },
                uuid: 'Uuid',
            },
        },
        workflow: {
            title: 'Workflows',
            subtitle: `
                In der Auflistung sind die Workflows farblich hervorgehoben, bei denen ein Treffer in den Metadaten oder dem Workflow ansich enthalten ist.
                Anklicken eines Eintrags um die Details zu sehen oder auf das Flowchart-Icon um den Workflow anzuzeigen.
            `,
            nodeInspector: {
                cacheable: 'Cache aktiv',
                categoryName: 'Kategorie',
                description: 'Beschreibung',
                format: 'Format',
                formats: ['Native Client', 'Webclient'],
                lockedByUser: 'Gesperrt',
                modified: 'Geändert',
                name: 'Name',
                subject: 'Workflow',
                uuid: 'Uuid',
                version: 'Version',
            },
        },
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
        cardTitle: 'Suchen nach »[0]«',
        progress: {
            done: 'Alles erledigt. Weiterleitung zur Ergebnisansicht...',
            evaluatingResults: 'Die Ergebnisse wurden vom Server geladen und werden für die Anzeige vorbereitet...',
            queryingObjects: 'Die Treffer-Objekte werden nun vom Server geladen und ggf. im Browser-Cache gespeichert...',
            preparingResultView: 'Die Ergebnis-Ansicht wird vorbereitet...',
            waitingForResults: 'Die Suchanfrage wurde an den Server gesendet. Warten auf das Ergebnis...',
        }
    },
    workflowUi: {
        title: 'Workflow »[0]«',
        subtitle: '',
        failed: {
            noCache: 'Unter der angegebenen Workflow-Id konnte kein Workflow gefunden werden.',
            noUuid: 'Die aufgerufene Url ist fehlerhaft.',
        },
        failedBackToFindr: 'Zurück zur Startseite',
        failedCommon: 'Fehler beim Anzeigen des Workflows: ',
        errorConnector: 'On Error',
        celement: {
            instanceName: 'Instanz',
            subject: 'CElement',
            variable: 'Variable',
        },
        decision: {
            subject: 'Entscheidung',
        },
        process: {
            subject: ['Prozess', 'Loop-Prozess'],
        },
        shared: {
            agent: 'Agent',
            loop: 'Looparray',
            parametersetRef: 'Parameterset',
        },
        workflow: {
            startpoint: 'Startpunkt',
            subject: ['Workflow', 'Loop-Workflow'],
            threads: 'Threads',
        },
        versionsDropdown: {
            title: ['[0] Versionen (aktuell: [1])', '[0] Versionen (bearbeitet: [1])'],
            versionstr: '[0].[1]',
            isactive: 'aktiv',
            lastactive: 'in Bearbeitung'
        },
        referencesDropdown: {
            title: ['Keine Referenzen', '[0] Referenz', '[0] Referenzen'],
            occurencesInWorkflow: '[0]x in [1]',
        },
    }
};
