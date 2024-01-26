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
    navbar: {
        aboutLink: 'À propos',
        searchPlaceholder: '🔍 Terme de recherche, par exemple, currentjob',
        clearCacheLink: 'Effacer le cache',
        helpLink: 'Aide',
        homeLink: 'Accueil',
        localeIsActive: 'actif',
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
        config: {
            title: 'Résultats dans la Configuration, Recherche de "[0]"',
            subtitle: `
                Cette page affiche la structure arborescente complète de la configuration
                experte, avec les résultats mis en évidence visuellement. En survolant une
                entrée, elle sera affichée dans la section de droite. Si la punaise est active,
                il n'y aura pas de changement au survol, mais il y en aura lors de la
                cliquaison.
            `,
            properties: {
                description: 'Description',
                name: 'Nom',
                path: 'Chemin',
                type: 'Type d\'élément',
                uuid: 'UUID',
                value: 'Valeur',
            },
            selected: 'Détails pour "[0]"'
        },
        header: {
            title: 'Résultats de la Recherche pour "[0]"',
            subtitle: `
                L'aperçu fournit un résumé succinct des résultats. Pour plus de détails,
                cliquez sur les boutons dans leurs catégories respectives.
                Bouton gris = pas de résultat dans cette catégorie.
            `
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
            title: 'Correspondances dans le Parameterset, Recherche de "[0]"',
            subtitle: `
                Sur cette page, la structure arborescente complète du Parameterset est affichée,
                et les correspondances sont mises en évidence visuellement.
                En survolant une entrée avec le curseur, elle est affichée sur le côté droit.
                Si la punaise est active, il n'y aura pas de changement au survol, mais il y en aura lors de la cliquaison.
            `,
            properties: {
                description: 'Description',
                name: 'Nom',
                path: 'Chemin',
                type: 'Type d\'Élément',
                uuid: 'UUID',
                value: 'Valeur',
            },
            selected: 'Détails pour "[0]"'
        },
        toolbar: {
            certStore: 'Magasin de Certificats : [0]',
            config: 'Configuration : [0]',
            exportResults: 'Exporter les Résultats de la Recherche',
            ippDevices: 'Imprimantes : [0]',
            jobtypes: 'Types de Travail : [0]',
            matches: 'résultats',
            noMatches: 'aucun résultat',
            overview: 'Vue d\'ensemble',
            parameterset: 'Parameterset : [0]',
            serverConfig: 'Configuration du Serveur : [0]',
            serverInfo: 'Informations sur le Serveur : [0]',
            users: 'Utilisateurs : [0]',
            workflows: 'Workflows : [0]',
        },
        showWorkflow: 'Afficher le Workflow'
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
            serverConfig: 'Configuration du Serveur',
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
