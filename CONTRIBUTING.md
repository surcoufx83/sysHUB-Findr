# sysHUB Findr Contributing guide
Dieser Guide hilft dabei, ein System für die Mitentwicklung am Findr vorzubereiten.
Es gibt zwei klare Vorgaben für das Einbringen einer eigenen Entwicklung zum Findr:
1. Sämtlicher Code ist englisch geschrieben. Deutsche Funktionsnamen oder Variablennamen werden zurückgewiesen.
2. Der Findr ab Version 2022 wird mit automatischen Tests validiert. Bevor ein eigener Entwicklungsbeitrag im Gitlab veröffentlicht wird, stelle sicher, dass der Befehl `npm run test` keine Fehler anzeigt (siehe Abschnitt [Running unit tests](#running-unit-tests)).

Viele Schritte der Entwicklung basieren auf Kommandozeilenbefehlen. Diese sind in diesem Guide entsprechend markiert, zum Beispiel: `node -v` um die Version des installierten Node.JS zu ermitteln.

## ⚠️ Work in progress
Diese Software und ebenso der Contributing guide befindet sich noch in der Entwicklung.

## Voraussetzungen
Der Findr basiert auf Angular (17.x) und Node.JS. Entsprechende Resourcen müssen installiert sein um entwickeln zu können.
1. NodeJS installiert inkl. npm: https://nodejs.org/en/download/
2. Mit den Kommandozeilen-Befehlen `node -v` und `npm -v` sicherstellen, dass beides installiert ist
3. Angular CLI installieren: `npm install -g @angular/cli`
4. Git Kommandozeilen Tools installieren: https://git-scm.com/ (optional ein beliebiges Git GUI installieren)
5. Einen Codeeditor wie Visual Studio Code installieren: https://code.visualstudio.com/
6. Das Repository des Findr klonen: `git clone https://cdegitlab.westeurope.cloudapp.azure.com/sfuchs/syshubfindr.git` (lädt den Code in ein Unterverzeichnis des aktuellen Verzeichnisses der Kommandozeile, ggf. vorher in ein anderes Verzeichnis wechseln)
7. Per `npm i` notwendige Ressourcen installieren

## Development server
Während der Entwicklung stellt Node.JS einen Live-Server bereit, mit dem man die Entwicklung prüfen kann. Nach jeder Änderung aktualisiert sich das Browser-Fenster automatisch.
Zum Ausführen des Live Server im Projektverzeichnis den Befehl `npm run start` ausführen und kurz warten. Es wird automatisch ein Browserfenster geöffnet.

## Build
Der Befehl `npm run build` erzeugt im Unterverzeichnis `dist` ein Projektverzeichnis welches im sysHUB `webapps`-Ordner eingespielt werden kann. Das ist für die Produktivsetzung erforderlich.

## Running unit tests
Mit dem Befehl `npm run test` werden Komponenten und Services innerhalb der Applikation geprüft. Entsprechende Testszenarien sind im Repository enthalten. Werden Änderungen am Code vorgenommen ist mit dem Test sicherzustellen, dass keine Fehler angezeigt werden. Andernfalls besteht die Gefahr von Fehlern auf Kundensystemen. Sofern eine Änderung absolut erforderlich ist, ist auch der Test anzupassen.

## Aktualisieren von Fremdbibliotheken
Das Aktualisieren von Abhängigkeiten erfolgt mit den Befehlen: `npm update -g` und `npm update`. Das führt zu einer Aktualisierung der lokalen Dateien. Damit diese in eine webapp einfließen muss das Paket wie unter [Build](#build) beschrieben neu erstellt werden.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
