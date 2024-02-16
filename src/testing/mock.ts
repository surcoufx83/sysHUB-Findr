import { Observable, of } from "rxjs";
import { L10nDe } from "src/app/svc/i10n/de";
import { L10nEn } from "src/app/svc/i10n/en";
import { L10nFr } from "src/app/svc/i10n/fr";
import { L10nLocale } from "src/app/svc/i10n/l10n-locale";

export class MockAppInitService {

    public environment = {
        api: {
            variant: undefined,
            syshub: {
                host: 'http://localhost:8088/',
                basic: {
                    enabled: false,
                },
                oauth: {
                    enabled: true,
                    clientId: 'mockClientId',
                    clientSecret: 'mockClientSecret',
                    scope: 'private+public'
                },
            }
        },
        appInitializationFailure: {
            configStatusCode: 200,
        }
    };
    public loading = false;

    constructor() { }

    load() {
        return Promise.resolve(true);
    }

}

export class MockL10nService {
    private userLocale: string = 'en';
    private datefnsLocale = {}; // Simulieren Sie ein einfaches Objekt für date-fns Locale
    private locales: { [key: string]: L10nLocale } = {
        'en': L10nEn,
        'en-GB': L10nEn,
        'en-US': L10nEn,
        'de': L10nDe,
        'de-DE': L10nDe,
        'fr': L10nFr,
        'fr-FR': L10nFr,
    }

    public userLocaleSub: Observable<string> = of(this.userLocale);

    // Vereinfachte Getter für Sprache und Locale
    public get lang(): string {
        return this.userLocale;
    }

    public get locale(): L10nLocale {
        return this.locales[this.userLocale];
    }

    // Vereinfachte Implementierungen der Methoden
    public cur(value: number, sign: string): string {
        return `${sign}${value}`;
    }

    public date(value: string | number | Date, form: string): string {
        return typeof value === 'string' ? value : value.toString();
    }

    public getDateFnsLocale() {
        return this.datefnsLocale;
    }

    public dec(value: number, minFractionDigits: number = 0, maxFractionDigits: number | undefined = undefined): string {
        return value.toFixed(maxFractionDigits ?? minFractionDigits);
    }

    public ln(content: string, replacements: any[]): string {
        let replacedContent = content;
        replacements.forEach((replacement, index) => {
            replacedContent = replacedContent.replace(`[${index}]`, replacement);
        });
        return replacedContent;
    }

    public get supportedLocales(): string[] {
        return ['en', 'de', 'fr'];
    }

    public switchTo(locale: string) {
        this.userLocale = locale;
        // Kein location.reload im Mock
    }
}