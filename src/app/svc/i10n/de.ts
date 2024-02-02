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
        common: {
            clickToOpenDialog: 'Klicken um Details zu Eintrag "[0]" anzuzeigen',
            nodeInspector: {
                copyTooltip: 'In Zwischenablage',
                copied: 'Der Text "[0]" wurde in die Zwischenablage kopiert.'
            }
        },
        config: {
            title: 'Treffer in der Expertenkonfiguration',
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
            title: 'Treffer im Parameterset',
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
        serverProperties: {
            title: 'Treffer in der Serverkonfiguration (server.properties)',
            subtitle: `
                Die folgende Auflistung enthält alle Konfigurationseinträge, welche der Server 
                zurückgeliefert hat und entspricht der server.properties-Datei.
                Treffer sind farblich hervorgehoben.
            `,
            nodeInspector: {
                description: 'Beschreibung',
                subject: 'Serverkonfiguration',
                value: 'Wert',
                refs: 'Referenzen',
                type: 'Typ'
            },
            knownPropertiesDescription: {
                'base.class.publisher.port': 'Die Eigenschaft `base.class.publisher.port` konfiguriert den Port, der von einem Class-Loader-Listener verwendet wird. Stellen Sie sicher, dass er angepasst wird, wenn der Windows MSMQ-Dienst auf demselben Server installiert wird, um Konflikte bei der Portzuweisung zu verhindern.',
                'base.class.publisher.useSSL': 'Die Eigenschaft base.class.publisher.useSSL steuert, ob der Klassenlader-Publisher SSL (Secure Sockets Layer) für sichere Kommunikation verwendet. Wenn sie auf "true" gesetzt ist, ermöglicht sie die SSL-Verschlüsselung für Klassenladungsaktivitäten und erhöht die Sicherheit.',
                'base.syslog.customstoredprocedure': '',
                'base.syslog.daysholddebug': 'Bestimmt die Anzahl der Tage, an denen Debug-Syslog-Einträge aufbewahrt werden.',
                'base.syslog.daysholderror': 'Bestimmt die Anzahl der Tage, an denen Fehler-Syslog-Einträge aufbewahrt werden.',
                'base.syslog.daysholdfatal': 'Bestimmt die Anzahl der Tage, an denen fatalen Syslog-Einträge aufbewahrt werden.',
                'base.syslog.daysholdinfo': 'Bestimmt die Anzahl der Tage, an denen Informations-Syslog-Einträge aufbewahrt werden.',
                'base.syslog.daysholdwarn': 'Bestimmt die Anzahl der Tage, an denen Warnungs-Syslog-Einträge aufbewahrt werden.',
                'base.syslog.deletepackage': '',
                'base.syslog.maxrowstodelete': 'Definiert die maximale Anzahl von Zeilen, die gleichzeitig gelöscht werden können.',
                'base.syslog.trigger': '',
                'base.system.fullQualifiedHostname': '',
                'base.system.name': '',
                'base.trustedServers.UNC': '',
                'base.userlog.customstoredprocedure': '',
                'base.userlog.daysholddebug': '',
                'base.userlog.daysholderror': '',
                'base.userlog.daysholdfatal': '',
                'base.userlog.daysholdinfo': '',
                'base.userlog.daysholdwarn': '',
                'base.userlog.deletepackage': '',
                'base.userlog.maxrowstodelete': '',
                'base.userlog.trigger': '',
                'enabledProtocols': '',
                'gitBranchName': '',
                'gitRepositoryPassword': '',
                'gitRepositoryUser': '',
                'hazelcast.slow.operation.detector.enabled': '',
                'hazelcast.slow.operation.detector.log.purge.interval.seconds': '',
                'hazelcast.slow.operation.detector.log.retention.seconds': '',
                'hazelcast.slow.operation.detector.stacktrace.logging.enabled': '',
                'httpProcsNoHostCheck': '',
                'hz.instance.name': '',
                'hz.members': '',
                'hz.network.port': '',
                'hz.network.port.auto.increment': '',
                'hz.node.name': '',
                'hz.tcp.ip.enabled': '',
                'hz.use.jmx': '',
                'javax.net.ssl.keyPassword': '',
                'javax.net.ssl.keyStore': '',
                'javax.net.ssl.keyStorePassword': '',
                'javax.net.ssl.keyStoreType': '',
                'javax.net.ssl.trustStore': '',
                'javax.net.ssl.trustStorePassword': '',
                'javax.net.ssl.trustStoreType': '',
                'jetty.cert.alias': '',
                'jetty.http.port': '',
                'jetty.http.timeout': '',
                'jetty.https.port': '',
                'jetty.https.timeout': '',
                'jetty.jmx': '',
                'jetty.requestlog': '',
                'jetty.sniHostCheck': '',
                'jetty.stsIncludeSubDomains': '',
                'jetty.stsMaxAge': '',
                'jetty.threadPool.idleTimeout': '',
                'jetty.threadPool.maxThreads': '',
                'jetty.threadPool.minThreads': '',
                'jms.broker.memory': '',
                'jms.broker.password': '',
                'jms.broker.persistent': '',
                'jms.broker.port': '',
                'jms.broker.schema': '',
                'jms.broker.stomp.port': '',
                'jms.broker.storage': '',
                'jms.broker.temp': '',
                'jms.broker.use.jmx': '',
                'jms.con.block.session.full': '',
                'jms.con.max': '',
                'jms.con.timeout': '',
                'jms.receive.timeout': '',
                'jms.session.per.con.max': '',
                'ldap.logonRole': '',
                'ldap.objectClass': '',
                'ldap.providerURLList': '',
                'ldap.searchName': '',
                'ldap.tu.logonRole': '',
                'ldap.tu.populateNestedGroupsAD': '',
                'ldap.tu.providerURLList': '',
                'ldap.tu.searchFilter': '',
                'ldap.tu.searchName': '',
                'ldap.tu.serviceUserDN': '',
                'ldap.tu.serviceUserPassword': '',
                'ldap.userDomain': '',
                'ldap.userPrincipalName': '',
                'mirror.listener.name': '',
                'mirror.listener.port': '',
                'mirror.listener.use.ssl': '',
                'nativeclient.filestatus.sortorder': '',
                'restapi.swagger.overwrite.url': '',
                'restapi.swagger.showInternalRestAPI': '',
                'restapi.swagger.showRestAPI': '',
                'restapi.workflowExecution.paraToAttributes': '',
                'restapi.workflowExecution.resolveMediaType': '',
                'restapi.workflowExecution.useOnlyFileStatusEntries': '',
                'vertx.disableFileCaching': '',
                'vertx.disableFileCPResolving': '',
            }
        },
        showWorkflow: 'Workflow anzeigen',
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
