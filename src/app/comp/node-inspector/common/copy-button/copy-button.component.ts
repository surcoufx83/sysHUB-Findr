import { Component, Input } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { ToastsService } from 'src/app/svc/toasts.service';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss'
})
export class CopyButtonComponent {

  @Input() valueToCopy!: string | number;

  constructor(
    private l10nService: L10nService,
    private toastsService: ToastsService,
  ) { }

  copy() {
    navigator.clipboard.writeText(`${this.valueToCopy}`);
    this.toastsService.addToast({
      delay: 2500,
      message: this.l10n(this.l10nphrase.result.common.nodeInspector.copied, [this.valueToCopy]),
    });
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

}
