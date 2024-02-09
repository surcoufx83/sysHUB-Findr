import { Component } from '@angular/core';
import { AppInitService } from 'src/app/svc/app-init.service';
import { L10nService } from 'src/app/svc/i10n.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  currentLocale: string;

  constructor(
    appInitService: AppInitService,
    l10nService: L10nService,
  ) {
    this.currentLocale = l10nService.lang.length > 2 ? l10nService.lang.substring(0, 2) : l10nService.lang;
  }

}
