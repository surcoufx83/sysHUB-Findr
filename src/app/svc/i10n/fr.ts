import { L10nLocale } from './l10n-locale';

export const L10nFr: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Requête invalide.',
            forbidden: 'Accès non autorisé.',
            notFound: 'Ressource introuvable.',
            unauthorized: 'Échec de la connexion.',
            unknown: 'Erreur inconnue.'
        },
        errorCommon: 'Erreur lors de la récupération des données depuis le serveur : [0]'
    },
    app: {
        title: 'Findr',
        titles: {
            home: 'sysHUB Findr',
            searchOngoing: 'Recherche en cours...',
            resultView: 'Vue des résultats',
            resultConfigView: 'Résultat (Configuration)'
        }
    },
    common: {
        clipboard: {
            confirm: 'Valeur copiée dans le presse-papiers'
        },
        locales: {
            de: 'Allemand',
            en: 'Anglais',
            fr: 'Français',
        },
        phrases: {
            none: 'Aucun',
            okUc: 'OK',
            toggleItem: 'Basculer [0]'
        }
    },
    home: {
        moreFilter: 'Filtres avancés',
        moreFilterToggle: 'Rechercher avec des filtres avancés',
        runSearch: 'Démarrer la recherche',
        welcomeSubtitleNoUser: 'Bonjour, que souhaitez-vous trouver aujourd\'hui ?',
        welcomeSubtitleUser: 'Bonjour [0], que souhaitez-vous trouver aujourd\'hui ?',
        welcomeTitle: 'sysHUBFindr',
    },
    login: {
        title: 'Connexion',
        unlockDescription: 'Veuillez saisir vos identifiants sysHUB pour accéder au serveur.',
        usernameField: {
            label: 'Nom d\'utilisateur sysHUB',
            placeholder: 'nom d\'utilisateur',
            invalidFeedback: 'Veuillez fournir un nom d\'utilisateur.'
        },
        passwordField: {
            label: 'Mot de passe',
            placeholder: 'mot de passe',
            invalidFeedback: 'Veuillez entrer un mot de passe.'
        },
        submitBtn: 'Se connecter',
        submitBtnBusy: 'Connexion en cours...',
        inputInvalidToast: 'Les identifiants sont incomplets. Veuillez vérifier vos saisies.',
        inputCredentialsToast: 'Connexion refusée par le serveur. Veuillez vérifier vos identifiants et réessayer.',
        inputServerNotAvailableToast: 'Échec de la connexion. Le serveur n\'est actuellement pas disponible.'
    },
    logout: {
        logoutOngoingMsg: 'Déconnexion en cours...',
    },
    navbar: {
        aboutLink: 'À propos',
        searchPlaceholder: '🔍 Terme de recherche, par exemple, currentjob',
        clearCacheLink: 'Effacer le cache',
        helpLink: 'Aide',
        homeLink: 'Accueil',
        logoutLink: 'Déconnexion',
        resultLink: 'Résultats de recherche',
        searchBtn: 'Rechercher',
        searchBtnBusy: 'Recherche en cours...',
        searchOptions: 'Options',
        statsLink: 'Statistiques',
        promoLink: 'Findr sur Github',
        webclientLink: 'Client web sysHUB'
    },
    result: {
        common: {
            clickToOpenDialog: 'Cliquez pour ouvrir les détails de l\'entrée "[0]"',
            nodeInspector: {
                copyTooltip: 'Copier dans le presse-papiers',
                copied: 'Le texte "[0]" a été copié dans le presse-papiers.'
            }
        },
        config: {
            title: 'Correspondances dans la Configuration d\'Expert',
            subtitle: `
                Cette page affiche la structure complète de l'arborescence de la configuration d'expert,
                avec les correspondances mises en évidence et automatiquement dépliées.
                En cliquant sur une entrée, les détails s'affichent dans la section de droite.
            `,
            nodeInspector: {
                description: 'Description',
                modified: 'Modifié',
                parentUuid: 'Parent',
                path: 'Chemin',
                subject: 'Configuration d\'Expert',
                type: 'Type',
                uuid: 'UUID',
                value: 'Valeur',
            }
        },
        header: {
            title: 'Résultats de la recherche pour "[0]"',
            subtitle: `
                La vue d'ensemble offre un résumé succinct des résultats. Pour plus de détails,
                cliquez sur les boutons des sections respectives ci-dessous. 
                Bouton gris = aucune correspondance dans cette section.
            `,
        },
        jobtype: {
            title: 'Correspondances dans les Types de Travail, Recherche de "[0]"',
            subtitle: `
                Cette page répertorie les types de travail configurés, et les correspondances sont mises en évidence visuellement.
                En survolant une entrée avec le curseur, elle est affichée sur le côté droit.
                Si la punaise est active, il n'y aura pas de changement au survol, mais il y en aura lors de la cliquaison.
            `,
            attributes: {
                category: 'Catégorie',
                classifiedworkflowuuid: 'Workflow (par Classification)',
                datatype: 'Type de Données',
                deldays: 'Supprimer Après Jours',
                description: 'Description',
                initialtextstatus: 'Statut Texte Initial',
                inputchannel: 'Canal d\'Entrée',
                name: 'Nom',
                priority: 'Priorité',
                senderhost: 'Hôte Expéditeur',
                sourcefile: 'Fichier Source',
                starttype: 'Type de Démarrage',
                textstatus: 'Statut Texte',
                ticketfile: 'Fichier Ticket',
                title: 'Titre',
                userkey: 'Clé Utilisateur',
                username: 'Nom d\'Utilisateur',
                workflowuuid: 'Workflow (Traitement)',
                xid: 'Xid'
            },
            customAttributes: 'Attributs Personnalisés',
            selected: 'Détails pour "[0]"',
            classifySection: 'Classification',
            moreAttributesSection: 'Attributs de Travail de Classification',
            processingSection: 'Traitement',
            workflowsSection: 'Workflows'
        },
        overview: {
            title: 'Résumé',
            subtitle1: 'La recherche a donné un total de <strong>[0]</strong> résultats.',
            subtitle2: `
                Ci-dessous se trouve une liste de tous les résultats. Si vous souhaitez les afficher sous forme
                arborescente (par exemple, pour Config et Parameterset), utilisez les boutons ci-dessus pour accéder à la section correspondante.`,
            propertyType: 'Type : [0]'
        },
        parameterset: {
            title: 'Correspondances dans le Paramétrage',
            subtitle: `
                Cette page affiche la structure complète de l'arborescence du paramétrage,
                avec les correspondances mises en évidence et automatiquement dépliées.
                En cliquant sur une entrée, les détails s'affichent dans la section de droite.
            `,
            nodeInspector: {
                description: 'Description',
                modified: 'Modifié',
                parentUuid: 'Parent',
                path: 'Chemin',
                subject: 'Paramétrage',
                type: 'Type',
                uuid: 'UUID',
                value: 'Valeur',
            }
        },
        serverProperties: {
            title: 'Correspondances dans la Configuration Serveur (server.properties)',
            subtitle: `
                La liste suivante contient toutes les entrées de configuration renvoyées par le serveur,
                correspondant au fichier server.properties. Les correspondances sont mises en évidence en couleur.
            `,
            nodeInspector: {
                description: 'Description',
                subject: 'Configuration Serveur',
                value: 'Valeur',
                refs: 'Références',
                type: 'Type',
            },
            knownPropertiesDescription: {
                'base.syslog.customstoredprocedure': 'La propriété `base.syslog.customstoredprocedure` configure une procédure stockée personnalisée pour la gestion des journaux syslog.',
                'base.syslog.daysholddebug': 'Détermine le nombre de jours pendant lesquels les entrées de syslog de débogage sont conservées.',
                'base.syslog.daysholderror': 'Détermine le nombre de jours pendant lesquels les entrées de syslog d\'erreur sont conservées.',
                'base.syslog.daysholdfatal': 'Détermine le nombre de jours pendant lesquels les entrées de syslog fatales sont conservées.',
                'base.syslog.daysholdinfo': 'Détermine le nombre de jours pendant lesquels les entrées de syslog d\'information sont conservées.',
                'base.syslog.daysholdwarn': 'Détermine le nombre de jours pendant lesquels les entrées de syslog d\'avertissement sont conservées.',
                'base.syslog.deletepackage': 'La propriété `base.syslog.deletepackage` est liée à la gestion de syslog, mais sa fonction spécifique n\'est pas décrite.',
                'base.syslog.maxrowstodelete': 'Définit le nombre maximal de lignes pouvant être supprimées en une seule fois.',
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
        showWorkflow: 'Afficher le Workflow',
        toolbar: {
            certStore: 'stock. certificats : [0]',
            config: 'config : [0]',
            exportResults: 'export résultats recherche',
            ippDevices: 'impr. : [0]',
            jobtypes: 'types travail : [0]',
            matches: 'correspondances',
            noMatches: 'aucune correspondance',
            overview: 'vue d\'ensemble',
            parameterset: 'param. set : [0]',
            serverConfig: 'props serveur : [0]',
            serverInfo: 'info serveur : [0]',
            users: 'utilisateurs : [0]',
            workflows: 'workflows : [0]',
        },
    },
    search: {
        errors: {
            phraseEmpty: 'Veuillez entrer un terme de recherche d\'au moins [0] caractères.'
        },
        filter: {
            categoryFilter: 'Filtrer par Catégorie',
            categoryFilterNone: 'Non Appliqué',
            excludeBComments: 'Ignorer les Commentaires [B]',
            includeUuids: 'Rechercher les UUIDs',
            searchWorkflowContent: 'Inclure le Contenu du Workflow',
        },
        options: {
            enableCache: 'Utiliser le Cache du Navigateur',
            enableCacheDescription: `
                    Lorsque cette option est activée, divers éléments sont mis en cache dans le navigateur.
                    Si ces éléments sont retrouvés ultérieurement, ils n'ont pas besoin d'être chargés à nouveau depuis le serveur.
                `
        },
        topics: {
            categories: 'Catégories',
            certstore: 'Magasin de Certificats',
            config: 'Configuration',
            ippDevices: 'Imprimantes',
            jobtypes: 'Types de Travail',
            keystore: 'Keystore',
            parameterset: 'Parameterset',
            serverConfig: 'Propriétés du Serveur',
            serverInfo: 'Informations sur le Serveur',
            truststore: 'Truststore',
            users: 'Utilisateurs',
            workflows: 'Workflows',
        }
    },
    searching: {
        title: '',
        cardTitle: 'Recherche de "[0]"',
        progress: {
            done: 'Terminé. Redirection vers la vue des résultats...',
            evaluatingResults: 'Les résultats ont été chargés depuis le serveur et sont en cours de préparation pour l\'affichage...',
            queryingObjects: 'Les objets correspondants sont maintenant chargés depuis le serveur et peuvent être mis en cache dans le navigateur...',
            preparingResultView: 'Préparation de la vue des résultats...',
            waitingForResults: 'La demande de recherche a été envoyée au serveur. En attente des résultats...',
        }
    }
};
