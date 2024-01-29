# sysHUB Findr
Dokumentation zum sysHUB Findr. Weitere Informationen über aktuelle Änderungen sind im [Changelog](CHANGELOG.md) zu finden. Informationen zur Mitarbeit in dem Projekt gibt es im Abschnitt [Contributing](CONTRIBUTING.md).

## ⚠️ Work in progress
Diese Software befindet sich noch in der Entwicklung. Sie basiert auf dem [COSMOSFindr aus Version 2.9.1](https://cdegitlab.westeurope.cloudapp.azure.com/sfuchs/COSMOSFindr) der aber durch viele Änderungen in sysHUB und der REST API hinfällig wurde. Der sysHUBFindr ist der generalüberholte Findr mit modernen Webkomponenten und einem neuen Outfit auf Grundlage des Material Design von Google.

## Voraussetzungen
Um diese Software nutzen zu können und dürfen ist folgendes erforderlich:
- NT-ware uniFLOW sysHUB ab Version 2022.1.0
- sysHUB Lizenz REST API

## Erforderliche Berechtigung für Anwender <span style="color:red">Incomplete</span>
Nutzer des Findr müssen im sysHUB mindestens die folgenden Berechtigungen besitzen:
- Rolle gem. Vorgabe Authorisierungsserver
- Permission PERM_IADMINSERVICE_GETWORKFLOWITEM: Erforderlich für die Ausführung des Workflows der die Suchanfrage bearbeitet und das sysHUB durchsucht.
- Permission ...

## Konfiguration (Work in progress [see #3](https://github.com/surcoufx83/sysHUB-Findr/issues/3))
Die Konfiguration für ein Kundensystem erfolgt vorrangig in der `environment.prod.ts` (siehe [src\environments](src\environments)). Sofern die Datei nicht existiert, erzeuge eine Kopie der `environment.prod.template.ts` und der `environment.template.ts` und entferne jeweils das `.template` aus dem Dateinamen.

In der Datei müssen entweder Basic- oder OAuth Credentials angegeben und anschließend muss das gesamte Projektverzeichnis kompiliert werden (siehe [Contributing Guide - Abschnitt Build](CONTRIBUTING.md#build)). Durch die direkte Einbindung in den Source code lädt die Seite schneller, mit weniger HTTP-Anfragen und ohne nachträgliches Rendering.

### Konfigurationsparameter
| Parameter                 | Werte (Default)                | Verwendung und Hinweise                                                                                                                                                                                                                                                                         |
| ------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| production                | `true` oder `false`            | **Niemals ändern.** Immer `true` in der `environment.prod.ts` und immer `false` in der `environment.ts`.                                                                                                                                                                                        |
| app.baseUrl               | String (`/findr/`)             | Der relative Pfad über den die Webapp vom Webserver ausgeliefert wird. Heißt der Ordner innerhalb von `webapps` `findr`, so muss der Name auch in `app.baseUrl` angegeben sein (mit führenden und abschließendem `/`).                                                                          |
| app.promotionLink         | Url (`""`)                     | Beliebige Url. Ist dieser Parameter nicht leer, wird in der Titelzeile des Findr rechts neben dem Suchsymbol ein Link zu dieser Url angezeigt. Im Standard ist es der Link zum Findr Sourcecode.                                                                                                |
| app.minPhraseLength       | Numerisch (`3`)                | Beliebige Zahl. Mindestanzahl an Zeichen die im Suchfeld eingegeben sein müssen, bevor die Suche auch ausgeführt wird.                                                                                                                                                                          |
| i10n.fallback             | String (`en`)                  | Beliebiger gültiger Sprachcode zweistellig. Der Findr enthält Übersetzungsdateien [siehe Lokalisierung](#lokalisierung-i10n) für Deutsch (`de`) und Englisch (`en`). Fordert der Browser eine andere Sprache an, wird die Fallback-Sprache geliefert, die durch diesen Parameter bestimmt wird. |
| storage. ...              | String                         | Alle Einträge innerhalb des `storage`-Objekts definieren Speicherpfade im Browsercache. **Nicht verändern.**                                                                                                                                                                                    |
| syshub.host               | Url (`http://localhost:8088/`) | Basis-Url zur Syshub-Installation. Immer sicherstellen das ein abschließender `/` gesetzt ist. Diese Url ist die Basis für die Anmeldung am sysHUB und auch die Aufrufe gegen die Rest-API.                                                                                                     |
| syshub.basic.enabled      | `true` oder `false` (`false`)  | Definiert, ob sich die Webseite per Basic-Authentifizierung am sysHUB Host anmeldet. Wenn `true` müssen die folgenden drei Parameter username, password und provider befüllt sein.                                                                                                              |
| syshub.basic.username     | String (`""`)                  | Name des Useraccounts der die Berechtigung zur Anmeldung am sysHUB besitzt. Die erforderliche Rolle wird im sysHUB API Server (gem. nachfolgendem Parameter provider) festgelegt.                                                                                                               |
| syshub.basic.password     | String (`""`)                  | Zugehöriges Passwort für den Useraccount.                                                                                                                                                                                                                                                       |
| syshub.basic.provider     | String (`""`)                  | Name eines registrierten API Server im sysHUB (Scope `private;public` erforderlich)                                                                                                                                                                                                             |
| syshub.oauth.enabled      | `true` oder `false` (`false`)  | Definiert, ob sich die Webseite per OAUTH2-Authentifizierung am sysHUB Host anmeldet. Wenn `true` müssen die folgenden beiden Parameter clientId und clientSecret befüllt sein. Nutzer der Webseite werden vor der ersten Suche aufgefordert sich anzumelden.                                   |
| syshub.oauth.clientId     | String (`findr`)               | Name eines im sysHUB konfigurierten Authorisierungsserver (Scope `private;public` erforderlich, Resource Ids `cosmos-web;cosmos-webapi` erforderlich)                                                                                                                                           |
| syshub.oauth.clientSecret | String (`...`)                 | Das zur Client Id zugehörige secret.                                                                                                                                                                                                                                                            |

### Theme
<img style="float: right; margin-left: 1rem;" src="docs/theme-switch.png" alt="Wechsel des Themas (hell/dunkel) über das Menü">
Der Findr enthält einen automatischen Design-Wechsel zwischen hellem und dunklem Modus abhängig von den Benutzerpräferenzen, eingestellt im Betriebssystem. über das Bürger-Menü rechts oben kann durch den Benutzer auch manuell ein Thema festgelegt werden.
<br clear="all"/>

### Lokalisierung (L10N)
<img style="float: left; margin-right: 1rem;" src="docs/locale-switch.png" alt="Wechsel der Sprache über das Menü">
Der Findr ist übersetzt in die Sprachen Deutsch, Englisch, Französisch. Beim Laden der Seite bestimmt die Browser-Standardeinstellung (i.d.R. = Betriebssystem-Sprache), welche Sprache angezeigt wird. Anwender können über das Bürger-Menü rechts oben eine andere Sprache auswählen.
<br clear="all"/>

### Sucheinstellungen auf der Startseite
Über die Startseite können Sucheinstellungen vorgenommen werden, die über die Suche in der Navigationsleiste aus Platzgründen nicht verfügbar sind.  Diese zusätzlichen Einstellungen sind im Findr als "erweiterte Filter" bezeichnet. In diese sind folgende Optionen enthalten:
- Suchen nur in Elementen die einer Kategorie zugeordnet sind
- `[B]`-Kommentare ignorieren (Standard-Kommentare in Prozessen und Beschreibungstexten)
- UUID's durchsuchen
- Inklusive Workflowinhalte

In den Findr Standardeinstellungen sind diese wie folgt gesetzt:
- Kategorie-Filter: deaktiviert
- `[B]`-Kommentare ignorieren: aktiviert
- UUID's durchsuchen: deaktiviert
- Inklusive Workflowinhalte: aktiviert

Werden diese Einstellungen durch den Anwender auf der Startseite geändert und dann eine Suche ausgeführt, so werden diese Einstellungen für den Anwender als neuer Standard im Browser gespeichert. Ebenso verwendet die Suche in der Navigationsleiste zukünftig diese Einstellungen.

## Vorschau auf die Funktionalitäten <span style="color:red">Incomplete</span>

### Anmeldeseite<span style="color:red">Incomplete</span>

### Startseite
Die Startseite dient der Konfiguration einer Suchanfrage. Die Suchanfrage wird für das nächste mal im Browsercache gespeichert. Das Suchfeld in der obersten Navigationsleiste bietet jederzeit den schnellsten Weg eine weitere Suche zu starten (Einstellungen der vorherigen Suche werden übernommen).

| Desktopansicht                                              | Mobile Ansicht                                                                               |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Startseite in der Desktop-Ansicht](docs/home-desktop.png) | <img src="docs/home-mobile.png" alt="Startseite in der Ansicht für Mobilgeräte" width="85%"> |

### Suche läuft
Nachdem die Suche gestartet wird, wird der Anwender auf eine Seite zum Status der Suche weitergeleitet. Diese wird zusammen mit einem sich bewegenden Balken angezeigt, bis das Ergebnis der Suche vom sysHUB zurückgemeldet und aufbereitet wurde.
Wurde bei der Suche eine der Optionen Zertifikatsspeicher, Server properties, Server infos, Drucker oder Benutzer gewählt, führt das dazu, dass nach der herkömlichen Suche die entsprechenden Rest API Endpoints aufgerufen und untersucht werden.

| Desktopansicht                                                    | Mobile Ansicht                                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Suche läuft in der Desktop-Ansicht](docs/searching-desktop.png) | <img src="docs/searching-mobile.png" alt="Suche läuft in der mobilen Ansicht" width="100%"> |

### Ergebnis-Zusammenfassung<span style="color:red">Incomplete</span>
Sobald das Suchergebnis verarbeitet wurde, wird dem Anwender eine Zusammenfassung angezeigt. In der Trefferliste werden jeweils für Konfiguration, Parameterset, Auftragstypen, Workflows, Zertifikatsspeicher, Server properties, Server infos, Drucker und Benutzer listenartig dargestellt, welche Treffer ermittelt wurden. In dieser Zusammenfassung gibt es für Konfiguration und Parameterset keine Baumdarstellung.

An jeder Stelle der Ergebnisse werden Treffer innerhalb eines Wertes mit einem blassen gelb hinterlegt.

über die Navigationsleiste (oberhalb der Zusammenfassung) springt der Anwender in die jeweilige Detailansicht. Die Buttons sind ausgegraut dargestellt, wenn in dem Bereich der Suchbegriff nicht gefunden wurde. 
Zusätzlich lässt sich die Trefferliste exportieren. Der Export enthält eine Json-Datei welche die Suchanfrage inkl. der Ergebnisse beinhaltet. Der Export kann zum Beispiel zu Diagnosezwecken in einem anderen Findr importiert werden.

| Desktopansicht                                                                                     | Mobile Ansicht                                                                                                              |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ![Trefferliste Config in der Desktop-Ansicht](docs/result-overview-desktop.png)                    | <img src="docs/result-overview-mobile.png" alt="Trefferliste Config in der mobilen Ansicht" width="91%">                    |
| ![Trefferliste Parameterset in der Desktop-Ansicht](docs/result-overview-parameterset-desktop.png) | <img src="docs/result-overview-parameterset-mobile.png" alt="Trefferliste Parameterset in der mobilen Ansicht" width="91%"> |
| ![Trefferliste Auftragstypen in der Desktop-Ansicht](docs/result-overview-jobtypes-desktop.png)    | <img src="docs/result-overview-jobtypes-mobile.png" alt="Trefferliste Auftragstypen in der mobilen Ansicht" width="91%">    |
| ![Trefferliste Workflows in der Desktop-Ansicht](docs/result-overview-workflows-desktop.png)       | <img src="docs/result-overview-workflows-mobile.png" alt="Trefferliste Workflows in der mobilen Ansicht" width="91%">       |

### Ergebnisansicht Konfiguration und Parametersets
Nach einem Klick auf Konfig oder Parameterset in der zweiten Navigationsleiste wird die jeweilige detaillierte Ergebnisansicht geladen. Dabei wird für Konfig wie auch für Parametersets die komplette Baumstruktur dargestellt. Alle Knoten in denen mindestens ein Treffer gefunden wurde sind automatisch aufgeklappt und mit einem grünen Icon versehen. Die Icons in der Baumstruktur repräsentieren den Datentyp. 

In der rechten Spalte (mobile Ansicht oberhalb) werden alle Details zu einem Eintrag angezeigt, sobald der Cursor sich über einen Eintrag der Baumstruktur bewegt.
Klickt der Anwender die weiße Pinnadel bei den Details oder einen Eintrag in der Baumstruktur an, wird dieser Eintrag angepinnt und das Bewegen des Maus Cursors wählt kein anderes Element automatisch mehr aus. Im angepinnten Modus (ersichtlich an der blauen Pinnadel) ist es möglich beliebig durch die Baumstruktur zu scrollen, ohne den gewählten Eintrag aus dem Blick zu verlieren.

Mit einem Klick auf das Copy-Icon neben einem Detaileintrag kann der Wert kopiert werden.

| Desktopansicht                                                                                | Mobile Ansicht                                                                                                         |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![Baumansicht Config Mouseover in der Desktop-Ansicht](docs/result-config-desktop.png)        | <img src="docs/result-config-mobile.png" alt="Baumansicht Config Mouseover in der mobilen Ansicht" width="91%">        |
| ![Baumansicht Config Angepinnt in der Desktop-Ansicht](docs/result-config-pinned-desktop.png) | <img src="docs/result-config-pinned-mobile.png" alt="Baumansicht Config Angepinnt in der mobilen Ansicht" width="91%"> |

### Ergebnisansicht Auftragstypen<span style="color:red">Incomplete</span>
Die Ergebnisansicht der Auftragstypen ist nur wenig anders, als die der Konfig. Es gibt natürlich keine Baumstruktur, stattdessen werden die Elemente als Liste dargestellt. Wie auch bei Konfig und Parameterset gibt es im rechten Bereich die Detailinformationen zu einem Auftragstypen inkl. der Jobattribute-Klassifizierung.

| Desktopansicht                                                                            | Mobile Ansicht                                                                                                     |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ![Ergebnisansicht Auftragstypen in der Desktop-Ansicht](docs/result-jobtypes-desktop.png) | <img src="docs/result-jobtypes-mobile.png" alt="Ergebnisansicht Auftragstypen in der mobilen Ansicht" width="91%"> |

## Ergebnisliste exportieren und importieren <span style="color:red">Incomplete</span>

## Fehlerdiagnose Findr <span style="color:red">Incomplete</span>
