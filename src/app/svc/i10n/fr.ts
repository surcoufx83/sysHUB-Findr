import { L10nLocale } from './l10n-locale';

export const L10nFr: L10nLocale = {
    api: {
        failed: {
            badRequest: 'Requête invalide.',
            forbidden: 'Accès non autorisé.',
            notFound: 'Ressource introuvable.',
            serverUnavailable: 'Impossible de se connecter au serveur. Veuillez vérifier si le serveur est en cours d\'exécution et disponible.',
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
            resultView: 'Recherche "[0]"',
        },
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
            no: ['non', 'Non'],
            none: '»Aucun«',
            okUc: 'OK',
            toggleItem: 'Basculer [0]',
            toggleSection: ['Cliquez pour développer la section "[0]"', 'Cliquez pour réduire la section "[0]"'],
            yes: ['oui', 'Oui'],
        },
    },
    home: {
        moreFilter: 'Filtres avancés',
        moreFilterToggle: 'Rechercher avec des filtres avancés',
        runSearch: 'Démarrer la recherche',
        welcomeSubtitleNoUser: 'Bonjour, que souhaitez-vous trouver aujourd\'hui ?',
        welcomeSubtitleUser: 'Bonjour [0], que souhaitez-vous trouver aujourd\'hui ?',
        welcomeTitle: 'sysHUBFindr',
        disabledFindr: {
            description: 'Findr nécessite une configuration spécifique pour la recherche et l\'affichage des résultats.',
            documentationLink: 'Voir Readme sur Github',
            missingConfigFile: 'Le fichier de configuration n\'a pas été trouvé.',
            missingScope: 'Le paramètre syshub.oauth.scope n\'est pas configuré correctement',
            title: 'Findr désactivé !',
        },
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
        aboutLinkWithVersion: 'À propos Findr [0]',
        cacheReload: {
            label: 'Mise à jour du cache',
            tooltip: 'Les enregistrements modifiés seront chargés depuis le serveur : [0]'
        },
        clearCacheLink: 'Vider le cache',
        helpLink: 'Aide',
        homeLink: 'Accueil',
        logoutLink: 'Déconnexion',
        promoLink: 'Findr sur Github',
        resultLink: 'Résultat de la recherche',
        searchBtn: 'Rechercher',
        searchBtnBusy: 'Recherche en cours...',
        searchHistoryTitle: 'Historique de recherche',
        searchOptions: 'Options de recherche',
        searchPlaceholder: '🔍 Terme de recherche, par exemple currentjob',
        statsLink: 'Statistiques',
        themeSwitch: ['clair', 'sombre', 'automatique'],
        webclientLink: 'client web sysHUB'
    },
    result: {
        categories: {
            title: 'Catégories',
        },
        certStoreItem: {
            title: 'Magasin de certificats',
            subtitle: `
                Le magasin de certificats est divisé en Keystore et Truststore.
                Le Keystore stocke des clés privées utilisées pour le chiffrement, l'authentification et la vérification de l'intégrité.
                Le Truststore contient des clés publiques de confiance utilisées pour vérifier l'authenticité des systèmes ou pairs distants.
                Si le terme de recherche est trouvé dans un certificat, l'entrée correspondante est mise en surbrillance.
            `,
            nodeInspector: {
                alias: 'Alias',
                certX509IssuerDN: 'Délivré par',
                certX509NotAfter: 'Valide jusqu\'au',
                certX509NotBefore: 'Valide à partir de',
                certX509PrivateKey: 'Clé privée',
                certX509PublicKey: 'Clé publique',
                certX509SerialNumber: 'Numéro de série',
                certX509SignatureAlogorithm: 'Algorithme',
                certX509SubjectDN: 'Délivré à',
                fingerprintSHA1: 'Hash SHA-1',
                subject: 'Certificat',
                subjectAlternativeName: 'Noms alternatifs',
                version: 'Version',
            },
        },
        common: {
            clickToOpenDialog: 'Cliquez pour ouvrir les détails de l\'entrée "[0]"',
            nodeInspector: {
                copyTooltip: 'Copier dans le presse-papiers',
                copied: 'Le texte "[0]" a été copié dans le presse-papiers.',
            },
        },
        config: {
            title: 'Configuration d\'Expert',
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
            filterUnmatched: {
                showAll: 'Tous',
                showFiltered: 'Apparié uniquement',
            },
        },
        ippDevice: {
            title: 'Imprimantes IPP',
            subtitle: `
                La liste suivante contient les imprimantes enregistrées dans sysHUB (Périphériques IPP).
                Les résultats de la recherche sont mis en évidence, et en cliquant sur une entrée, les détails s'affichent dans le panneau de droite.
            `,
            nodeInspector: {
                desc: 'Description',
                form: 'Formulaire',
                location: 'Emplacement',
                maxInputQueueSize: 'Limite de la file d\'attente d\'entrée',
                name: 'Nom',
                outputThreshold: 'Seuil de sortie',
                queueSettingsGroup: 'File d\'attente des tâches',
                si: 'Spool-in',
                so: 'Spool-out',
                state: 'Actif',
                subject: 'Périphérique IPP',
                uri: 'Adresse',
            }
        },
        jobtype: {
            title: 'Types de Tâches',
            subtitle: `
                Cette page répertorie les types de tâches configurés, et les correspondances sont mises en évidence visuellement.
                En cliquant sur une entrée, les détails sont affichés sur le côté droit.
            `,
            toggleHideEmptySettings: ['Les valeurs vides et en % sont masquées. Cliquez pour afficher', 'Cliquez pour masquer les valeurs vides ou en %'],
            nodeInspector: {
                category: 'Catégorie',
                classificationGroup: 'Classification',
                classifiedworkflowuuid: 'Workflow (par Classification)',
                datatype: 'Type de Données',
                deldays: 'Supprimer Après Jours',
                description: 'Description',
                initialtextstatus: 'Statut Texte Initial',
                inputchannel: 'Canal d\'Entrée',
                jobAttributesGroup: 'Attributs de Tâche pour la Classification',
                name: 'Nom',
                priority: 'Priorité',
                processingGroup: 'Traitement',
                senderhost: 'Hôte Expéditeur',
                sourcefile: 'Fichier Source',
                starttype: 'Type de Démarrage',
                starttypes: ['Automatique', 'Maintenu', 'Maintenu temporellement'],
                subject: 'Types de Tâches',
                textstatus: 'Statut Texte',
                ticketfile: 'Fichier Ticket',
                title: 'Titre',
                userkey: 'Clé de l\'Utilisateur',
                username: 'Nom d\'Utilisateur',
                uuid: 'Uuid',
                workflowsGroup: 'Workflows',
                workflowuuid: 'Workflow (Traitement)',
                xid: 'Xid',
            },
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
            title: 'Paramétrage',
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
        serverInfo: {
            title: 'Informations du Serveur',
            subtitle: `
                La liste suivante contient les informations fournies par le serveur.
                Les correspondances sont mises en évidence en couleur.
            `,
        },
        serverProperties: {
            title: 'Configuration Serveur (server.properties)',
            subtitle: `
                La liste suivante contient toutes les entrées de configuration renvoyées par le serveur,
                correspondant au fichier server.properties. Les correspondances sont mises en évidence en couleur.
            `,
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
        useraccount: {
            title: 'Comptes Utilisateur',
            subtitle: `
                Le tableau contient les comptes utilisateur enregistrés dans sysHUB.
                Les correspondances sont mises en évidence en couleur.
            `,
            toggleHideUnassignedRoles: ['Les rôles non assignés sont cachés. Cliquez pour afficher', 'Cliquez pour masquer les rôles non assignés'],
            nodeInspector: {
                email: 'E-mail',
                enabled: 'Activé',
                forcechange: 'Doit changer le mot de passe',
                modified: 'Modifié',
                name: 'Nom',
                roles: 'Rôles',
                subject: 'Compte Utilisateur',
                type: 'Type',
                types: {
                    'INTERNAL': 'Utilisateur sysHUB',
                    'LDAP': 'Utilisateur de domaine',
                    'WINDOWS': 'Utilisateur Windows',
                },
                uuid: 'Uuid',
            },
        },
        workflow: {
            title: 'Flux de travail',
            subtitle: `
                Dans la liste, les flux de travail sont mis en évidence en couleur s'il y a une correspondance dans les métadonnées ou dans le flux de travail lui-même.
                Cliquez sur une entrée pour voir les détails ou sur l'icône du diagramme de flux pour afficher le flux de travail.
            `,
            unused: 'Non utilisé',
            unusedTitle: 'Le workflow n\'est pas référencé et donc probablement pas utilisé.',
            nodeInspector: {
                cacheable: 'Cache activé',
                categoryName: 'Catégorie',
                description: 'Description',
                format: 'Format',
                formats: ['Client Natif', 'Client Web'],
                lockedByUser: 'Verrouillé par l\'utilisateur',
                modified: 'Modifié',
                name: 'Nom',
                subject: 'Workflow',
                uuid: 'Uuid',
                version: 'Version',
            },
        },
    },
    search: {
        errors: {
            phraseEmpty: 'Veuillez entrer un terme de recherche d\'au moins [0] caractères.'
        },
        filter: {
            categoryFilter: 'Filtrer par catégorie',
            categoryFilterNone: 'Aucun appliqué',
            excludeBComments: 'Ignorer les commentaires [B]',
            excludeBCommentsWorkflowHint: 'sauf pour le contenu du workflow',
            includeUuids: 'Rechercher les UUID',
            searchWorkflowContent: 'Inclure le contenu du workflow',
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
        cardTitle: 'Recherche de »[0]«',
        progress: {
            done: 'Terminé. Redirection vers la vue des résultats...',
            evaluatingResults: 'Les résultats ont été chargés depuis le serveur et sont en cours de préparation pour l\'affichage...',
            queryingObjects: 'Les objets correspondants sont maintenant chargés depuis le serveur et peuvent être mis en cache dans le navigateur...',
            preparingResultView: 'Préparation de la vue des résultats...',
            waitingForResults: 'La demande de recherche a été envoyée au serveur. En attente des résultats...',
        }
    },
    workflowUi: {
        title: 'Workflow »[0]«',
        subtitle: '',
        loading: ['Chargement du workflow...', 'Chargement du workflow »[0]«...'],
        failed: {
            noCache: 'Aucun workflow n\'a pu être trouvé sous l\'identifiant de workflow spécifié.',
            noUuid: 'L\'URL appelée est défectueuse.',
        },
        failedBackToFindr: 'Retour à la page d\'accueil',
        failedCommon: 'Erreur lors de l\'affichage du workflow : ',
        errorConnector: 'On Error',
        celement: {
            instanceName: 'Instance',
            subject: 'CElement',
            variable: 'Variable',
        },
        decision: {
            subject: 'Décision',
        },
        process: {
            subject: ['Processus', 'Processus en boucle'],
            deprecated: 'Ce processus est marqué comme obsolète et ne doit plus être utilisé.',
            referencedParametersetTitle: 'Paramètres référencés',
        },
        shared: {
            agent: 'Agent',
            loop: 'Boucle tableau',
            parametersetRef: 'Ensemble de paramètres',
        },
        workflow: {
            startpoint: 'Point de départ',
            subject: ['Workflow', 'Workflow en boucle'],
            threads: 'Threads',
        },
        versionsDropdown: {
            title: ['[0] Version', '[0] Versions'],
            titleActiveVersion: ['actuelle : [0]', 'en cours : [0]'],
            versionstr: '[0].[1]',
            isactive: 'actif',
            lastactive: 'en cours'
        },
        referencesDropdown: {
            title: ['Aucune référence', '[0] référence', '[0] références'],
            occurencesInWorkflow: '[0]x dans [1]',
        },
    },
};
