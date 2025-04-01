import { Component } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';

@Component({
  selector: 'app-config-invalid',
  templateUrl: './config-invalid.component.html',
  styleUrl: './config-invalid.component.scss'
})
export class ConfigInvalidComponent {

  constructor(private l10nService: L10nService) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

}
