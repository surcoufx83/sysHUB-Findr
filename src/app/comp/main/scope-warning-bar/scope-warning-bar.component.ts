import { Component } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';

@Component({
  selector: 'app-scope-warning-bar',
  templateUrl: './scope-warning-bar.component.html',
  styleUrl: './scope-warning-bar.component.scss'
})
export class ScopeWarningBarComponent {

  constructor(private l10nService: L10nService) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

}
